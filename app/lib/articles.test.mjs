// Run with `pnpm test`. The same checks the content engine runs before it
// opens a pull request, applied to everything already in content/.
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  legacySlugs,
  loadArticles,
  loadCalendar,
  loadRules,
  loadSources,
  validateArticle,
} from "../../scripts/content/lib.mjs"

const rules = loadRules()
const sources = loadSources()
const articles = loadArticles()
const legacy = legacySlugs()
const knownSlugs = [...legacy, ...articles.map(({ article }) => article.slug)]

test("every article passes the content rules", () => {
  assert.ok(articles.length > 0)
  // Drafts never render; check.mjs still reports them on their pull request.
  for (const { file, article } of articles.filter(({ article }) => !article.draft)) {
    const { errors } = validateArticle(article, { rules, sources, knownSlugs })
    assert.deepEqual(errors, [], `${article.slug}: ${errors.join("; ")}`)
    assert.ok(file.endsWith(`/${article.slug}.json`), `${file} should be named ${article.slug}.json`)
  }
})

test("article slugs don't collide with the hand-written posts", () => {
  assert.ok(legacy.length > 10, "legacySlugs() should find the posts in blog-data.tsx")
  const seen = new Set()
  for (const slug of knownSlugs) {
    assert.ok(!seen.has(slug), `duplicate slug ${slug}`)
    seen.add(slug)
  }
})

test("the checks catch claims, banned phrases and broken links", () => {
  const good = articles.find(({ article }) => article.lang === "zh" && article.body.some((b) => b.type === "product")).article
  const check = (a) => validateArticle(a, { rules, sources, knownSlugs }).errors.join("\n")
  const withBody = (extra) => ({ ...good, body: [...good.body, extra] })

  assert.equal(check(good), "")
  assert.match(check(withBody({ type: "p", text: "这款喷雾无副作用。" })), /无副作用/)
  assert.match(check(withBody({ type: "p", text: "HerbalBath 没药喷雾可以缓解膝盖疼痛。" })), /缓解/)
  // An approved claim is fine next to the product, and an effect word is fine away from it.
  assert.equal(check(withBody({ type: "p", text: "HerbalBath 没药喷雾：10秒感受温热。" })), "")
  assert.equal(check(withBody({ type: "p", text: "热敷可以帮助缓解肌肉紧绷。" })), "")
  assert.match(check(withBody({ type: "product", text: "试试我们的喷雾。" })), /approved claim/)
  assert.match(check(withBody({ type: "p", text: "见[这篇](/blog/no-such-post)。" })), /goes nowhere/)
  assert.match(check({ ...good, cluster: "knee", sources: good.sources.slice(0, 1) }), /at least 2 sources/)
  assert.match(check({ ...good, lang: "en" }), /words; at least/)
})

test("calendar entries are complete and point at real sources", () => {
  const { entries } = loadCalendar()
  const ids = new Set(sources.map((s) => s.id))
  const planned = new Set(entries.map((e) => e.slug))
  assert.equal(planned.size, entries.length, "calendar slugs must be unique")
  for (const e of entries) {
    assert.match(e.publishOn, /^\d{4}-\d{2}-\d{2}$/, `${e.slug}: publishOn`)
    assert.ok(["zh", "en"].includes(e.lang), `${e.slug}: lang`)
    assert.ok(["planned", "published", "draft"].includes(e.status), `${e.slug}: status "${e.status}"`)
    assert.ok(e.keyword && e.cluster, `${e.slug}: keyword and cluster`)
    if (e.status === "published") {
      assert.ok(knownSlugs.includes(e.slug), `${e.slug} is marked published but has no article`)
      continue
    }
    if (e.status !== "planned") continue
    assert.ok(!knownSlugs.includes(e.slug), `${e.slug} is planned but already exists`)
    assert.ok(e.angle, `${e.slug}: angle`)
    for (const id of e.sources ?? []) assert.ok(ids.has(id), `${e.slug}: unknown source ${id}`)
    if (rules.healthClusters.includes(e.cluster)) {
      assert.ok((e.sources ?? []).length >= rules.minSources.health, `${e.slug}: health topics need ${rules.minSources.health} sources`)
    }
    for (const r of e.related ?? []) assert.ok(knownSlugs.includes(r) || planned.has(r), `${e.slug}: related ${r} doesn't exist`)
  }
})

test("the source library is https and has unique ids", () => {
  const ids = new Set()
  for (const s of sources) {
    assert.ok(!ids.has(s.id), `duplicate source id ${s.id}`)
    ids.add(s.id)
    assert.match(s.url, /^https:\/\//, s.id)
    assert.ok(s.title, s.id)
  }
})
