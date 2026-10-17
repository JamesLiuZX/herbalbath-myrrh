// One list of every blog post, newest first: the hand-written posts in
// blog-data.tsx and the data articles in content/blog. Used by the blog index,
// related articles and the sitemap, so a new article shows up everywhere.

import fs from "node:fs"
import path from "node:path"
import { posts } from "./blog-data"
import { getArticles } from "./articles"

/**
 * A cover only if the file is really in public/. Eight hand-written posts
 * point at images that were never added, and four at v0 placeholder URLs;
 * those get the lettered cover instead of a broken image or social card.
 */
export function existingImage(src: string | null | undefined): string | null {
  if (!src || !src.startsWith("/") || src.includes("?") || src.startsWith("/placeholder")) return null
  return fs.existsSync(path.join(process.cwd(), "public", src)) ? src : null
}

export interface PostSummary {
  slug: string
  title: string
  description: string
  image: string | null
  author: string
  date: string
  lang: "zh" | "en"
  kind: "legacy" | "article"
}

export function allPosts(): PostSummary[] {
  const legacy: PostSummary[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    image: existingImage(p.image),
    author: p.author,
    date: p.date,
    lang: "zh",
    kind: "legacy",
  }))
  const articles: PostSummary[] = getArticles().map((a) => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    image: existingImage(a.image),
    author: a.author,
    date: a.date,
    lang: a.lang,
    kind: "article",
  }))
  return [...articles, ...legacy].sort((a, b) => b.date.localeCompare(a.date))
}
