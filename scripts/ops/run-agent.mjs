#!/usr/bin/env node
// Runs one Autopilot agent.
//   node scripts/ops/run-agent.mjs <agent> [--task "an extra instruction"] [--dry-run] [--commit]
//
// Agents: cmo, research, social, creative, b2b, finance (ops/agents/*.md).
// --dry-run   print the brief and the tools; no call to Claude, no writes
// --commit    (the workflow) push this run's changes to main; in review mode the
//             public changes go to a pull request instead
//
// Needs ANTHROPIC_API_KEY and OPS_DATA_KEY. Optional: TELEGRAM_BOT_TOKEN and
// TELEGRAM_CHAT_ID (reports), RUNPOD_ENDPOINT_ID (tells the creative agent a GPU
// is available), AUTOPILOT_MODEL. Logs carry counts only: the repository is
// public, and so are its Actions logs.

import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { Changes } from "./lib/changes.mjs"
import { AgentError, loadClaude, runLoop } from "./lib/claude.mjs"
import { AGENTS, STATE_FALLBACK, agentMode, loadConfig, pauseReason } from "./lib/config.mjs"
import { dispatchWorkflow } from "./lib/github.mjs"
import { OPS, SCRATCH, addDays, sgToday } from "./lib/paths.mjs"
import { Telegram } from "./lib/telegram.mjs"
import { Vault, VaultError, capped } from "./lib/vault.mjs"
import { b2bTools, LEADS_FALLBACK, OUTBOX_FALLBACK } from "./tools/b2b.mjs"
import { ACTIVITY_FALLBACK, PLAN_FALLBACK, cmoTools, overview, researchTools } from "./tools/cmo.mjs"
import { commonTools } from "./tools/common.mjs"
import { creativeTools, queuedBriefs } from "./tools/creative.mjs"
import { deckTools } from "./tools/deck.mjs"
import { FINANCE_FALLBACK, financeTools } from "./tools/finance.mjs"
import { socialTools } from "./tools/social.mjs"

const pick = (tools, names) => tools.filter((t) => names.includes(t.name))

const TEAM = {
  research: { title: "researcher", tools: (c) => [...commonTools(c), ...researchTools(c)], server: ["web_search", "web_fetch"], effort: "medium", turns: 25 },
  cmo: {
    title: "chief marketing officer",
    tools: (c) => [...commonTools(c), ...cmoTools(c), ...deckTools(c), ...pick(socialTools(c), ["list_posts", "list_articles"]), ...pick(creativeTools(c), ["list_media"]), ...pick(b2bTools(c), ["list_leads"]), ...pick(financeTools(c), ["ledger_summary"])],
    server: ["web_search", "web_fetch"],
    effort: "high",
    turns: 30,
  },
  social: { title: "social media manager", tools: (c) => [...commonTools(c), ...socialTools(c), ...pick(creativeTools(c), ["list_media"])], server: [], effort: "medium", turns: 30 },
  creative: { title: "creative producer", tools: (c) => [...commonTools(c), ...creativeTools(c), ...pick(socialTools(c), ["list_posts"])], server: [], effort: "medium", turns: 20 },
  b2b: { title: "trade partnerships manager", tools: (c) => [...commonTools(c), ...b2bTools(c), ...deckTools(c)], server: ["web_search", "web_fetch"], effort: "high", turns: 40 },
  finance: { title: "bookkeeper", tools: (c) => [...commonTools(c), ...financeTools(c)], server: [], effort: "high", turns: 40 },
}

const read = (rel) => readFileSync(path.join(OPS, rel), "utf8")

