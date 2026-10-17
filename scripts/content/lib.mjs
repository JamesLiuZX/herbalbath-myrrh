// Shared by the article writer, the content check and the tests: loading the
// content files and deciding whether an article is fit to publish.

import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"

export const ROOT = path.resolve(new URL("../..", import.meta.url).pathname)
export const CONTENT = path.join(ROOT, "content")
export const BLOG_DIR = path.join(CONTENT, "blog")

const readJson = (file) => JSON.parse(readFileSync(file, "utf8"))
export const loadRules = () => readJson(path.join(CONTENT, "rules.json"))
export const loadSources = () => readJson(path.join(CONTENT, "sources.json")).sources
export const loadCalendar = () => readJson(path.join(CONTENT, "calendar.json"))

export function loadArticles() {
  if (!existsSync(BLOG_DIR)) return []
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ file: path.join(BLOG_DIR, f), article: readJson(path.join(BLOG_DIR, f)) }))
}

/** Slugs of the hand-written posts in app/lib/blog-data.tsx (read as text: it's TSX). */
export function legacySlugs() {
  const src = readFileSync(path.join(ROOT, "app/lib/blog-data.tsx"), "utf8")
  return [...src.matchAll(/^\s{4}slug:\s*"([^"]+)"/gm)].map((m) => m[1])
}

export function legacyTitles() {
  const src = readFileSync(path.join(ROOT, "app/lib/blog-data.tsx"), "utf8")
  const slugs = [...src.matchAll(/^\s{4}slug:\s*"([^"]+)",\s*\n\s{4}title:\s*"([^"]+)"/gm)]
  return slugs.map((m) => ({ slug: m[1], title: m[2] }))
}

const BLOCK_TYPES = new Set(["p", "h2", "h3", "ul", "ol", "tip", "product", "table"])
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const CJK = /[㐀-鿿]/g

/** Every string a reader sees, in order. */
export function articleTexts(a) {
  const out = [a.title, a.description]
  for (const b of a.body ?? []) {
    if (b.title) out.push(b.title)
    if (b.text) out.push(b.text)
    for (const i of b.items ?? []) out.push(i)
    for (const h of b.head ?? []) out.push(h)
    for (const r of b.rows ?? []) out.push(...r)
  }
  for (const f of a.faq ?? []) out.push(f.q, f.a)
  return out.filter(Boolean)
}

const plain = (s) => String(s).replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")

export function measure(a) {
  const text = articleTexts(a).slice(2).map(plain).join(" ")
  return a.lang === "zh" ? (text.match(CJK) ?? []).length : text.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length
}

