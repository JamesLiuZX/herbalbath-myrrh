#!/usr/bin/env node
// The Telegram inbox: James's commands, approvals and files. The workflow runs
// it every 30 minutes from 08:00 to midnight Singapore time.
//   node scripts/ops/inbox.mjs [--commit]
// Anything that isn't a command is a question or an instruction for the CMO,
// who answers in the chat (and remembers instructions for the team).

import { Changes } from "./lib/changes.mjs"
import { loadClaude, runLoop } from "./lib/claude.mjs"
import { AGENTS, STATE_FALLBACK, loadConfig, pauseReason } from "./lib/config.mjs"
import { dispatchWorkflow } from "./lib/github.mjs"
import { OPS, sgToday } from "./lib/paths.mjs"
import { Telegram } from "./lib/telegram.mjs"
import { Vault } from "./lib/vault.mjs"
import { readFileSync } from "node:fs"
import path from "node:path"
import { LEAD_STATUSES, LEADS_FALLBACK, OUTBOX_FALLBACK, leadSummary } from "./tools/b2b.mjs"
import { ACTIVITY_FALLBACK, PLAN_FALLBACK, cmoTools, overview } from "./tools/cmo.mjs"
import { commonTools } from "./tools/common.mjs"
import { queuedBriefs } from "./tools/creative.mjs"
import { storeUpload } from "./tools/finance.mjs"

export const HELP = `**HerbalBath Autopilot**
Ask me anything, or tell me what the team should do: just type.

/status what the team is doing
/plan this week's plan
/drafts trade emails waiting for you
/approve <id|all> send a draft
/reject <id> drop a draft
/leads the trade pipeline
/lead <id> <status> record a reply: ${LEAD_STATUSES.join(", ")}
/run <agent> run an agent now: ${AGENTS.join(", ")}
/pause [agent|all] and /resume [agent|all]

Send a CSV export (Aspire, Shopee) and the bookkeeper records it.`

const MAX_FILE = 15 * 1024 * 1024

export async function handle(text, ctx) {
  const [rawCmd, ...rest] = text.trim().split(/\s+/)
  const cmd = rawCmd.toLowerCase().replace(/@\w+$/, "")
  const { changes, config } = ctx
  const state = () => changes.readVault("state", STATE_FALLBACK)
  const outbox = () => changes.readVault("outbox", OUTBOX_FALLBACK).emails

  switch (cmd) {
    case "/start":
    case "/help":
      return HELP
    case "/status": {
      const s = state()
      const o = overview(ctx)
      const last = (changes.readVault("activity", ACTIVITY_FALLBACK).events ?? []).slice(-6)
      const paused = pauseReason({ config, state: s })
      return [
        paused ? `⏸ Paused: ${paused}` : "▶️ Running",
        ...AGENTS.filter((a) => s.paused?.agents?.[a]).map((a) => `⏸ ${a} paused`),
        `Facebook: ${o.facebook.scheduledNext14Days} posts in the next 14 days, ${o.facebook.needingImages} need pictures`,
        `Creative queue: ${Object.entries(o.creative).map(([k, v]) => `${v} ${k}`).join(", ")}`,
        `Trade: ${o.trade.leads} leads, ${o.trade.awaitingApproval} drafts waiting for you, ${o.trade.emailsSentLast7Days} sent this week`,
        "",
        "**Last runs**",
        ...last.map((e) => `• ${e.at.slice(5, 16).replace("T", " ")} ${e.agent}: ${e.status}`),
      ].join("\n")
    }
    case "/plan": {
      const plan = changes.readVault("plan", PLAN_FALLBACK).current
      return plan ? `**Plan ${plan.week}**\n\n${plan.markdown}` : "No plan yet: the CMO writes one on Monday morning, or send /run cmo."
    }
    case "/drafts": {
      const pending = outbox().filter((e) => e.status === "pending")
      if (!pending.length) return "No drafts waiting."
      return pending.map((e) => `**${e.id}** to ${e.org}\n**${e.subject}**\n\n${e.body}`).join("\n\n———\n\n") + "\n\n/approve <id> or /approve all"
    }
    case "/approve":
    case "/reject": {
      const ids = rest.map((r) => r.toUpperCase())
      if (!ids.length) return `Which one? ${cmd} <id>${cmd === "/approve" ? " or /approve all" : ""}`
      const all = ids.includes("ALL")
      let done = []
      changes.private("outbox", OUTBOX_FALLBACK, (v) => {
        done = []
        for (const e of v.emails) {
          if (e.status !== "pending" || !(all ? cmd === "/approve" : ids.includes(e.id.toUpperCase()))) continue
          e.status = cmd === "/approve" ? "approved" : "rejected"
          e[cmd === "/approve" ? "approvedAt" : "rejectedAt"] = new Date().toISOString()
          done.push(`${e.id} (${e.org})`)
        }
      })
      if (!done.length) return "Nothing matched: /drafts lists what's waiting."
      return cmd === "/approve" ? `Approved ${done.join(", ")}. They go out on the next weekday send (within ${config.limits.emailsPerDay} a day).` : `Dropped ${done.join(", ")}.`
    }
    case "/leads": {
      const emails = outbox()
      const rows = changes.readVault("leads", LEADS_FALLBACK).leads.map((l) => leadSummary(l, emails))
      if (!rows.length) return "No leads yet: the trade agent starts on Wednesday, or send /run b2b."
      const counts = LEAD_STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length]).filter(([, n]) => n)
      return `${counts.map(([s, n]) => `${n} ${s}`).join(" · ")}\n\n${rows
        .slice(-15)
        .map((r) => `• ${r.id} ${r.org} (${r.type}${r.area ? `, ${r.area}` : ""}): ${r.status}${r.emailsSent ? `, ${r.emailsSent} sent` : ""}`)
        .join("\n")}`
    }
    case "/lead": {
      const [id, status] = rest
      if (!id || !LEAD_STATUSES.includes(status)) return `Use /lead <id> <status>. Statuses: ${LEAD_STATUSES.join(", ")}`
      let found = null
      changes.private("leads", LEADS_FALLBACK, (v) => {
        const lead = v.leads.find((l) => l.id.toUpperCase() === id.toUpperCase())
        if (lead) {
          lead.status = status
          lead.updatedAt = new Date().toISOString()
          found = lead.org
        }
      })
      return found ? `${found}: ${status}. The trade agent won't email it again unless it's back to new or contacted.` : `No lead ${id}.`
    }
    case "/run": {
      const agent = rest[0]
      if (!AGENTS.includes(agent)) return `Which agent? ${AGENTS.join(", ")}`
      const task = rest.slice(1).join(" ")
      const ok = await dispatchWorkflow("autopilot.yml", { agent, task })
      return ok ? `Started the ${agent} agent${task ? ` with: ${task}` : ""}. Its report arrives here when it's done.` : "Can't start runs from here (no GitHub token in this environment)."
    }
    case "/pause":
    case "/resume": {
      const target = rest[0] ?? "all"
      if (target !== "all" && !AGENTS.includes(target)) return `Use ${cmd} all, or one of: ${AGENTS.join(", ")}`
      const value = cmd === "/pause"
      changes.private("state", STATE_FALLBACK, (s) => {
        s.paused ??= { all: false, agents: {} }
        if (target === "all") s.paused.all = value
        else s.paused.agents = { ...(s.paused.agents ?? {}), [target]: value }
      })
      return `${value ? "Paused" : "Resumed"} ${target === "all" ? "everything" : `the ${target} agent`}.`
    }
    default:
      return ask(text.replace(/^\/ask\s*/i, ""), ctx)
  }
}

