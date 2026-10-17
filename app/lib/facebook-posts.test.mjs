// Run with `pnpm test`. Checks the pre-written Facebook posts in
// marketing/facebook/posts.json against the same rules as the blog.
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { claimProblems, legacySlugs, loadArticles, loadCalendar, loadRules, loadSources } from "../../scripts/content/lib.mjs"

const { posts } = JSON.parse(readFileSync(new URL("../../marketing/facebook/posts.json", import.meta.url), "utf8"))
const rules = loadRules()
const PILLARS = new Set(["article", "tip", "community", "festival", "protection", "product", "service"])

test("posts are well-formed and in date order", () => {
  const ids = new Set()
  let previous = ""
  for (const p of posts) {
    assert.ok(!ids.has(p.id), `duplicate id ${p.id}`)
    ids.add(p.id)
    assert.match(p.publishAt, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, `${p.id}: publishAt`)
    assert.ok(p.id.startsWith(p.publishAt.slice(0, 10)), `${p.id} should start with its date`)
    assert.ok(p.publishAt > previous, `${p.id} is out of order or shares a time`)
    previous = p.publishAt
    assert.ok(["zh", "en"].includes(p.lang), `${p.id}: lang`)
    assert.ok(PILLARS.has(p.pillar), `${p.id}: pillar "${p.pillar}"`)
    assert.ok(p.text?.trim(), `${p.id}: text`)
    assert.ok(!p.text.includes("**"), `${p.id}: Facebook doesn't render **bold**`)
    assert.ok(!(p.link && p.image), `${p.id}: a link or an image, not both`)
    if (p.link) assert.match(p.link, /^https:\/\//, `${p.id}: link`)
  }
})

test("posts pass the claims rules", () => {
  for (const p of posts) assert.deepEqual(claimProblems([p.text], p.lang, rules), [], p.id)
  const approved = [...rules.product.approvedClaims.zh, ...rules.product.approvedClaims.en].map((c) => c.toLowerCase())
  for (const p of posts.filter((x) => x.pillar === "product")) {
    assert.ok(approved.some((c) => p.text.toLowerCase().includes(c)), `${p.id}: product posts use an approved claim word for word`)
  }
  const products = posts.filter((p) => p.pillar === "product").length
  assert.ok(products * 5 <= posts.length, `${products} product posts out of ${posts.length}; keep it to one in five`)
})

test("blog links point at published or planned articles, and sources exist", () => {
  const slugs = new Set([...legacySlugs(), ...loadArticles().map(({ article }) => article.slug), ...loadCalendar().entries.map((e) => e.slug)])
  const sources = new Set(loadSources().map((s) => s.id))
  for (const p of posts) {
    const m = p.link?.match(/^https:\/\/herbalbathsg\.com\/blog\/([^/?#]+)/)
    if (m) assert.ok(slugs.has(m[1]), `${p.id}: /blog/${m[1]} isn't published or planned`)
    for (const id of p.sources ?? []) assert.ok(sources.has(id), `${p.id}: unknown source ${id}`)
  }
})
