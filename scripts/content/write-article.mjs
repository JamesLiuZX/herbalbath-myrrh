#!/usr/bin/env node
// The content engine: writes one article from content/calendar.json.
//   node scripts/content/write-article.mjs             the entry due this week (or an overdue one)
//   node scripts/content/write-article.mjs <slug>      that entry, whatever its date
//   node scripts/content/write-article.mjs --dry-run   show what would be sent; no API call
//
// Two calls to Claude. The first reads the entry's sources with the web fetch
// tool and writes research notes, so the facts come from the pages and not
// from memory. The second writes the article as JSON (structured outputs),
// briefed with content/WRITING.md and the lists in content/rules.json. The
// article then goes through the same checks as a hand-written one (lib.mjs),
// with one repair round if they fail. Still failing, it's saved with
// draft: true, which keeps it off the site while the pull request shows why.
//
// Needs ANTHROPIC_API_KEY. Writes content/blog/<slug>.json, updates the
// calendar entry's status, and leaves the commit message, PR title and PR body
// in .content-engine/ for .github/workflows/content-engine.yml.
//   CONTENT_MODEL   override the model
//   SKIP_SLUGS      slugs that already have an open content/<slug> branch

import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { BLOG_DIR, CONTENT, ROOT, legacyTitles, loadArticles, loadCalendar, loadRules, loadSources, validateArticle } from "./lib.mjs"

const MODEL = process.env.CONTENT_MODEL || "claude-opus-5-5"
// Server-side refusal fallbacks exist on these models only; elsewhere the parameter is a 400.
const FALLBACK_MODELS = new Set(["claude-fable-5-1", "claude-opus-5-5", "claude-opus-5", "claude-sonnet-5-5"])
const OUT = path.join(ROOT, ".content-engine")
const CALENDAR = path.join(CONTENT, "calendar.json")

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const wanted = args.find((a) => !a.startsWith("--"))
const skip = new Set((process.env.SKIP_SLUGS ?? "").split(/\s+/).filter(Boolean))
const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Singapore" })

class EngineError extends Error {}

function addDays(iso, n) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** The entry asked for, or the earliest planned one due within the next seven days. */
function pickEntry(calendar) {
  if (wanted) {
    const entry = calendar.entries.find((e) => e.slug === wanted)
    if (!entry) throw new EngineError(`No calendar entry has the slug "${wanted}".`)
    if (entry.status === "published") throw new EngineError(`"${wanted}" is already published.`)
    if (skip.has(wanted)) throw new EngineError(`A content/${wanted} branch already exists. Close its pull request and delete the branch to rewrite it.`)
    return entry
  }
  const horizon = addDays(today, 6)
  return (
    calendar.entries
      .filter((e) => e.status === "planned" && e.publishOn <= horizon && !skip.has(e.slug))
      .sort((a, b) => a.publishOn.localeCompare(b.publishOn))[0] ?? null
  )
}

// ---------------------------------------------------------------------------
// Prompts.

const quoteList = (words) => [...new Set(words)].map((w) => `“${w}”`).join(", ")