function sentences(text) {
  return plain(text)
    .split(/(?<=[。！？!?；;])|(?<=\.)\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

const containsWord = (text, word, en) => (en ? new RegExp(`(^|[^a-z])${word.replace(/[.*+?^${}()|[\]\\#]/g, "\\$&")}([^a-z]|$)`, "i").test(text) : text.includes(word))

/**
 * Banned phrases anywhere, and effect words in any sentence that names the
 * product. Shared by articles and social posts (marketing/facebook).
 */
export function claimProblems(texts, lang, rules = loadRules()) {
  const en = lang === "en"
  const errors = []
  const approved = rules.product.approvedClaims[lang].map((c) => c.toLowerCase())
  for (const text of texts) {
    const lower = plain(text).toLowerCase()
    for (const w of rules.banned[lang]) if (containsWord(lower, w.toLowerCase(), en)) errors.push(`banned phrase “${w}” in: ${text.slice(0, 60)}…`)
    // In English text a Chinese ban list still applies to Chinese quotes, and vice versa.
    for (const w of rules.banned[en ? "zh" : "en"]) if (containsWord(lower, w.toLowerCase(), !en)) errors.push(`banned phrase “${w}” in: ${text.slice(0, 60)}…`)
  }
  for (const text of texts) {
    for (const s of sentences(text)) {
      const lower = s.toLowerCase()
      const mentionsProduct = rules.productWords[lang].some((w) => lower.includes(w.toLowerCase()))
      if (!mentionsProduct) continue
      const scrubbed = approved.reduce((acc, c) => acc.split(c).join(" "), lower)
      for (const w of rules.effectWords[lang]) {
        if (containsWord(scrubbed, w.toLowerCase(), en)) errors.push(`“${w}” next to the product makes an effect claim: ${s.slice(0, 70)}`)
      }
    }
  }
  return [...new Set(errors)]
}

/**
 * Returns { errors, warnings } as plain sentences. Errors block publishing;
 * warnings are for the reviewer.
 */
export function validateArticle(a, { rules = loadRules(), sources = loadSources(), knownSlugs = [] } = {}) {
  const errors = []
  const warnings = []
  const en = a.lang === "en"
  const lang = en ? "en" : "zh"

  // Shape.
  if (!SLUG.test(a.slug ?? "")) errors.push(`slug "${a.slug}" must be lowercase words joined by dashes`)
  if (!["zh", "en"].includes(a.lang)) errors.push(`lang must be "zh" or "en"`)
  if (!DATE.test(a.date ?? "")) errors.push(`date must be YYYY-MM-DD`)
  for (const k of ["title", "description", "author", "cluster"]) if (!a[k] || typeof a[k] !== "string") errors.push(`${k} is missing`)
  if (!Array.isArray(a.body) || a.body.length < 4) errors.push("body needs at least four blocks")
  for (const [i, b] of (a.body ?? []).entries()) {
    if (!BLOCK_TYPES.has(b.type)) errors.push(`body[${i}] has an unknown type "${b.type}"`)
    else if (["ul", "ol"].includes(b.type) && !(b.items?.length > 0)) errors.push(`body[${i}] (${b.type}) has no items`)
    else if (b.type === "table" && !(b.head?.length && b.rows?.length)) errors.push(`body[${i}] (table) needs head and rows`)
    else if (!["ul", "ol", "table"].includes(b.type) && !b.text) errors.push(`body[${i}] (${b.type}) has no text`)
  }

  // Search snippet sizes.
  const titleMax = rules.length.titleMax[lang]
  const titleLen = [...(a.title ?? "")].length
  if (titleLen > titleMax) warnings.push(`title is ${titleLen} characters; search results show about ${titleMax}`)
  const [dMin, dMax] = rules.length.descriptionRange[lang]
  const dLen = [...(a.description ?? "")].length
  if (dLen < dMin || dLen > dMax) warnings.push(`description is ${dLen} characters; aim for ${dMin}-${dMax}`)

  // Substance.
  const size = measure(a)
  if (en && size < rules.length.enMinWords) errors.push(`only ${size} words; at least ${rules.length.enMinWords} needed`)
  if (!en && size < rules.length.zhMinChars) errors.push(`only ${size} Chinese characters; at least ${rules.length.zhMinChars} needed`)

  // Sources: https, and preferably from the checked library.
  const known = new Set(sources.map((s) => s.url))
  for (const s of a.sources ?? []) {
    if (!/^https:\/\//.test(s.url ?? "")) errors.push(`source "${s.title}" needs an https URL`)
    else if (!known.has(s.url)) warnings.push(`source ${s.url} isn't in content/sources.json; check it by hand`)
  }
  const health = rules.healthClusters.includes(a.cluster)
  const minSources = health ? rules.minSources.health : rules.minSources.other
  if ((a.sources ?? []).length < minSources) errors.push(`health topics need at least ${minSources} sources`)

  // Links between pages.
  const slugs = new Set(knownSlugs)
  for (const text of articleTexts(a)) {
    for (const m of text.matchAll(/\]\((\/blog\/([^)#?]+))[^)]*\)/g)) if (!slugs.has(m[2])) errors.push(`link to ${m[1]} goes nowhere`)
    if ((text.match(/\*\*/g) ?? []).length % 2) warnings.push(`unbalanced ** in: ${text.slice(0, 40)}…`)
  }
  for (const r of a.related ?? []) if (!slugs.has(r)) errors.push(`related article "${r}" doesn't exist`)

  // Compliance.
  errors.push(...claimProblems(articleTexts(a), lang, rules))
  const approved = rules.product.approvedClaims[lang].map((c) => c.toLowerCase())
  for (const [i, b] of (a.body ?? []).entries()) {
    if (b.type !== "product") continue
    const lower = (b.text ?? "").toLowerCase()
    if (!approved.some((c) => lower.includes(c))) errors.push(`body[${i}] (product) should use at least one approved claim word for word`)
  }
  if ((a.body ?? []).filter((b) => b.type === "product").length > 1) warnings.push("more than one product block; one is plenty")

  return { errors: [...new Set(errors)], warnings: [...new Set(warnings)] }
}
