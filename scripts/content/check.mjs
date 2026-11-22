#!/usr/bin/env node
// Checks every article in content/blog against content/rules.json, and
// content/promotions.json against its price and wording guards.
//   node scripts/content/check.mjs            everything
//   node scripts/content/check.mjs <slug>...  just these articles
// Exits non-zero when anything has errors.

import { legacySlugs, loadArticles, loadRules, loadSources, validateArticle } from "./lib.mjs"
import { promotionProblems } from "./promotions.mjs"

const only = new Set(process.argv.slice(2))
const rules = loadRules()
const sources = loadSources()
const articles = loadArticles()
const knownSlugs = [...legacySlugs(), ...articles.map(({ article }) => article.slug)]

let failed = 0
for (const { file, article } of articles) {
  if (only.size && !only.has(article.slug)) continue
  const { errors, warnings } = validateArticle(article, { rules, sources, knownSlugs })
  const name = file.split("/").pop()
  if (!file.endsWith(`/${article.slug}.json`)) errors.push(`file name should be ${article.slug}.json`)
  console.log(`${errors.length ? "FAIL" : "ok  "} ${name}${article.draft ? " (draft)" : ""}`)
  for (const e of errors) console.log(`       error: ${e}`)
  for (const w of warnings) console.log(`       warn:  ${w}`)
  if (errors.length) failed++
}
if (!only.size) {
  const problems = promotionProblems(undefined, rules)
  console.log(`${problems.length ? "FAIL" : "ok  "} promotions.json`)
  for (const e of problems) console.log(`       error: ${e}`)
  if (problems.length) failed++
}
process.exit(failed ? 1 : 0)