function writerSystem(rules) {
  const guide = readFileSync(path.join(CONTENT, "WRITING.md"), "utf8")
  return `You write articles for herbalbathsg.com, the blog of HerbalBath, a small Singapore company that sells a myrrh and frankincense spray. The blog's job is to be the most useful page on the web for each topic it covers, for Singaporeans aged 55+ and their families. Here is the editorial guide; follow all of it.

<guide>
${guide}
</guide>

<rules>
The automatic checks reject an article that breaks any of these, so treat them as hard limits.
- Banned anywhere, in either language: ${quoteList([...rules.banned.zh, ...rules.banned.en])}.
- These effect words must not appear in a sentence that mentions ${quoteList([...rules.productWords.zh, ...rules.productWords.en])}: ${quoteList([...rules.effectWords.zh, ...rules.effectWords.en])}.
- Approved product claims, to be used word for word (at least one in the product block): Chinese ${quoteList(rules.product.approvedClaims.zh)}; English ${quoteList(rules.product.approvedClaims.en)}.
- Length: at least ${rules.length.zhMinChars} Chinese characters, or ${rules.length.enMinWords} English words, of body text.
- Title: at most ${rules.length.titleMax.zh} characters in Chinese or ${rules.length.titleMax.en} in English. Description: ${rules.length.descriptionRange.zh.join("-")} characters in Chinese, ${rules.length.descriptionRange.en.join("-")} in English.
- Health topics (${rules.healthClusters.join(", ")}) cite at least ${rules.minSources.health} sources.
</rules>

Besides the article, fill in coverPrompt with a prompt for a photorealistic 16:9 cover photo (a Singapore setting that fits the article, natural light, no text, no product, no medical imagery, no identifiable brands), and reviewNotes with anything the editor should double-check: a figure the notes were vague about, a gap in the sources, a judgement call. Write reviewNotes in English.`
}

const RESEARCH_SYSTEM = `You are the research assistant for a Singapore blog for people aged 55+ and their families. Before an article is written, you read its sources and write notes for the writer, who may state only what your notes support.

Fetch every source URL you are given with the web_fetch tool. If a page links to a sub-page that clearly holds the details the article needs (eligibility, fees, how to apply), you may fetch that too, on the same site. Then write the notes, in English, one section per source:

## <source id>: <page title>
- Facts that matter for this article: amounts and prices exactly as written, age limits, eligibility rules, steps, phone numbers, opening hours, dates. Quote figures verbatim.
- The page's "last updated" date, if it shows one.

If a page fails to load or doesn't cover the topic, say so in one line; never fill in from memory. Finish with a "Gaps" section: what the article's angle asks for that none of the sources cover.`

function researchPrompt(entry, sources) {
  return `Article being planned:
${JSON.stringify({ keyword: entry.keyword, secondary: entry.secondary ?? [], language: entry.lang, angle: entry.angle }, null, 2)}

Sources to read:
${sources.map((s) => `- ${s.id}: ${s.title} (${s.url})`).join("\n")}`
}

function writerPrompt(entry, { sources, notes, linkable }) {
  return `Write this article. Today is ${today}.

<entry>
${JSON.stringify(entry, null, 2)}
</entry>

Language: ${entry.lang === "zh" ? "Simplified Chinese (Singapore usage)" : "English"}.

<sources>
The sources you may cite. List in sourceIds the ones your article actually relies on.
${sources.map((s) => `- ${s.id}: ${s.title} (${s.url})`).join("\n")}
</sources>

<research_notes>
${notes || "(No research notes: the sources couldn't be read. Keep to general, well-established advice, send readers to the official pages for figures, and say so in reviewNotes.)"}
</research_notes>

<our_articles>
Articles you may link to as [label](/blog/slug) and list in related (2 to 4, the most useful first):
${linkable.map((p) => `- ${p.slug}: ${p.title}`).join("\n")}
</our_articles>`
}

// ---------------------------------------------------------------------------
// The article's JSON Schema, for structured outputs: every object closed and
// every property required.

function articleSchema(sourceIds, slugs) {
  const str = { type: "string" }
  const strings = { type: "array", items: str }
  const obj = (properties) => ({ type: "object", additionalProperties: false, properties, required: Object.keys(properties) })
  const kind = (...names) => ({ type: "string", enum: names })
  return obj({
    title: str,
    description: str,
    keywords: strings,
    body: {
      type: "array",
      items: {
        anyOf: [
          obj({ type: kind("p", "h2", "h3"), text: str }),
          obj({ type: kind("ul", "ol"), items: strings }),
          obj({ type: kind("tip"), title: str, text: str }),
          obj({ type: kind("product"), text: str }),
          obj({ type: kind("table"), head: strings, rows: { type: "array", items: strings } }),
        ],
      },
    },
    faq: { type: "array", items: obj({ q: str, a: str }) },
    sourceIds: { type: "array", items: { type: "string", enum: sourceIds } },
    related: { type: "array", items: { type: "string", enum: slugs } },
    coverPrompt: str,
    reviewNotes: str,
  })
}

