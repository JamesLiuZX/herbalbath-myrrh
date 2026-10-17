// Run with `pnpm test`. Autopilot's guardrails, tested without the network:
// the vault, replay-safe commits, input validation, each tool's rules, the
// Telegram commands and the bookkeeping maths.
import { test } from "node:test"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { randomBytes } from "node:crypto"
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { Changes } from "../../scripts/ops/lib/changes.mjs"
import { echoable } from "../../scripts/ops/lib/claude.mjs"
import { loadConfig, pauseReason } from "../../scripts/ops/lib/config.mjs"
import { validate } from "../../scripts/ops/lib/schema.mjs"
import { toHtml } from "../../scripts/ops/lib/telegram.mjs"
import { Vault, VaultError } from "../../scripts/ops/lib/vault.mjs"
import { b2bTools } from "../../scripts/ops/tools/b2b.mjs"
import { creativeTools } from "../../scripts/ops/tools/creative.mjs"
import { financeTools, ledgerTotals, parseCsv, storeUpload } from "../../scripts/ops/tools/finance.mjs"
import { socialTools } from "../../scripts/ops/tools/social.mjs"
import { handle } from "../../scripts/ops/inbox.mjs"

const key = () => randomBytes(32).toString("base64")
const tmp = () => mkdtempSync(path.join(os.tmpdir(), "autopilot-test-"))
const sgDate = (offsetDays) => new Date(Date.now() + offsetDays * 86_400_000).toLocaleDateString("en-CA", { timeZone: "Asia/Singapore" })

function setup({ emails = "review" } = {}) {
  const root = tmp()
  mkdirSync(path.join(root, "marketing/facebook"), { recursive: true })
  writeFileSync(path.join(root, "marketing/facebook/posts.json"), JSON.stringify({ posts: [] }))
  const vault = new Vault({ key: key(), dir: path.join(root, "ops/private") })
  const changes = new Changes({ vault, root })
  const config = loadConfig()
  config.actions = { ...config.actions, emails }
  const ctx = { agent: "test", config, changes, today: { date: sgDate(0), weekday: "Monday" }, gpu: false, run: { reports: [], attachments: [], emailsForApproval: [], stats: {} } }
  const tool = (tools, name) => tools(ctx).find((t) => t.name === name).run
  return { root, vault, changes, ctx, tool }
}

test("the vault round-trips, and refuses the wrong key or a renamed file", () => {
  const dir = tmp()
  const k = key()
  const vault = new Vault({ key: k, dir })
  vault.write("leads", { leads: [{ org: "Example Medical Hall" }] })
  assert.equal(new Vault({ key: k, dir }).read("leads").leads[0].org, "Example Medical Hall")
  assert.throws(() => new Vault({ key: key(), dir }).read("leads"), VaultError)
  const raw = readFileSync(path.join(dir, "leads.json.enc"), "utf8")
  assert.ok(!raw.includes("Example"), "the file is encrypted")
  writeFileSync(path.join(dir, "outbox.json.enc"), raw)
  assert.throws(() => vault.read("outbox"), VaultError, "a collection can't be swapped for another")
  assert.deepEqual(vault.read("missing", { a: 1 }), { a: 1 })
  assert.throws(() => new Vault({ key: "", dir }).write("x", {}), VaultError)
})

