#!/usr/bin/env node
// Checks every article in content/blog against content/rules.json.
//   node scripts/content/check.mjs            all articles
//   node scripts/content/check.mjs <slug>...  just these
// Exits non-zero when any article has errors.

import { legacySlugs, loadArticles, loadRules, loadSources, validateArticle } from "./lib.mjs"

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
process.exit(failed ? 1 : 0)
