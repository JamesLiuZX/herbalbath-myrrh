// Articles stored as data in content/blog/*.json: written by the content engine
// (scripts/content/write-article.mjs) or by hand, checked by
// scripts/content/check.mjs, rendered by components/blog/article-body.tsx.
// Data rather than JSX, so a scheduled job can add one without touching code.

import fs from "node:fs"
import path from "node:path"

export type ArticleBlock =
  | { type: "p" | "h2" | "h3"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "tip"; title?: string; text: string }
  | { type: "product"; text: string }
  | { type: "table"; head: string[]; rows: string[][] }

export interface Article {
  slug: string
  lang: "zh" | "en"
  title: string
  description: string
  date: string
  updated?: string
  author: string
  cluster: string
  keywords: string[]
  image: string | null
  imageAlt?: string
  body: ArticleBlock[]
  faq?: { q: string; a: string }[]
  sources?: { title: string; url: string }[]
  related?: string[]
  /** Set by the content engine when its checks failed; never rendered. */
  draft?: boolean
}

const DIR = path.join(process.cwd(), "content", "blog")

let cache: Article[] | null = null

export function getArticles(): Article[] {
  if (cache) return cache
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith(".json")) : []
  cache = files
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as Article)
    .filter((a) => !a.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
  return cache
}

export function getArticle(slug: string): Article | null {
  return getArticles().find((a) => a.slug === slug) ?? null
}

/** About 400 Chinese characters or 220 English words a minute. */
export function readingMinutes(a: Article): number {
  const text = a.body
    .flatMap((b) => ("items" in b ? b.items : "rows" in b ? b.rows.flat() : [b.text]))
    .join(" ")
  const amount = a.lang === "zh" ? (text.match(/[㐀-鿿]/g) ?? []).length / 400 : text.split(/\s+/).length / 220
  return Math.max(2, Math.round(amount))
}