function systemPrompt(agent) {
  return `You are the ${TEAM[agent].title} of Autopilot, a small team of AI agents that runs marketing for HerbalBath, a one-person Singapore company, on a schedule. James, the founder, reads your reports on Telegram. You act only through your tools; nothing you write in plain text is published.

<product>
${read("knowledge/product.md")}
</product>

<playbook>
${read("knowledge/playbook.md")}
</playbook>

<your_role>
${read(`agents/${agent}.md`)}
</your_role>

<team_rules>
- Facts come only from <product>. Anything marked unconfirmed is never stated. When you need a fact that isn't there, ask James in your report.
- Run check_claims on every public text you write (posts, captions, emails, scripts) and fix it until it passes.
- Leads, emails, money and anything about a person stay in the vault tools. Never put them in posts, briefs, decks for the public, or file names.
- Never create or suggest fake accounts, fake reviews, fake engagement, astroturfing or impersonation. Real voices only.
- Stay within the limits in <autonomy>. Don't try to work around a tool's refusal; adjust your work or report the problem.
- Prefer a few excellent pieces over many weak ones.
- When the job is done, stop calling tools and reply with a two-to-four-sentence summary of what you did. It goes to the private activity log.
</team_rules>`
}

function snapshot(agent, ctx) {
  const v = (name, fallback) => {
    try {
      return ctx.changes.readVault(name, fallback)
    } catch (e) {
      if (e instanceof VaultError && ctx.dryRun) return fallback
      throw e
    }
  }
  const lines = []
  if (agent === "social") {
    const posts = ctx.changes.readJson("marketing/facebook/posts.json", { posts: [] }).posts
    const ahead = posts.filter((p) => p.publishAt.slice(0, 10) > ctx.today.date)
    lines.push(`Facebook posts scheduled after today: ${ahead.length}; the last one is on ${ahead.at(-1)?.publishAt ?? "(none)"}. Keep at least the next 14 days filled in the usual rhythm, and write each week's Monday post about that week's new article.`)
  }
  if (agent === "creative") {
    const q = queuedBriefs()
    lines.push(`GPU (RunPod) for product scenes and generated pictures: ${ctx.gpu ? "available" : "not configured: queue only product-video and ad briefs, whose shots use the real product photo"}.`)
    lines.push(`Queue: ${["queued", "making", "waiting-gpu", "failed"].map((s) => `${q.filter((b) => b.status === s).length} ${s}`).join(", ")}.`)
  }
  if (agent === "b2b") {
    const leads = v("leads", LEADS_FALLBACK).leads
    const emails = v("outbox", OUTBOX_FALLBACK).emails
    lines.push(`Pipeline: ${leads.length} leads; ${emails.filter((e) => e.status === "pending").length} drafts waiting for James; ${emails.filter((e) => e.status === "sent" && e.sentAt?.slice(0, 10) > addDays(ctx.today.date, -7)).length} emails sent in the last 7 days. Daily send cap: ${ctx.config.limits.emailsPerDay}.`)
  }
  if (agent === "finance") {
    const { uploads, ledger } = v("finance", FINANCE_FALLBACK)
    lines.push(`Uploads not yet recorded: ${uploads.filter((u) => !u.processed).map((u) => u.name).join(", ") || "none"}. Ledger: ${ledger.length} transactions.`)
  }
  if (agent === "cmo") lines.push(`Overview: ${JSON.stringify(overview(ctx))}`)
  if (agent === "research") {
    const notes = v("research", { notes: [] }).notes ?? []
    lines.push(`Previous research notes: ${notes.slice(-3).map((n) => `${n.at.slice(0, 10)} ${n.title}`).join("; ") || "none yet"}.`)
  }
  return lines.join("\n")
}