// ---------------------------------------------------------------------------
// Claude.

const usage = { input: 0, output: 0, fetches: 0 }

function count(message) {
  usage.input += (message.usage?.input_tokens ?? 0) + (message.usage?.cache_read_input_tokens ?? 0) + (message.usage?.cache_creation_input_tokens ?? 0)
  usage.output += message.usage?.output_tokens ?? 0
  usage.fetches += message.usage?.server_tool_use?.web_fetch_requests ?? 0
}

const textOf = (message) =>
  message.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim()

async function call(Anthropic, run) {
  try {
    return await run()
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) throw new EngineError("Claude rejected ANTHROPIC_API_KEY.")
    if (e instanceof Anthropic.PermissionDeniedError) throw new EngineError(`This API key can't use ${MODEL}.`)
    if (e instanceof Anthropic.NotFoundError) throw new EngineError(`Claude doesn't know the model "${MODEL}".`)
    if (e instanceof Anthropic.RateLimitError) throw new EngineError("Claude is rate limiting this key. Re-run the workflow later.")
    if (e instanceof Anthropic.APIError) throw new EngineError(`Claude returned an error (${e.status ?? "network"}): ${e.message}`)
    throw e
  }
}

/** Reads the sources and returns research notes ("" when they can't be read). */
async function research(client, Anthropic, entry, sources) {
  if (!sources.length) return ""
  const domains = [...new Set(sources.map((s) => new URL(s.url).hostname.replace(/^www\./, "")))]
  const messages = [{ role: "user", content: researchPrompt(entry, sources) }]
  for (let turn = 0; turn < 6; turn++) {
    const message = await call(Anthropic, () =>
      client.messages
        .stream({
          model: MODEL,
          max_tokens: 16000,
          system: RESEARCH_SYSTEM,
          output_config: { effort: "medium" },
          tools: [{ type: "web_fetch_20260209", name: "web_fetch", allowed_domains: domains, max_uses: sources.length * 2 + 2, max_content_tokens: 20000 }],
          messages,
        })
        .finalMessage(),
    )
    count(message)
    // The server-side tool loop hit its iteration limit: send the turn back to resume it.
    if (message.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: message.content })
      continue
    }
    if (message.stop_reason === "refusal") return ""
    return textOf(message)
  }
  return ""
}

/** One structured-output request; `history` carries the draft and its errors on a repair round. */
async function writeOnce(client, Anthropic, { system, prompt, schema, history = [] }) {
  const params = {
    model: MODEL,
    max_tokens: 32000,
    system,
    output_config: { effort: "high", format: { type: "json_schema", schema } },
    messages: [{ role: "user", content: prompt }, ...history],
  }
  if (FALLBACK_MODELS.has(MODEL)) {
    params.betas = ["server-side-fallback-2026-07-01"]
    params.fallbacks = "default"
  }
  const message = await call(Anthropic, () => client.beta.messages.stream(params).finalMessage())
  count(message)
  if (message.stop_reason === "refusal") throw new EngineError("Claude declined to write this article. Change the angle in the calendar and re-run.")
  if (message.stop_reason === "max_tokens") throw new EngineError("The article was cut off at the output limit.")
  try {
    return { draft: JSON.parse(textOf(message)), raw: textOf(message) }
  } catch {
    throw new EngineError("Claude's answer wasn't valid JSON.")
  }
}

// ---------------------------------------------------------------------------

