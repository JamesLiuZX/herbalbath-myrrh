#!/usr/bin/env node
// Sends the operator's approved trade emails through Resend (ops/OPERATOR.md,
// "Every weekday, after the shift"). The outbox and leads live in the private
// store (OPS_PRIVATE_DIR); this prints counts only.
//
//   node scripts/ops/send-outbox.mjs [--dry-run]
//
// It sends nothing unless every one of these holds:
//   - ops/autonomy.json: paused is false, engines.email.paused is false and
//     actions.emails is "auto" (James sets that after approving the first batch);
//   - it is a weekday in Singapore;
//   - RESEND_API_KEY and OUTREACH_FROM are set (a dry run needs neither).
// Each run sends at most limits.emailsPerDay minus what already went out today,
// oldest approved first, and never to a lead that has replied or opted out.

import { loadConfig } from "./lib/config.mjs"
import { sgToday } from "./lib/paths.mjs"
import { PlainStore } from "./lib/plain-store.mjs"
import { sendViaResend } from "./send-emails.mjs"

const CLOSED = new Set(["replied", "meeting", "won", "lost", "unsubscribed", "do-not-contact"])
const WEEKEND = new Set(["Saturday", "Sunday"])
const sgDate = (iso) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Singapore" })

/** Why nothing may be sent right now, or null. */
export function holdReason({ config, env = process.env, now = new Date(), dryRun = false }) {
  if (config.paused) return "ops/autonomy.json has paused: true"
  if (config.engines?.email?.paused) return "the email engine is paused in ops/autonomy.json"
  if (config.actions?.emails !== "auto") return 'actions.emails is not "auto": drafts wait for James'
  if (WEEKEND.has(sgToday(now).weekday)) return "trade emails go out on weekdays only"
  if (!dryRun && !(env.RESEND_API_KEY && env.OUTREACH_FROM)) return "waiting: Resend key and sender address"
  return null
}

/** Sends what is due and records it in the private store. Returns counts only. */
export async function sendOutbox({ store = new PlainStore(), config = loadConfig(), env = process.env, fetchImpl = fetch, now = new Date(), dryRun = false } = {}) {
  if (!store.available) return { held: "command repo not attached", sent: 0, failed: 0, skipped: 0 }
  const held = holdReason({ config, env, now, dryRun })
  if (held) return { held, sent: 0, failed: 0, skipped: 0 }

  const today = sgToday(now).date
  const outbox = store.read("outbox", { emails: [] })
  const leadBook = store.read("leads", { leads: [] })
  const sentToday = outbox.emails.filter((e) => e.status === "sent" && sgDate(e.sentAt) === today).length
  const budget = Math.max(0, (config.limits?.emailsPerDay ?? 0) - sentToday)
  const ready = outbox.emails.filter((e) => e.status === "approved").sort((a, b) => a.createdAt.localeCompare(b.createdAt)).slice(0, budget)

  const counts = { held: null, sent: 0, failed: 0, skipped: 0, wouldSend: 0, leftToday: budget }
  const stamp = now.toISOString()
  for (const email of ready) {
    const lead = leadBook.leads.find((l) => l.id === email.leadId)
    if (!lead || CLOSED.has(lead.status)) {
      if (!dryRun) email.status = "skipped"
      counts.skipped++
      continue
    }
    if (dryRun) {
      counts.wouldSend++
      continue
    }
    try {
      const providerId = await sendViaResend(email, { key: env.RESEND_API_KEY, from: env.OUTREACH_FROM, replyTo: env.OUTREACH_REPLY_TO, bcc: env.OUTREACH_BCC, fetchImpl })
      Object.assign(email, { status: "sent", sentAt: stamp, providerId })
      if (lead.status === "new") lead.status = "contacted"
      lead.lastContact = stamp
      counts.sent++
    } catch (error) {
      // The status code only: a provider message can quote the address.
      Object.assign(email, { status: "failed", error: String(error.message).slice(0, 40), failedAt: stamp })
      counts.failed++
    }
  }
  counts.leftToday = budget - counts.sent
  if (!dryRun && (counts.sent || counts.failed || counts.skipped)) {
    store.write("outbox", outbox)
    store.write("leads", leadBook)
  }
  return counts
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const counts = await sendOutbox({ dryRun: process.argv.includes("--dry-run") })
  console.log(counts.held ? `Emails: nothing sent (${counts.held}).` : `Emails: ${JSON.stringify(counts)}`)
  process.exitCode = counts.failed ? 1 : 0
}
