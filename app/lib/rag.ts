// Minimal retrieval-augmented content pipeline for HerbalBath SG.
//
// This is deliberately simple (no vector DB, no embeddings, no external API):
// the "knowledge base" is the content we already have — pain-points-data.ts
// (16 deeply-researched Singapore-context pain topics) and blog-data.tsx
// (existing published articles). We retrieve the most relevant facts for a
// requested topic via keyword overlap, then hand that context to a template
// compositor to produce a structured draft.
//
// If a real LLM API key is ever configured (e.g. OPENAI_API_KEY), swap
// `composeDraftFromContext` below for a call that sends the retrieved
// context as grounding and asks the model to write the prose — the
// retrieval step doesn't need to change.

import { painPointsData, type PainPoint } from "./pain-points-data"
import { posts, type Post } from "./blog-data"

export interface ContentGap {
  /** The exact slug other pages already link to but that doesn't exist yet. */
  slug: string
  titleZh: string
  titleEn: string
  /** Pain-point slug(s) to retrieve grounding context from. */
  groundedIn: string[]
}

// Slugs that pain-points-data.ts already references via `relatedBlogSlugs`
// but that don't exist in blog-data.tsx yet — i.e. real, pre-existing content
// gaps, not invented ones.
const KNOWN_CONTENT_GAPS: ContentGap[] = [
  {
    slug: "gout-diet-singapore",
    titleZh: "痛风饮食新加坡指南",
    titleEn: "Gout Diet Guide for Singapore",
    groundedIn: ["gout-pain"],
  },
  {
    slug: "back-pain-prevention",
    titleZh: "腰背痛预防指南",
    titleEn: "Back Pain Prevention Guide",
    groundedIn: ["back-pain", "sciatica"],
  },
  {
    slug: "post-surgery-rehabilitation-tips",
    titleZh: "术后康复指南",
    titleEn: "Post-Surgery Rehabilitation Tips",
    groundedIn: ["post-surgery-recovery"],
  },
  {
    slug: "home-safety-seniors",
    titleZh: "居家安全指南",
    titleEn: "Home Safety Guide for Seniors",
    groundedIn: ["post-surgery-recovery", "numbness-tingling"],
  },
]

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fff]+/)
    .filter((t) => t.length > 1)
}

/** Retrieval step: find which existing pages are most relevant to a topic. */
export function retrieveContext(groundedInSlugs: string[]): {
  painPoints: PainPoint[]
  relatedPosts: Post[]
} {
  const painPoints = groundedInSlugs
    .map((slug) => painPointsData.find((p) => p.slug === slug))
    .filter((p): p is PainPoint => Boolean(p))

  const keywordSet = new Set(painPoints.flatMap((p) => p.keywords.flatMap(tokenize)))

  const relatedPosts = posts
    .map((post) => {
      const postTokens = new Set(tokenize(post.title + " " + post.description))
      let overlap = 0
      for (const k of keywordSet) if (postTokens.has(k)) overlap++
      return { post, overlap }
    })
    .filter((r) => r.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3)
    .map((r) => r.post)

  return { painPoints, relatedPosts }
}

/** Which content gaps still need writing, i.e. not yet in blog-data.tsx. */
export function findUnwrittenGaps(): ContentGap[] {
  const existingSlugs = new Set(posts.map((p) => p.slug))
  return KNOWN_CONTENT_GAPS.filter((gap) => !existingSlugs.has(gap.slug))
}

export interface ArticleDraft {
  slug: string
  titleZh: string
  titleEn: string
  keywords: string[]
  sourceSlugs: string[]
  /** Bullet-level facts pulled straight from the grounding pain-point pages. */
  retrievedFactsZh: string[]
  retrievedFactsEn: string[]
  relatedPostSlugs: string[]
}

/**
 * Template-based draft compositor (the "G" in RAG here — deterministic
 * composition, not a live model call). Produces a structured skeleton with
 * retrieved facts attached; a human (or a future LLM pass) turns this into
 * final prose. Kept intentionally simple per project constraints.
 */
export function composeDraftFromContext(gap: ContentGap): ArticleDraft {
  const { painPoints, relatedPosts } = retrieveContext(gap.groundedIn)

  const extractBullets = (content: string) =>
    content
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("-") || l.startsWith("**"))
      .slice(0, 6)

  const retrievedFactsZh = painPoints.flatMap((p) => extractBullets(p.contentZh))
  const retrievedFactsEn = painPoints.flatMap((p) => extractBullets(p.contentEn))
  const keywords = Array.from(new Set(painPoints.flatMap((p) => p.keywords))).slice(0, 15)

  return {
    slug: gap.slug,
    titleZh: gap.titleZh,
    titleEn: gap.titleEn,
    keywords,
    sourceSlugs: gap.groundedIn,
    retrievedFactsZh,
    retrievedFactsEn,
    relatedPostSlugs: relatedPosts.map((p) => p.slug),
  }
}

export function generateArticleDrafts(limit = 4): ArticleDraft[] {
  return findUnwrittenGaps()
    .slice(0, limit)
    .map((gap) => composeDraftFromContext(gap))
}
