#!/usr/bin/env node
// Sends approved trade emails through Resend, within the daily cap.
//   node scripts/ops/send-emails.mjs [--dry-run] [--commit]
// Needs RESEND_API_KEY and OUTREACH_FROM ("James at HerbalBath <james@herbalbathsg.com>",
// from a domain verified in Resend). Optional: OUTREACH_REPLY_TO, OUTREACH_BCC (a copy
// of every email to you). Logs carry counts only.

import { Changes } from "./lib/changes.mjs"
import { STATE_FALLBACK, loadConfig, pauseReason } from "./lib/config.mjs"
import { sgToday } from "./lib/paths.mjs"
import { Telegram } from "./lib/telegram.mjs"
import { Vault, capped } from "./lib/vault.mjs"
import { LEADS_FALLBACK, OUTBOX_FALLBACK } from "./tools/b2b.mjs"
import { ACTIVITY_FALLBACK } from "./tools/cmo.mjs"

const CLOSED = new Set(["replied", "meeting", "won", "lost", "unsubscribed", "do-not-contact"])

export async function sendViaResend(email, { key = process.env.RESEND_API_KEY, from = process.env.OUTREACH_FROM, replyTo = process.env.OUTREACH_REPLY_TO, bcc = process.env.OUTREACH_BCC, fetchImpl = fetch } = {}) {
  const res = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to: [email.to], subject: email.subject, text: email.body, ...(replyTo ? { reply_to: replyTo } : {}), ...(bcc ? { bcc: [bcc] } : {}) }),
  })
  if (!res.ok) throw new Error(`Resend returned ${res.status}`)
  return (await res.json()).id
}

async function main() {
  const dryRun = process.argv.includes("--dry-run")
  const commit = process.argv.includes("--commit")
  const config = loadConfig()
  const vault = new Vault()
  const changes = new Changes({ vault })
  const paused = pauseReason({ config, state: vault.read("state", STATE_FALLBACK), agent: "b2b" })
  if (paused) return console.log(`Emails: skipped, ${paused}.`)
  if (!dryRun && !(process.env.RESEND_API_KEY && process.env.OUTREACH_FROM)) return console.log("Emails: Resend isn't set up (RESEND_API_KEY, OUTREACH_FROM).")

  const today = sgToday().date
  const sgDate = (iso) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Singapore" })
  const { emails } = vault.read("outbox", OUTBOX_FALLBACK)
  const leads = vault.read("leads", LEADS_FALLBACK).leads
  const sentToday = emails.filter((e) => e.status === "sent" && sgDate(e.sentAt) === today).length
  const budget = Math.max(0, config.limits.emailsPerDay - sentToday)
  const ready = emails.filter((e) => e.status === "approved").sort((a, b) => a.createdAt.localeCompare(b.createdAt)).slice(0, budget)
  if (!ready.length) return console.log(`Emails: nothing to send (${budget} left today).`)

  const results = []
  for (const e of ready) {
    const lead = leads.find((l) => l.id === e.leadId)
    if (!lead || CLOSED.has(lead.status)) {
      results.push({ id: e.id, status: "skipped" })
      continue
    }
    if (dryRun) {
      results.push({ id: e.id, status: "would send" })
      continue
    }
    try {
      const providerId = await sendViaResend(e)
      results.push({ id: e.id, status: "sent", providerId, org: e.org })
    } catch (err) {
      results.push({ id: e.id, status: "failed", error: err.message })
    }
  }
  if (dryRun) return console.log(`Emails: would send ${results.filter((r) => r.status === "would send").length}.`)

  const now = new Date().toISOString()
  changes.private("outbox", OUTBOX_FALLBACK, (v) => {
    for (const r of results) {
      const e = v.emails.find((x) => x.id === r.id)
      if (!e || e.status !== "approved") continue
      if (r.status === "sent") Object.assign(e, { status: "sent", sentAt: now, providerId: r.providerId })
      else if (r.status === "skipped") e.status = "skipped"
      else Object.assign(e, { status: "failed", error: r.error, failedAt: now })
    }
  })
  const sentIds = new Set(results.filter((r) => r.status === "sent").map((r) => r.id))
  changes.private("leads", LEADS_FALLBACK, (v) => {
    for (const e of ready.filter((x) => sentIds.has(x.id))) {
      const lead = v.leads.find((l) => l.id === e.leadId)
      if (lead && lead.status === "new") lead.status = "contacted"
      if (lead) lead.lastContact = now
    }
  })
  const sent = results.filter((r) => r.status === "sent")
  const failed = results.filter((r) => r.status === "failed").length
  changes.private("activity", ACTIVITY_FALLBACK, (v) => {
    v.events = capped([...v.events, { at: now, agent: "email-sender", status: "done", summary: `Sent ${sent.length} trade email(s)${failed ? `, ${failed} failed` : ""}.` }], 500)
  })
  await new Telegram().send(`**Trade emails sent:** ${sent.length}${sent.length ? ` (${sent.map((r) => r.org).join(", ")})` : ""}${failed ? `\n${failed} failed; they'll show in /drafts history.` : ""}`).catch(() => {})
  console.log(`Emails: sent ${sent.length}, failed ${failed}, skipped ${results.filter((r) => r.status === "skipped").length}.`)
  if (commit) await changes.commitToMain("autopilot(emails): record sends")
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main().catch((e) => {
    console.error(`send-emails: ${e.message}`)
    process.exit(1)
  })
}
