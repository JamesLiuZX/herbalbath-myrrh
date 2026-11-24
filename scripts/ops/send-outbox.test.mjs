import assert from "node:assert/strict"
import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { test } from "node:test"
import { PlainStore } from "./lib/plain-store.mjs"
import { holdReason, sendOutbox } from "./send-outbox.mjs"

const TUESDAY = new Date("2026-11-24T02:00:00Z")
const SATURDAY = new Date("2026-11-28T02:00:00Z")
const env = { RESEND_API_KEY: "k", OUTREACH_FROM: "James <james@example.test>" }
const config = (over = {}) => ({ paused: false, engines: { email: { paused: false } }, actions: { emails: "auto" }, limits: { emailsPerDay: 5 }, ...over })

function store(emails, leads) {
  const s = new PlainStore({ dir: mkdtempSync(path.join(tmpdir(), "outbox-")) })
  s.write("outbox", { emails })
  s.write("leads", { leads })
  return s
}
const email = (n, over = {}) => ({ id: `e${n}`, leadId: `l${n}`, to: `enquiry${n}@example.test`, org: `Org ${n}`, subject: "s", body: "b", status: "approved", createdAt: `2026-11-2${n}T00:00:00Z`, ...over })
const lead = (n, over = {}) => ({ id: `l${n}`, status: "new", ...over })
const resend = (calls) => async (url, init) => (calls.push(JSON.parse(init.body)), { ok: true, json: async () => ({ id: `r${calls.length}` }) })

test("nothing goes out unless James has switched emails to auto, on a weekday, with a key", () => {
  assert.match(holdReason({ config: config({ actions: { emails: "review" } }), env, now: TUESDAY }), /wait for James/)
  assert.match(holdReason({ config: config({ paused: true }), env, now: TUESDAY }), /paused/)
  assert.match(holdReason({ config: config({ engines: { email: { paused: true } } }), env, now: TUESDAY }), /email engine is paused/)
  assert.match(holdReason({ config: config(), env, now: SATURDAY }), /weekdays/)
  assert.match(holdReason({ config: config(), env: {}, now: TUESDAY }), /^waiting/)
  assert.equal(holdReason({ config: config(), env: {}, now: TUESDAY, dryRun: true }), null)
  assert.equal(holdReason({ config: config(), env, now: TUESDAY }), null)
})

test("a held run makes no call and changes nothing", async () => {
  const calls = []
  const s = store([email(1)], [lead(1)])
  const out = await sendOutbox({ store: s, config: config({ actions: { emails: "review" } }), env, fetchImpl: resend(calls), now: TUESDAY })
  assert.equal(out.sent, 0)
  assert.equal(calls.length, 0)
  assert.equal(s.read("outbox").emails[0].status, "approved")
  assert.equal((await sendOutbox({ store: new PlainStore({ dir: null }), config: config(), env, now: TUESDAY })).held, "command repo not attached")
})

test("sends oldest approved first, within what is left of the daily cap", async () => {
  const calls = []
  const already = [1, 2, 3].map((n) => email(n, { id: `old${n}`, status: "sent", sentAt: "2026-11-24T01:00:00Z" }))
  const s = store([...already, email(6), email(4), email(5), email(7, { status: "pending" })], [4, 5, 6, 7].map((n) => lead(n)))
  const out = await sendOutbox({ store: s, config: config(), env, fetchImpl: resend(calls), now: TUESDAY })
  assert.deepEqual([out.sent, out.failed, out.skipped, out.leftToday], [2, 0, 0, 0])
  assert.deepEqual(calls.map((c) => c.to[0]), ["enquiry4@example.test", "enquiry5@example.test"])
  const after = s.read("outbox").emails
  assert.equal(after.find((e) => e.id === "e4").status, "sent")
  assert.equal(after.find((e) => e.id === "e6").status, "approved")
  assert.equal(after.find((e) => e.id === "e7").status, "pending")
  assert.equal(s.read("leads").leads.find((l) => l.id === "l4").status, "contacted")
})

test("never emails a lead that replied or opted out, and a dry run sends nothing", async () => {
  const calls = []
  const s = store([email(1), email(2)], [lead(1, { status: "unsubscribed" }), lead(2)])
  const dry = await sendOutbox({ store: s, config: config(), env: {}, fetchImpl: resend(calls), now: TUESDAY, dryRun: true })
  assert.deepEqual([dry.wouldSend, dry.skipped, calls.length], [1, 1, 0])
  assert.equal(s.read("outbox").emails[0].status, "approved")
  const out = await sendOutbox({ store: s, config: config(), env, fetchImpl: resend(calls), now: TUESDAY })
  assert.deepEqual([out.sent, out.skipped], [1, 1])
  assert.deepEqual(calls.map((c) => c.to[0]), ["enquiry2@example.test"])
  assert.equal(s.read("outbox").emails[0].status, "skipped")
})

test("a refused send is recorded as failed and the result carries no address", async () => {
  const s = store([email(1)], [lead(1)])
  const out = await sendOutbox({ store: s, config: config(), env, fetchImpl: async () => ({ ok: false, status: 422 }), now: TUESDAY })
  assert.deepEqual([out.sent, out.failed], [0, 1])
  assert.equal(s.read("outbox").emails[0].status, "failed")
  assert.equal(s.read("leads").leads[0].status, "new")
  assert.doesNotMatch(JSON.stringify(out), /example\.test|Org 1/)
})