async function ask(question, ctx) {
  if (!process.env.ANTHROPIC_API_KEY) return "I can't answer questions yet: ANTHROPIC_API_KEY isn't set."
  const Anthropic = await loadClaude()
  const client = new Anthropic({ maxRetries: 2 })
  const read = (rel) => readFileSync(path.join(OPS, rel), "utf8")
  const run = { reports: [], attachments: [], emailsForApproval: [], stats: {} }
  const toolCtx = { ...ctx, agent: "cmo", run }
  const tools = [...commonTools(toolCtx).filter((t) => ["read_file", "remember", "check_claims"].includes(t.name)), ...cmoTools(toolCtx).filter((t) => ["get_overview", "get_activity", "get_research"].includes(t.name))]
  const plan = ctx.changes.readVault("plan", PLAN_FALLBACK).current
  const result = await runLoop({
    client,
    Anthropic,
    model: process.env.AUTOPILOT_MODEL || ctx.config.model,
    system: `You are the CMO of Autopilot, the AI team that runs HerbalBath's marketing. James, the founder, is messaging you on Telegram. Answer briefly (a few lines, his language), from the facts below and your tools. If he gives the team an instruction or a preference, save it with remember and say it's noted. Never state unconfirmed facts.\n\n<product>\n${read("knowledge/product.md")}\n</product>\n\n<playbook>\n${read("knowledge/playbook.md")}\n</playbook>\n\n<plan>\n${plan ? plan.markdown : "No plan yet."}\n</plan>`,
    prompt: question,
    tools,
    effort: "medium",
    maxTurns: 6,
    maxTokens: 8000,
  })
  return result.text || "I couldn't put an answer together; try asking another way."
}

async function main() {
  const commit = process.argv.includes("--commit")
  const tg = new Telegram()
  if (!tg.available) {
    console.log("Inbox: Telegram isn't set up (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID).")
    return
  }
  const updates = await tg.updates()
  if (!updates.length) {
    console.log("Inbox: nothing new.")
    return
  }
  const vault = new Vault()
  const changes = new Changes({ vault })
  const ctx = { changes, config: loadConfig(), today: sgToday(), gpu: !!process.env.RUNPOD_ENDPOINT_ID }
  let handled = 0
  for (const u of updates) {
    const m = u.message
    if (!m || String(m.chat?.id) !== tg.chatId) continue
    handled++
    try {
      if (m.document) {
        if (m.document.file_size > MAX_FILE) {
          await tg.send("That file is too big (15 MB at most).")
          continue
        }
        const entry = storeUpload(changes, { name: m.document.file_name ?? `upload-${u.update_id}`, buffer: await tg.download(m.document.file_id), mime: m.document.mime_type })
        await tg.send(entry.kind === "csv" ? `Saved **${entry.name}** (${entry.rows} rows). The bookkeeper records it on the 1st, or send /run finance now.` : `Saved **${entry.name}**, but only CSV exports can be read. Please export CSV.`)
      } else if (m.text) {
        await tg.send(await handle(m.text, ctx))
      }
    } catch (e) {
      await tg.send(`Something went wrong: ${e.message}`).catch(() => {})
    }
  }
  await tg.confirm(updates.at(-1).update_id)
  console.log(`Inbox: handled ${handled} message(s).`)
  if (commit && changes.count()) await changes.commitToMain("autopilot(inbox): update private state")
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main().catch((e) => {
    console.error(`inbox: ${e.message}`)
    process.exit(1)
  })
}
