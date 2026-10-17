// The CMO's view of the whole operation, and the plan it writes for the team.
// Research notes, plans and the activity log are private (vault).

import { capped } from "../lib/vault.mjs"
import { addDays } from "../lib/paths.mjs"
import { queuedBriefs } from "./creative.mjs"
import { LEADS_FALLBACK, OUTBOX_FALLBACK } from "./b2b.mjs"
import { obj, str } from "./common.mjs"
import { articleIndex, POSTS } from "./social.mjs"
import { ledgerTotals, FINANCE_FALLBACK } from "./finance.mjs"

export const ACTIVITY_FALLBACK = { events: [] }
export const PLAN_FALLBACK = { current: null, history: [] }

export function overview(ctx) {
  const today = ctx.today.date
  const posts = ctx.changes.readJson(POSTS, { posts: [] }).posts
  const leads = ctx.changes.readVault("leads", LEADS_FALLBACK).leads
  const emails = ctx.changes.readVault("outbox", OUTBOX_FALLBACK).emails
  const weekAgo = addDays(today, -7)
  const finance = ctx.changes.readVault("finance", FINANCE_FALLBACK)
  const lastMonth = addDays(`${today.slice(0, 7)}-01`, -1).slice(0, 7)
  const { planned } = articleIndex()
  return {
    today,
    facebook: {
      scheduledNext14Days: posts.filter((p) => p.publishAt.slice(0, 10) > today && p.publishAt.slice(0, 10) <= addDays(today, 14)).length,
      publishedLast7Days: posts.filter((p) => p.publishAt.slice(0, 10) <= today && p.publishAt.slice(0, 10) > weekAgo).length,
      needingImages: posts.filter((p) => !p.image && !p.link && p.imagePrompt && p.publishAt.slice(0, 10) > today).length,
    },
    creative: Object.fromEntries(["queued", "making", "done", "failed", "waiting-gpu"].map((s) => [s, queuedBriefs().filter((b) => b.status === s).length])),
    blog: { nextPlanned: planned.slice(0, 4) },
    trade: {
      leads: leads.length,
      byStatus: leads.reduce((acc, l) => ({ ...acc, [l.status]: (acc[l.status] ?? 0) + 1 }), {}),
      emailsSentLast7Days: emails.filter((e) => e.status === "sent" && e.sentAt?.slice(0, 10) > weekAgo).length,
      awaitingApproval: emails.filter((e) => e.status === "pending").length,
    },
    finance: finance.ledger.length ? { lastMonth, ...ledgerTotals(finance.ledger, `${lastMonth}-01`, `${lastMonth}-31`) } : "no bank or Shopee exports uploaded yet",
  }
}

export function cmoTools(ctx) {
  return [
    {
      name: "get_overview",
      description: "The state of the whole operation: Facebook pipeline, creative queue, blog plan, trade pipeline, last month's money (once exports are uploaded).",
      input_schema: obj({}, []),
      run: () => overview(ctx),
    },
    {
      name: "get_activity",
      description: "What every agent did over the last `days` days (default 7): run summaries and notable events.",
      input_schema: obj({ days: { type: "integer" } }, []),
      run: ({ days = 7 }) => {
        const from = addDays(ctx.today.date, -days)
        return ctx.changes.readVault("activity", ACTIVITY_FALLBACK).events.filter((e) => e.at.slice(0, 10) >= from)
      },
    },
    {
      name: "get_research",
      description: "The latest research notes from the research agent (newest first).",
      input_schema: obj({ count: { type: "integer" } }, []),
      run: ({ count = 2 }) => (ctx.changes.readVault("research", { notes: [] }).notes ?? []).slice(-count).reverse(),
    },
    {
      name: "write_plan",
      description:
        "Write this week's plan for the team. The social, creative and B2B agents read it at the start of every run, so be concrete: themes, the posts and pictures you want, which trade segment to work, what to stop. Markdown.",
      input_schema: obj({
        week: str("ISO week, e.g. 2026-W43"),
        markdown: str("The plan"),
        priorities: { type: "array", items: { type: "string" }, description: "The 3 to 5 priorities, one line each" },
      }),
      run: ({ week, markdown, priorities }) => {
        ctx.changes.private("plan", PLAN_FALLBACK, (v) => {
          if (v.current) v.history = capped([...(v.history ?? []), v.current], 12)
          v.current = { week, markdown: markdown.slice(0, 20_000), priorities: priorities.slice(0, 6), at: new Date().toISOString() }
        })
        ctx.run.stats.planWritten = true
        return "Plan saved; the team picks it up from their next runs."
      },
    },
  ]
}

export function researchTools(ctx) {
  return [
    {
      name: "save_research",
      description: "Save this week's research note for the CMO and the team (private). Markdown with sources as links.",
      input_schema: obj({ title: str("Title"), markdown: str("The note") }),
      run: ({ title, markdown }) => {
        ctx.changes.private("research", { notes: [] }, (v) => {
          v.notes = capped([...(v.notes ?? []), { at: new Date().toISOString(), title, markdown: markdown.slice(0, 30_000) }], 20)
        })
        ctx.run.stats.researchSaved = true
        return "Saved."
      },
    },
  ]
}