test("commits replay on top of a concurrent push instead of overwriting it", async () => {
  const origin = tmp()
  execFileSync("git", ["init", "--quiet", "--bare", "--initial-branch=main", origin])
  const seed = tmp()
  const g = (cwd, ...a) => execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", ...a], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] })
  g(seed, "init", "--quiet", "--initial-branch=main")
  mkdirSync(path.join(seed, "marketing/facebook"), { recursive: true })
  writeFileSync(path.join(seed, "marketing/facebook/posts.json"), JSON.stringify({ posts: [{ id: "a" }] }))
  g(seed, "add", "-A")
  g(seed, "commit", "--quiet", "-m", "seed")
  g(seed, "remote", "add", "origin", origin)
  g(seed, "push", "--quiet", "origin", "main")
  const clone = (dir) => g(path.dirname(dir), "clone", "--quiet", origin, path.basename(dir))
  const parent = tmp()
  const mine = path.join(parent, "mine")
  const theirs = path.join(parent, "theirs")
  clone(mine)
  clone(theirs)

  const k = key()
  const changes = new Changes({ vault: new Vault({ key: k, dir: path.join(mine, "ops/private") }), root: mine })
  changes.json("marketing/facebook/posts.json", { posts: [] }, (d) => ({ posts: [...d.posts, { id: "mine" }] }))
  changes.private("activity", { events: [] }, (v) => ({ events: [...v.events, { agent: "mine" }] }))

  // Meanwhile another run pushes its own post.
  const t = JSON.parse(readFileSync(path.join(theirs, "marketing/facebook/posts.json"), "utf8"))
  t.posts.push({ id: "theirs" })
  writeFileSync(path.join(theirs, "marketing/facebook/posts.json"), JSON.stringify(t))
  g(theirs, "commit", "--quiet", "-am", "theirs")
  g(theirs, "push", "--quiet", "origin", "main")

  const sha = await changes.commitToMain("autopilot(test): add mine")
  assert.ok(sha)
  const check = path.join(parent, "check")
  clone(check)
  const ids = JSON.parse(readFileSync(path.join(check, "marketing/facebook/posts.json"), "utf8")).posts.map((p) => p.id)
  assert.deepEqual(ids, ["a", "theirs", "mine"])
  assert.equal(new Vault({ key: k, dir: path.join(check, "ops/private") }).read("activity").events[0].agent, "mine")
})

