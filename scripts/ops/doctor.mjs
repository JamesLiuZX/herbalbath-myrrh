#!/usr/bin/env node
// The operator's health check (ops/OPERATOR.md, "Every run", step 4): which
// engines are live, how far ahead the content runs, what is queued, and how
// old the heartbeat is. It prints counts and dates only, so its output can go
// straight into ops/status/heartbeat.json.
//
//   node scripts/ops/doctor.mjs            readable report
//   node scripts/ops/doctor.mjs --json     the same as JSON
//
// Each credential gets one harmless, read-only call. A missing key is
// "waiting", not an error; a key that is set and refused is "failing".
// The exit code is 0 unless a credential is failing.

import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { silentDays } from "./heartbeat-check.mjs"
import { daysBetween, OPS, ROOT, sgToday } from "./lib/paths.mjs"
import { PlainStore } from "./lib/plain-store.mjs"

const SITE = "https://herbalbathsg.com"

/** One read-only request per credential. `needs` are the variables that must be set; `waiting` says what James has to do. */
export const CREDENTIALS = [
  {
    engine: "email",
    needs: ["RESEND_API_KEY", "OUTREACH_FROM"],
    waiting: "Resend key and sender address",
    call: (env, fetchImpl) => fetchImpl("https://api.resend.com/domains", { headers: { authorization: `Bearer ${env.RESEND_API_KEY}` } }),
  },
  {
    engine: "orders",
    needs: ["ORDERS_API_TOKEN"],
    waiting: "orders token",
    call: (env, fetchImpl) => fetchImpl(`${SITE}/api/internal/orders?limit=1`, { headers: { authorization: `Bearer ${env.ORDERS_API_TOKEN}` } }),
    // The route answers 200 with persisted:false when Upstash is not connected.
    detail: async (res) => ((await res.json()).persisted ? null : "waiting: Upstash"),
  },
]

/** "live", "waiting: …" or "failing: …" for one credential. Never throws. */
export async function checkCredential(check, { env = process.env, fetchImpl = fetch } = {}) {
  const missing = check.needs.filter((name) => !env[name])
  if (missing.length) return `waiting: ${check.waiting}`
  try {
    const res = await check.call(env, fetchImpl)
    if (!res.ok) return `failing: HTTP ${res.status}`
    return (check.detail && (await check.detail(res))) || "live"
  } catch (error) {
    return `failing: ${error.message}`
  }
}

/** Days from today to the last day covered without a gap of more than 3 days between posts. */
export function runwayDays(posts, today) {
  const dates = [...new Set(posts.map((p) => String(p.publishAt).slice(0, 10)).filter((d) => d >= today))].sort()
  let last = today
  for (const d of dates) {
    if (daysBetween(last, d) > 3) break
    last = d
  }
  return daysBetween(today, last)
}

const tally = (items, key = "status") => items.reduce((acc, item) => ({ ...acc, [item[key] ?? "unknown"]: (acc[item[key] ?? "unknown"] ?? 0) + 1 }), {})

function readJson(file, fallback) {
  try {
    return JSON.parse(readFileSync(file, "utf8"))
  } catch {
    return fallback
  }
}

export function mediaQueue(root = ROOT) {
  const dir = path.join(root, "ops", "creative", "queue")
  if (!existsSync(dir)) return {}
  return tally(readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => readJson(path.join(dir, f), {})))
}

export async function diagnose({ env = process.env, fetchImpl = fetch, root = ROOT, store = new PlainStore({ dir: env.OPS_PRIVATE_DIR ?? null, root }), now = new Date() } = {}) {
  const today = sgToday(now).date
  const engines = { site: "live" }
  try {
    const res = await fetchImpl(SITE, { method: "HEAD" })
    if (!res.ok) engines.site = `failing: HTTP ${res.status}`
  } catch (error) {
    engines.site = `failing: ${error.message}`
  }
  for (const check of CREDENTIALS) engines[check.engine] = await checkCredential(check, { env, fetchImpl })
  // No call is defined for these two until their scripts exist (build queue).
  engines.social = existsSync(path.join(root, "scripts", "social", "publish.mjs")) ? "waiting: publishing key" : "waiting: publisher not built, publishing key"
  engines.media = env.FAL_KEY ? "key set, not verified" : "waiting: fal key"

  const posts = readJson(path.join(root, "marketing", "facebook", "posts.json"), { posts: [] }).posts ?? []
  const calendar = readJson(path.join(root, "content", "calendar.json"), { entries: [] }).entries ?? []
  const heartbeat = readJson(path.join(root, "ops", "status", "heartbeat.json"), null)
  const age = silentDays(heartbeat, now.getTime())

  const counts = {
    postsScheduled: posts.filter((p) => String(p.publishAt).slice(0, 10) >= today).length,
    articlesPublished: calendar.filter((e) => e.status === "published").length,
    articlesOverdue: calendar.filter((e) => e.status === "planned" && e.publishOn < today).length,
    media: mediaQueue(root),
  }
  if (store.available) {
    counts.leads = store.read("leads", { leads: [] }).leads.length
    counts.emails = tally(store.read("outbox", { emails: [] }).emails)
  }
  return {
    date: today,
    engines,
    privateStore: store.available ? "attached" : "command repo not attached",
    runwayDays: runwayDays(posts, today),
    heartbeatAgeDays: Number.isFinite(age) ? Math.round(age * 10) / 10 : null,
    counts,
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const report = await diagnose()
  if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2))
  else {
    console.log(`HerbalBath doctor, ${report.date}`)
    for (const [engine, state] of Object.entries(report.engines)) console.log(`  ${engine.padEnd(7)} ${state}`)
    console.log(`  private store: ${report.privateStore}`)
    console.log(`  post runway: ${report.runwayDays} days; heartbeat age: ${report.heartbeatAgeDays ?? "never"} days`)
    console.log(`  counts: ${JSON.stringify(report.counts)}`)
  }
  process.exitCode = Object.values(report.engines).some((s) => s.startsWith("failing")) ? 1 : 0
}