function toArticle(entry, draft, library) {
  const byId = new Map(library.map((s) => [s.id, s]))
  const body = draft.body.map((b) => (b.type === "tip" && !b.title?.trim() ? { type: "tip", text: b.text } : b))
  return {
    slug: entry.slug,
    lang: entry.lang,
    title: draft.title.trim(),
    description: draft.description.trim(),
    date: today,
    author: entry.lang === "zh" ? "HerbalBath 编辑部" : "HerbalBath Editorial",
    cluster: entry.cluster,
    keywords: draft.keywords,
    image: null,
    body,
    faq: draft.faq,
    sources: [...new Set(draft.sourceIds)].map((id) => ({ title: byId.get(id).title, url: byId.get(id).url })),
    related: [...new Set(draft.related)].filter((s) => s !== entry.slug).slice(0, 4),
  }
}

/** Changes one entry's status in place, so the hand-formatted calendar keeps its layout. */
function setStatus(slug, status) {
  const src = readFileSync(CALENDAR, "utf8")
  const at = src.indexOf(`"slug": "${slug}"`)
  const end = src.indexOf(`"slug": "`, at + 1)
  const region = src.slice(at, end === -1 ? undefined : end)
  const updated = region.replace(/"status": "[a-z]+"/, `"status": "${status}"`)
  const next = src.slice(0, at) + updated + (end === -1 ? "" : src.slice(end))
  if (JSON.parse(next).entries.find((e) => e.slug === slug)?.status !== status) throw new EngineError(`Couldn't update the calendar entry for ${slug}.`)
  writeFileSync(CALENDAR, next)
}

function prBody(entry, article, { errors, warnings, draft, notes }) {
  const checks = errors.length
    ? `❌ **Failed the content checks after one repair round**, so it's saved as a draft and won't appear on the site. Fix these, delete the \`"draft": true\` line, set the calendar status to \`published\`, and run \`node scripts/content/check.mjs ${entry.slug}\`:\n${errors.map((e) => `- ${e}`).join("\n")}`
    : "✅ Passed the content checks (`scripts/content/check.mjs`)."
  return `## ${article.title}

${article.description}

**Keyword:** ${entry.keyword} · **Language:** ${entry.lang} · **Cluster:** ${entry.cluster} · **Planned for:** ${entry.publishOn}

### Checks
${checks}
${warnings.length ? `\nWarnings for the editor:\n${warnings.map((w) => `- ${w}`).join("\n")}\n` : ""}
### Before you merge (content/WRITING.md, "Reviewing")
- [ ] Open each source and check every number, date and eligibility rule against it
${article.sources.map((s) => `  - [${s.title}](${s.url})`).join("\n")}
- [ ] The product paragraph is optional in tone, uses approved claims only, and says nothing about effects or conditions
- [ ] Read it on the Vercel preview: tone, Singapore usage, links
- [ ] Optional: add a cover image (below)

### Notes from the writer
${draft.reviewNotes?.trim() || "None."}

### Cover image (optional)
Generate it in Kino with this prompt, save it as \`public/blog/${entry.slug}.webp\` (1600×900), and set \`"image": "/blog/${entry.slug}.webp"\` and an \`"imageAlt"\` in \`content/blog/${entry.slug}.json\`.

> ${draft.coverPrompt?.trim() || "(none)"}

<details><summary>Research notes the article was written from</summary>

${notes || "No notes: the sources couldn't be read, so check every fact by hand."}

</details>

Written by the content engine (\`scripts/content/write-article.mjs\`). ${usage.fetches} pages fetched, ${usage.input.toLocaleString("en")} input and ${usage.output.toLocaleString("en")} output tokens.
`
}