test("tool inputs are validated before they run", () => {
  const schema = { type: "object", additionalProperties: false, required: ["a"], properties: { a: { type: "string", enum: ["x", "y"] }, n: { type: "array", items: { type: "integer" } } } }
  assert.deepEqual(validate({ a: "x", n: [1, 2] }, schema), [])
  assert.match(validate({}, schema).join(), /input.a is required/)
  assert.match(validate({ a: "z" }, schema).join(), /one of/)
  assert.match(validate({ a: "x", extra: 1 }, schema).join(), /isn't a known field/)
  assert.match(validate({ a: "x", n: [1.5] }, schema).join(), /n\[0\] should be integer/)
})

test("after a mid-output fallback, only safe blocks are echoed back", () => {
  const content = [
    { type: "thinking", thinking: "" },
    { type: "text", text: "partial" },
    { type: "tool_use", id: "t1", name: "x", input: {} },
    { type: "server_tool_use", id: "s1", name: "web_search", input: {} },
    { type: "web_search_tool_result", tool_use_id: "s1", content: [] },
    { type: "server_tool_use", id: "s2", name: "web_search", input: {} },
    { type: "fallback", from: {}, to: {} },
    { type: "tool_use", id: "t2", name: "y", input: {} },
  ]
  assert.deepEqual(echoable(content).map((b) => b.id ?? b.type), ["text", "s1", "web_search_tool_result", "t2"])
  assert.equal(echoable(content.slice(0, 3)).length, 3, "no fallback, no change")
})

test("pauses stop the team, from any of the three places", () => {
  const config = loadConfig()
  assert.equal(pauseReason({ config, state: {}, agent: "social", env: {} }), null)
  assert.match(pauseReason({ config, state: {}, agent: "social", env: { AUTOPILOT_PAUSED: "true" } }), /AUTOPILOT_PAUSED/)
  assert.match(pauseReason({ config, state: { paused: { all: true } }, agent: "social", env: {} }), /Telegram/)
  assert.match(pauseReason({ config, state: { paused: { agents: { b2b: true } } }, agent: "b2b", env: {} }), /b2b/)
  assert.match(pauseReason({ config: { ...config, agents: { social: { mode: "off" } } }, state: {}, agent: "social", env: {} }), /off/)
})

test("Telegram messages escape HTML and keep simple formatting", () => {
  assert.equal(toHtml("## Plan\n- **Posts** <3 & [site](https://herbalbathsg.com)"), '<b>Plan</b>\n• <b>Posts</b> &lt;3 &amp; <a href="https://herbalbathsg.com">site</a>')
})

test("the social agent can only add posts that pass every rule", () => {
  const { root, ctx, tool } = setup()
  const add = tool(socialTools, "add_post")
  const when = `${sgDate(5)} 09:00`
  assert.throws(() => add({ publishAt: `${sgDate(-1)} 09:00`, lang: "zh", pillar: "tip", text: "长辈出门前，记得带水和帽子，走累了就坐下来休息一下。", imagePrompt: "a park" }), /at least 2 hours/)
  assert.throws(() => add({ publishAt: when, lang: "zh", pillar: "tip", text: "这款喷雾效果神奇，无副作用，大家快来试试看吧。", imagePrompt: "a park" }), /banned/)
  assert.throws(() => add({ publishAt: when, lang: "zh", pillar: "product", text: "HerbalBath 没药草本能量油可以缓解肩颈酸痛，欢迎订购。", link: "https://herbalbathsg.com/pay" }), /缓解/)
  assert.throws(() => add({ publishAt: when, lang: "zh", pillar: "product", text: "HerbalBath 没药草本能量油，送给爸妈的一份心意，欢迎订购。", link: "https://herbalbathsg.com/pay" }), /approved claim/)
  assert.throws(() => add({ publishAt: when, lang: "en", pillar: "article", text: "Our new guide on something useful for families in Singapore.", link: "https://herbalbathsg.com/blog/no-such-article" }), /isn't live or planned/)
  assert.throws(() => add({ publishAt: when, lang: "en", pillar: "tip", text: "A short reminder to drink water on hot days, especially for seniors." }), /link or an imagePrompt/)
  const ok = add({ publishAt: when, lang: "zh", pillar: "tip", text: "下雨天组屋走廊容易湿滑，出门穿防滑、合脚的鞋，走慢一点。", imagePrompt: "Rainy HDB corridor, an elderly woman walking carefully with an umbrella, photorealistic" })
  assert.match(ok.added, new RegExp(`^${sgDate(5)}-tip`))
  assert.throws(() => add({ publishAt: when, lang: "zh", pillar: "tip", text: "第二篇同一时间的帖子，内容也很有用的提醒。", imagePrompt: "a park" }), /already has a post/)
  const posts = JSON.parse(readFileSync(path.join(root, "marketing/facebook/posts.json"), "utf8")).posts
  assert.equal(posts.length, 1)
  assert.ok(existsSync(path.join(root, "marketing/facebook/posts.csv")))
  assert.equal(ctx.run.stats.postsAdded, 1)
})

test("the creative agent's briefs respect the GPU, the weekly limit and the post they're for", () => {
  const { ctx, tool, root } = setup()
  const queue = tool(creativeTools, "queue_media")
  assert.throws(() => queue({ kind: "ad", prompt: "A daughter's gift for her mother at CNY" }), /language and an angle/)
  const r = queue({ kind: "ad", prompt: "A daughter's gift for her mother at CNY", language: "zh", angle: "gift" })
  assert.equal(r.needsGpu, false)
  const s = queue({ kind: "product-scene", prompt: "The box and bottle on a teak table beside a window" })
  assert.equal(s.needsGpu, true)
  assert.equal(s.gpuAvailable, false)
  const brief = JSON.parse(readFileSync(path.join(root, `ops/creative/queue/${r.queued}.json`), "utf8"))
  assert.equal(brief.status, "queued")
  assert.equal(brief.aspect, "9:16")
  ctx.run.stats.mediaQueued = ctx.config.limits.mediaJobsPerWeek
  assert.throws(() => queue({ kind: "product-video", prompt: "A slow push-in on the pack" }), /weekly media limit/)
})

test("trade emails follow the outreach rules, and wait for approval", () => {
  const { ctx, tool, vault } = setup()
  const upsert = tool(b2bTools, "upsert_lead")
  const queue = tool(b2bTools, "queue_email")
  const noEmail = upsert({ org: "Lim Medical Hall", type: "medical-hall", source: "https://example.com/lim" })
  assert.throws(() => queue({ leadId: noEmail.id, kind: "first", lang: "zh", subject: "合作", body: "您好" }), /no email/)
  const lead = upsert({ org: "Tan TCM Clinic", type: "tcm-clinic", website: "https://www.tantcm.example", email: "hello@tantcm.example", source: "https://www.tantcm.example/contact" })
  assert.equal(upsert({ org: "Tan TCM Clinic (dup)", type: "tcm-clinic", website: "https://tantcm.example/about", source: "https://tantcm.example" }).id, lead.id, "deduplicated by website")
  assert.throws(() => queue({ leadId: lead.id, kind: "follow-up", lang: "en", subject: "Following up", body: "Hi again" }), /Nothing sent yet/)
  assert.throws(() => queue({ leadId: lead.id, kind: "first", lang: "en", subject: "A natural remedy", body: "Our oil cures joint pain with no side effects." }), /Claims rules/)
  const q = queue({ leadId: lead.id, kind: "first", lang: "en", subject: "Warm-feeling myrrh oil for your counter", body: "Hi Dr Tan, I'm James from HerbalBath. Could I drop by with testers? James, HerbalBath" })
  assert.match(q.status, /waiting for James/)
  assert.throws(() => queue({ leadId: lead.id, kind: "first", lang: "en", subject: "Again", body: "Hi" }), /already waiting/)
  const email = vault.read("outbox").emails[0]
  assert.equal(email.status, "pending")
  assert.match(email.body, /unsubscribe/)
  assert.equal(ctx.run.emailsForApproval.length, 1)
})

test("in auto mode, drafts are approved for the sender", () => {
  const { tool, vault } = setup({ emails: "auto" })
  const lead = tool(b2bTools, "upsert_lead")({ org: "Ang Mo Kio Rehab Rentals", type: "rental-shop", email: "sales@amkrental.example", source: "https://amkrental.example" })
  tool(b2bTools, "queue_email")({ leadId: lead.id, kind: "first", lang: "en", subject: "Add-on for your customers", body: "Hi, I'm James from HerbalBath. Could I show you our testers? James" })
  assert.equal(vault.read("outbox").emails[0].status, "approved")
})

test("Telegram commands approve drafts, pause the team and record replies", async () => {
  const { ctx, tool, vault } = setup()
  const lead = tool(b2bTools, "upsert_lead")({ org: "Bedok Tuina", type: "tuina-reflexology", email: "hi@bedoktuina.example", source: "https://bedoktuina.example" })
  tool(b2bTools, "queue_email")({ leadId: lead.id, kind: "first", lang: "en", subject: "Testers for your counter", body: "Hi, James from HerbalBath here. Testers? James" })
  const id = vault.read("outbox").emails[0].id
  assert.match(await handle("/drafts", ctx), new RegExp(id))
  assert.match(await handle(`/approve ${id.toLowerCase()}`, ctx), /Approved/)
  assert.equal(vault.read("outbox").emails[0].status, "approved")
  assert.match(await handle("/approve all", ctx), /Nothing matched/)
  assert.match(await handle("/pause b2b", ctx), /Paused the b2b agent/)
  assert.equal(vault.read("state").paused.agents.b2b, true)
  assert.match(await handle("/resume all", ctx), /Resumed everything/)
  assert.match(await handle(`/lead ${lead.id} replied`, ctx), /replied/)
  assert.equal(vault.read("leads").leads[0].status, "replied")
  assert.match(await handle("/lead x nonsense", ctx), /Statuses/)
  assert.match(await handle("/help", ctx), /approve/)
})

test("the bookkeeper parses CSVs, skips duplicates and does the maths in code", () => {
  assert.deepEqual(parseCsv('date,desc,amount\r\n2026-10-01,"PayNow HB20261001ABCD, Mdm Tan",39.00\n2026-10-02,"He said ""hi""",-5\n'), [
    ["date", "desc", "amount"],
    ["2026-10-01", "PayNow HB20261001ABCD, Mdm Tan", "39.00"],
    ["2026-10-02", 'He said "hi"', "-5"],
  ])
  const { changes, tool, vault } = setup()
  storeUpload(changes, { name: "aspire-oct.csv", buffer: Buffer.from("date,desc,amount\n2026-10-01,PayNow,117\n"), mime: "text/csv" })
  assert.equal(tool(financeTools, "read_upload")({ name: "aspire-oct.csv" }).total, 2)
  const record = tool(financeTools, "record_transactions")
  const rows = [
    { date: "2026-10-01", amount: 117, category: "sales-paynow", ref: "HB20261001ABCD" },
    { date: "2026-10-03", amount: 39, category: "sales-shopee", ref: "S1" },
    { date: "2026-10-04", amount: -39, category: "refunds", ref: "R1" },
    { date: "2026-10-05", amount: -60, category: "advertising", ref: "META" },
    { date: "2026-10-06", amount: -500, category: "owner-transfer", ref: "OWN" },
  ]
  assert.deepEqual(record({ upload: "aspire-oct.csv", transactions: rows }), { added: 5, skippedAsDuplicates: 0 })
  assert.deepEqual(record({ upload: "aspire-oct.csv", transactions: rows.slice(0, 2) }), { added: 0, skippedAsDuplicates: 2 })
  const totals = ledgerTotals(vault.read("finance").ledger, "2026-10-01", "2026-10-31")
  assert.equal(totals.sales, 156)
  assert.equal(totals.refunds, -39)
  assert.equal(totals.operatingCosts, -60)
  assert.equal(totals.operatingProfit, 57)
})
