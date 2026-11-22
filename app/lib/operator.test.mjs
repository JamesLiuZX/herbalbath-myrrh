// Run with `pnpm test`. The operator's plumbing (ops/OPERATOR.md): the private
// store that replaces the vault, the tool door, and the heartbeat check.
import { test } from "node:test"
import assert from "node:assert/strict"
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { loadConfig } from "../../scripts/ops/lib/config.mjs"
import { PlainStore, StoreError } from "../../scripts/ops/lib/plain-store.mjs"
import { heartbeatProblem, MAX_SILENT_DAYS } from "../../scripts/ops/heartbeat-check.mjs"
import { operatorContext, runTool } from "../../scripts/ops/tool.mjs"

const tmp = () => mkdtempSync(path.join(os.tmpdir(), "operator-test-"))
const DAY = 86_400_000

function setup() {
  const root = tmp()
  mkdirSync(path.join(root, "marketing/facebook"), { recursive: true })
  writeFileSync(path.join(root, "marketing/facebook/posts.json"), JSON.stringify({ posts: [] }))
  const store = new PlainStore({ dir: tmp(), root })
  return { root, store, ctx: operatorContext({ store, root }) }
}

test("the private store round-trips plain JSON and refuses to live inside the public repository", () => {
  const root = tmp()
  const store = new PlainStore({ dir: tmp(), root })
  assert.equal(store.available, true)
  store.write("leads", { leads: [{ org: "Example Gifts" }] })
  assert.equal(store.read("leads").leads[0].org, "Example Gifts")
  assert.deepEqual(store.read("missing", { a: 1 }), { a: 1 })
  assert.throws(() => store.rel("../etc"), StoreError)
  assert.throws(() => new PlainStore({ dir: path.join(root, "ops/private"), root }), StoreError)
  const none = new PlainStore({ dir: "", root })
  assert.equal(none.available, false)
  assert.throws(() => none.write("leads", {}), StoreError)
})

test("a lead and its email go through the same rules as the agents' tools", async () => {
  const { store, ctx } = setup()
  const { result } = await runTool("upsert_lead", { org: "Example Hampers", type: "corporate", email: "hello@example.sg", website: "https://example.sg", source: "https://example.sg/contact" }, { ctx })
  const id = store.read("leads").leads[0].id
  assert.ok(id && result.created && result.id === id)
  await runTool("queue_email", { leadId: id, kind: "first", lang: "en", subject: "A warming oil for your Chinese New Year hampers", body: "Hello, I'm James from HerbalBath in Singapore. We make a herbal oil that many families give to their parents. Would a sample be useful?" }, { ctx })
  const email = store.read("outbox").emails[0]
  assert.equal(email.status, "pending", "emails wait for James until actions.emails is auto")
  await assert.rejects(runTool("queue_email", { leadId: id, kind: "first", lang: "en", subject: "Again", body: "A second first email to the same lead." }, { ctx }), /pending|already/i)
  await assert.rejects(runTool("upsert_lead", { org: "No source" }, { ctx }), /required/)
  await assert.rejects(runTool("no_such_tool", {}, { ctx }), /no tool/i)
})

test("the heartbeat check goes red when the operator has been silent too long", () => {
  const now = Date.parse("2026-12-01T00:00:00Z")
  assert.equal(heartbeatProblem({ lastRun: new Date(now - 2 * DAY).toISOString() }, now), null)
  assert.match(heartbeatProblem({ lastRun: new Date(now - (MAX_SILENT_DAYS + 1) * DAY).toISOString() }, now), /days ago/)
  assert.match(heartbeatProblem({}, now), /never checked in/)
  assert.match(heartbeatProblem(null, now), /never checked in/)
  assert.equal(heartbeatProblem({ paused: true, lastRun: "2026-01-01T00:00:00Z" }, now), null)
})

test("the committed heartbeat and autonomy files are well formed", () => {
  const heartbeat = JSON.parse(readFileSync(new URL("../../ops/status/heartbeat.json", import.meta.url), "utf8"))
  assert.ok(Number.isFinite(Date.parse(heartbeat.lastRun)))
  const config = loadConfig()
  assert.equal(config.runtime, "claude-session")
  assert.ok(["review", "auto"].includes(config.actions.emails))
  assert.ok(config.limits.emailsPerDay <= 5, "the daily email cap never rises above 5 without a deliberate edit here")
})