function userPrompt(agent, ctx, task) {
  const v = (name, fallback) => {
    try {
      return ctx.changes.readVault(name, fallback)
    } catch (e) {
      if (e instanceof VaultError && ctx.dryRun) return fallback
      throw e
    }
  }
  const plan = v("plan", PLAN_FALLBACK).current
  const insights = (v("insights", { notes: [] }).notes ?? []).slice(-15)
  const activity = (v("activity", ACTIVITY_FALLBACK).events ?? []).slice(-12)
  const l = ctx.config.limits
  return `<today>${ctx.today.weekday} ${ctx.today.date}, Singapore</today>

<autonomy>
Your public changes ${agentMode(ctx.config, agent) === "auto" ? "go live without review" : "wait for James's review in a pull request"}. Trade emails: ${ctx.config.actions.emails === "auto" ? "sent automatically within the daily cap" : "each draft waits for James's /approve"}.
Limits: ${l.emailsPerDay} emails a day, ${l.followUps} follow-ups (after ${l.followUpDays.join(" and ")} days), ${l.mediaJobsPerWeek} media briefs a week, product posts at most ${Math.round(l.productPostShare * 100)}% of posts.
</autonomy>

<plan>
${plan ? `${plan.week}\n${plan.markdown}` : "No plan yet. Use the playbook's quarter priorities."}
</plan>

<insights>
${insights.map((n) => `- ${n.at} (${n.agent}) ${n.note}`).join("\n") || "None yet."}
</insights>

<recent_activity>
${activity.map((e) => `- ${e.at.slice(0, 16).replace("T", " ")} ${e.agent}: ${e.summary}`).join("\n") || "Nothing yet: this is the team's first week."}
</recent_activity>

<this_run>
${snapshot(agent, ctx)}
${task ? `\nExtra instruction from James for this run: ${task}` : ""}
Do this run's job now.
</this_run>`
}

function publicSummary(agent, stats) {
  const parts = []
  if (stats.postsAdded) parts.push(`${stats.postsAdded} Facebook post${stats.postsAdded > 1 ? "s" : ""} added`)
  if (stats.mediaQueued) parts.push(`${stats.mediaQueued} media brief${stats.mediaQueued > 1 ? "s" : ""} queued`)
  if (stats.leadsAdded || stats.leadsUpdated || stats.emailsQueued) parts.push("trade pipeline updated")
  if (stats.planWritten) parts.push("weekly plan written")
  if (stats.researchSaved) parts.push("research note saved")
  if (stats.transactions) parts.push("ledger updated")
  if (stats.decks) parts.push(`${stats.decks} deck${stats.decks > 1 ? "s" : ""} made`)
  return parts.join(", ") || "no changes"
}

async function deliver(tg, ctx, agent) {
  const sent = []
  for (const r of ctx.run.reports) sent.push(await tg.send(`## ${r.title}\n\n${r.markdown}`))
  for (const a of ctx.run.attachments) sent.push(await tg.sendFile(a.file, a.caption))
  for (const e of ctx.run.emailsForApproval) {
    if (ctx.config.actions.emails === "auto") continue
    sent.push(await tg.send(`**Draft ${e.id}** to ${e.org}\n**${e.subject}**\n\n${e.body}\n\nReply /approve ${e.id} or /reject ${e.id}`))
  }
  if (!tg.available && (ctx.run.reports.length || ctx.run.emailsForApproval.length)) {
    // No Telegram yet: keep the reports so nothing is lost; vault-cli shows them.
    ctx.changes.private("reports", { pending: [] }, (v) => {
      v.pending = capped([...(v.pending ?? []), ...ctx.run.reports.map((r) => ({ ...r, at: new Date().toISOString(), agent }))], 50)
    })
  }
  return sent.filter(Boolean).length
}