async function main() {
  const calendar = loadCalendar()
  const entry = pickEntry(calendar)
  if (!entry) {
    console.log(`Nothing due: no planned calendar entry on or before ${addDays(today, 6)}.`)
    return
  }
  const rules = loadRules()
  const library = loadSources()
  const articles = loadArticles().map(({ article }) => article)
  const linkable = [...articles.filter((a) => !a.draft).map((a) => ({ slug: a.slug, title: a.title })), ...legacyTitles()].filter((p) => p.slug !== entry.slug)
  const knownSlugs = [...linkable.map((p) => p.slug), entry.slug]
  const unknown = (entry.sources ?? []).filter((id) => !library.some((s) => s.id === id))
  if (unknown.length) throw new EngineError(`Calendar entry ${entry.slug} names sources not in content/sources.json: ${unknown.join(", ")}`)
  const sources = (entry.sources ?? []).map((id) => library.find((s) => s.id === id))
  // The article may cite only what was read for it; an entry without sources may cite the library.
  const citable = sources.length ? sources : library
  const system = writerSystem(rules)
  const schema = articleSchema(
    citable.map((s) => s.id),
    linkable.map((p) => p.slug),
  )

  console.log(`Writing ${entry.slug} (${entry.lang}, planned for ${entry.publishOn}) from ${sources.length} source(s).`)
  if (dryRun) {
    console.log(`\n--- research prompt ---\n${researchPrompt(entry, sources)}`)
    console.log(`\n--- writer system prompt ---\n${system}`)
    console.log(`\n--- writer prompt ---\n${writerPrompt(entry, { sources: citable, notes: "(research notes go here)", linkable })}`)
    console.log(`\n--- schema: ${JSON.stringify(schema).length} characters ---`)
    return
  }
  if (!process.env.ANTHROPIC_API_KEY) throw new EngineError("Set ANTHROPIC_API_KEY (a repository secret, for the workflow).")

  const { default: Anthropic } = await import("@anthropic-ai/sdk")
  const client = new Anthropic({ maxRetries: 3, timeout: 15 * 60 * 1000 })

  const notes = await research(client, Anthropic, entry, sources)
  console.log(notes ? `Research notes: ${notes.length} characters from ${usage.fetches} fetches.` : "No research notes; writing without them.")

  const prompt = writerPrompt(entry, { sources: citable, notes, linkable })
  let { draft, raw } = await writeOnce(client, Anthropic, { system, prompt, schema })
  let article = toArticle(entry, draft, library)
  let result = validateArticle(article, { rules, sources: library, knownSlugs })

  if (result.errors.length) {
    console.log(`First draft failed ${result.errors.length} check(s); asking for a fix.`)
    const history = [
      { role: "assistant", content: raw },
      { role: "user", content: `The automatic checks rejected this draft:\n${result.errors.map((e) => `- ${e}`).join("\n")}\n\nReturn the whole article again with every problem fixed and nothing else changed.` },
    ]
    ;({ draft } = await writeOnce(client, Anthropic, { system, prompt, schema, history }))
    article = toArticle(entry, draft, library)
    result = validateArticle(article, { rules, sources: library, knownSlugs })
  }

  const failed = result.errors.length > 0
  if (failed) article.draft = true
  mkdirSync(BLOG_DIR, { recursive: true })
  writeFileSync(path.join(BLOG_DIR, `${entry.slug}.json`), `${JSON.stringify(article, null, 2)}\n`)
  setStatus(entry.slug, failed ? "draft" : "published")

  const title = `${failed ? "Draft" : "New article"}: ${article.title}`
  mkdirSync(OUT, { recursive: true })
  writeFileSync(path.join(OUT, "pr-title.txt"), `${title}\n`)
  writeFileSync(path.join(OUT, "pr-body.md"), prBody(entry, article, { ...result, draft, notes }))
  writeFileSync(path.join(OUT, "commit-message.txt"), `content: ${failed ? "draft of" : "add"} ${entry.slug}\n\n${article.title}\n`)
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `slug=${entry.slug}\ndraft=${failed}\n`)

  console.log(`${failed ? "Saved as a draft" : "Done"}: content/blog/${entry.slug}.json (${result.errors.length} errors, ${result.warnings.length} warnings).`)
  console.log(`Usage: ${usage.input} input tokens, ${usage.output} output tokens, ${usage.fetches} pages fetched.`)
}

main().catch((e) => {
  console.error(e instanceof EngineError ? `content engine: ${e.message}` : e)
  process.exit(1)
})
