import assert from "node:assert/strict"
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { test } from "node:test"
import { checkCredential, CREDENTIALS, diagnose, runwayDays } from "./doctor.mjs"

const ok = (body = {}) => ({ ok: true, status: 200, json: async () => body })
const email = CREDENTIALS.find((c) => c.engine === "email")
const orders = CREDENTIALS.find((c) => c.engine === "orders")

test("a missing key is waiting and makes no call", async () => {
  let called = false
  const state = await checkCredential(email, { env: {}, fetchImpl: async () => ((called = true), ok()) })
  assert.equal(state, "waiting: Resend key and sender address")
  assert.equal(called, false)
})

test("a key that works is live, and the call is a read", async () => {
  const seen = []
  const state = await checkCredential(email, { env: { RESEND_API_KEY: "k", OUTREACH_FROM: "a@b.c" }, fetchImpl: async (url, init) => (seen.push([url, init]), ok()) })
  assert.equal(state, "live")
  assert.equal(seen.length, 1)
  assert.equal(seen[0][1].method ?? "GET", "GET")
  assert.equal(seen[0][1].headers.authorization, "Bearer k")
})

test("a refused key and a network error are failing, never thrown", async () => {
  const env = { ORDERS_API_TOKEN: "t" }
  assert.equal(await checkCredential(orders, { env, fetchImpl: async () => ({ ok: false, status: 401 }) }), "failing: HTTP 401")
  assert.equal(await checkCredential(orders, { env, fetchImpl: async () => Promise.reject(new Error("offline")) }), "failing: offline")
})

test("orders without Upstash is waiting, not live", async () => {
  const env = { ORDERS_API_TOKEN: "t" }
  assert.equal(await checkCredential(orders, { env, fetchImpl: async () => ok({ persisted: false, orders: [] }) }), "waiting: Upstash")
  assert.equal(await checkCredential(orders, { env, fetchImpl: async () => ok({ persisted: true, orders: [] }) }), "live")
})

test("runway stops at the first gap longer than three days", () => {
  const posts = ["2026-11-23 08:30", "2026-11-25 20:00", "2026-11-28 09:00", "2026-12-05 09:00"].map((publishAt) => ({ publishAt }))
  assert.equal(runwayDays(posts, "2026-11-23"), 5)
  assert.equal(runwayDays([], "2026-11-23"), 0)
  assert.equal(runwayDays([{ publishAt: "2026-11-01 09:00" }], "2026-11-23"), 0)
})

test("diagnose reports counts only, from the files it is pointed at", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "doctor-"))
  const priv = mkdtempSync(path.join(tmpdir(), "doctor-private-"))
  for (const dir of ["marketing/facebook", "content", "ops/status", "ops/creative/queue"]) mkdirSync(path.join(root, dir), { recursive: true })
  writeFileSync(path.join(root, "marketing/facebook/posts.json"), JSON.stringify({ posts: [{ publishAt: "2026-11-24 08:30" }, { publishAt: "2026-11-01 08:30" }] }))
  writeFileSync(path.join(root, "content/calendar.json"), JSON.stringify({ entries: [{ status: "published", publishOn: "2026-10-17" }, { status: "planned", publishOn: "2026-11-02" }, { status: "planned", publishOn: "2026-12-07" }] }))
  writeFileSync(path.join(root, "ops/status/heartbeat.json"), JSON.stringify({ lastRun: "2026-11-22T00:00:00Z" }))
  writeFileSync(path.join(root, "ops/creative/queue/a.json"), JSON.stringify({ status: "queued" }))
  writeFileSync(path.join(priv, "leads.json"), JSON.stringify({ leads: [{ org: "Private Name Pte Ltd", email: "someone@example.com" }] }))
  writeFileSync(path.join(priv, "outbox.json"), JSON.stringify({ emails: [{ status: "draft", to: "someone@example.com" }] }))

  const report = await diagnose({ env: { OPS_PRIVATE_DIR: priv }, fetchImpl: async () => ok(), root, now: new Date("2026-11-23T00:00:00Z") })
  assert.equal(report.engines.site, "live")
  assert.match(report.engines.email, /^waiting/)
  assert.equal(report.runwayDays, 1)
  assert.equal(report.heartbeatAgeDays, 1)
  assert.deepEqual(report.counts, { postsScheduled: 1, articlesPublished: 1, articlesOverdue: 1, media: { queued: 1 }, leads: 1, emails: { draft: 1 } })
  assert.doesNotMatch(JSON.stringify(report), /example\.com|Private Name/)

  const bare = await diagnose({ env: {}, fetchImpl: async () => ok(), root, now: new Date("2026-11-23T00:00:00Z") })
  assert.equal(bare.privateStore, "command repo not attached")
  assert.equal(bare.counts.leads, undefined)
})