async function main() {
  const args = process.argv.slice(2)
  const agent = args.find((a) => !a.startsWith("--") && AGENTS.includes(a))
  if (!agent) throw new Error(`Name an agent: ${AGENTS.join(", ")}`)
  const taskIndex = args.indexOf("--task")
  const task = taskIndex >= 0 ? args[taskIndex + 1]?.trim() : ""
  const dryRun = args.includes("--dry-run")
  const commit = args.includes("--commit")

  const config = loadConfig()
  const vault = new Vault()
  if (!dryRun && !vault.available) throw new Error("Set OPS_DATA_KEY (see ops/README.md) so the team can keep its private notes.")
  const changes = new Changes({ vault })
  let state = STATE_FALLBACK
  try {
    state = vault.available ? vault.read("state", STATE_FALLBACK) : STATE_FALLBACK
  } catch (e) {
    if (!dryRun) throw e
  }
  const paused = pauseReason({ config, state, agent })
  if (paused && !dryRun) {
    console.log(`Autopilot ${agent}: skipped, ${paused}.`)
    return
  }

  const ctx = {
    agent,
    config,
    changes,
    dryRun,
    today: sgToday(),
    gpu: !!process.env.RUNPOD_ENDPOINT_ID,
    run: { reports: [], attachments: [], emailsForApproval: [], stats: {} },
  }
  const team = TEAM[agent]
  const tools = team.tools(ctx)
  const system = systemPrompt(agent)
  const prompt = userPrompt(agent, ctx, task)

  if (dryRun) {
    console.log(`Agent ${agent} (${team.title}), effort ${team.effort}, up to ${team.turns} turns.`)
    console.log(`Tools: ${tools.map((t) => t.name).join(", ")}${team.server.length ? ` + server: ${team.server.join(", ")}` : ""}`)
    console.log(`System prompt: ${system.length} characters.\n\n--- prompt ---\n${prompt}`)
    return
  }
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("Set ANTHROPIC_API_KEY.")

  const Anthropic = await loadClaude()
  const client = new Anthropic({ maxRetries: 3, timeout: 15 * 60 * 1000 })
  const tg = new Telegram()
  const started = Date.now()
  let result
  try {
    result = await runLoop({
      client,
      Anthropic,
      model: process.env.AUTOPILOT_MODEL || config.model,
      system,
      prompt,
      tools,
      server: team.server,
      effort: config.agents?.[agent]?.effort ?? team.effort,
      maxTurns: Math.min(team.turns, config.limits.agentTurns),
    })
  } catch (e) {
    const message = e instanceof AgentError ? e.message : "an unexpected error (see the Actions log)"
    await tg.send(`**Autopilot ${agent} failed:** ${message}`).catch(() => {})
    throw e
  }

  const summary = publicSummary(agent, ctx.run.stats)
  changes.private("activity", ACTIVITY_FALLBACK, (v) => {
    v.events = capped([...v.events, { at: new Date().toISOString(), agent, status: result.status, summary: (result.text || summary).slice(0, 800), stats: ctx.run.stats, usage: result.usage }], 500)
  })
  if (result.status !== "done") await tg.send(`**Autopilot ${agent}** stopped early (${result.status}). ${summary}.`).catch(() => {})
  const delivered = await deliver(tg, ctx, agent)

  const minutes = ((Date.now() - started) / 60000).toFixed(1)
  const line = `Autopilot ${agent}: ${result.status} in ${result.turns} turns, ${minutes} min; ${summary}; ${delivered} Telegram messages; tokens in ${result.usage.input + result.usage.cacheRead} (cached ${result.usage.cacheRead}), out ${result.usage.output}.`
  console.log(line)
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${line}\n`)

  if (commit) {
    const mode = agentMode(config, agent)
    const message = `autopilot(${agent}): ${summary}`
    if (mode === "auto") await changes.commitToMain(message)
    else {
      await changes.commitToMain(message, { scopes: ["private"] })
      const url = changes.openPullRequest({
        branch: `autopilot/${agent}-${ctx.today.date}-${Date.now().toString(36)}`,
        title: `Autopilot ${agent}: ${summary}`,
        body: `The ${agent} agent's public changes from ${ctx.today.date}, waiting for review because ops/autonomy.json sets ${agent}.mode to "review". Merge to publish, close to discard.`,
      })
      if (url) await tg.send(`**Autopilot ${agent}** needs your review: ${url}`).catch(() => {})
    }
    if (ctx.run.stats.mediaQueued) await dispatchWorkflow("autopilot-exec.yml", { task: "media" }).catch((e) => console.log(e.message))
  }
  mkdirSync(SCRATCH, { recursive: true })
  writeFileSync(path.join(SCRATCH, "last-run.txt"), `${line}\n`)
}

main().catch((e) => {
  console.error(`run-agent: ${e.message}`)
  process.exit(1)
})
