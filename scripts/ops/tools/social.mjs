// Facebook: the social agent keeps marketing/facebook/posts.json at least two
// weeks ahead. The Facebook executor schedules whatever is due on the Page.

import { existsSync } from "node:fs"
import path from "node:path"
import { claimProblems, legacyTitles, loadArticles, loadCalendar, loadRules } from "../../content/lib.mjs"
import { addDays, ROOT, sgTime } from "../lib/paths.mjs"
import { obj, str } from "./common.mjs"
import { postsCsv } from "../../facebook/posts-lib.mjs"

export { postsCsv }

export const POSTS = "marketing/facebook/posts.json"
export const POSTS_CSV = "marketing/facebook/posts.csv"
const PILLARS = ["article", "tip", "community", "festival", "protection", "product", "service"]
const SLOTS = { 1: "08:30", 3: "20:00", 6: "09:00" } // Mon, Wed, Sat

const summary = (p) => ({
  id: p.id,
  publishAt: p.publishAt,
  lang: p.lang,
  pillar: p.pillar,
  text: p.text.length > 120 ? `${p.text.slice(0, 120)}…` : p.text,
  link: p.link ?? null,
  image: p.image ?? null,
  needsImage: !p.image && !p.link && !!p.imagePrompt,
})

export function articleIndex() {
  const live = [...loadArticles().filter(({ article }) => !article.draft).map(({ article }) => ({ slug: article.slug, title: article.title, date: article.date, status: "live" })), ...legacyTitles().map((t) => ({ ...t, status: "live" }))]
  const liveSlugs = new Set(live.map((a) => a.slug))
  const planned = loadCalendar()
    .entries.filter((e) => !liveSlugs.has(e.slug) && e.status !== "published")
    .map((e) => ({ slug: e.slug, keyword: e.keyword, publishOn: e.publishOn, lang: e.lang, status: "planned" }))
  return { live, planned }
}

export function socialTools(ctx) {
  const rules = loadRules()
  const posts = () => ctx.changes.readJson(POSTS, { posts: [] }).posts

  return [
    {
      name: "list_posts",
      description:
        "Facebook posts from 3 days ago to `days` ahead (default 21), plus the open slots in the usual rhythm (Mon 08:30, Wed 20:00, Sat 09:00) and how many product posts there are.",
      input_schema: obj({ days: { type: "integer", description: "How far ahead to look" } }, []),
      run: ({ days = 21 }) => {
        const all = posts()
        const from = addDays(ctx.today.date, -3)
        const to = addDays(ctx.today.date, days)
        const window = all.filter((p) => p.publishAt.slice(0, 10) >= from && p.publishAt.slice(0, 10) <= to)
        const taken = new Set(all.map((p) => p.publishAt))
        const open = []
        for (let i = 1; i <= days; i++) {
          const date = addDays(ctx.today.date, i)
          const slot = SLOTS[new Date(`${date}T12:00:00Z`).getUTCDay()]
          if (slot && !taken.has(`${date} ${slot}`)) open.push(`${date} ${slot}`)
        }
        return {
          posts: window.map(summary),
          openSlots: open,
          totals: { all: all.length, product: all.filter((p) => p.pillar === "product").length, maxProductShare: ctx.config.limits.productPostShare },
        }
      },
    },
    {
      name: "list_articles",
      description: "Blog articles that are live, and planned ones with their publish dates, so posts link only to pages that will exist.",
      input_schema: obj({}, []),
      run: () => articleIndex(),
    },
    {
      name: "add_post",
      description:
        "Add a Facebook post to marketing/facebook/posts.json. Checked before it's saved: date in the future, slot free, claims rules, product share, links to real articles. Posts with a link show the article's preview card; for others give an imagePrompt and the creative agent will make the picture.",
      input_schema: obj(
        {
          publishAt: str('Singapore time, "YYYY-MM-DD HH:mm"'),
          lang: { type: "string", enum: ["zh", "en"] },
          pillar: { type: "string", enum: PILLARS },
          text: str("The post. Plain text, short paragraphs, emoji sparingly, no **bold** (Facebook doesn't render it)."),
          link: str("Optional https link: one of our articles (https://herbalbathsg.com/blog/<slug>), /pay, or an official source"),
          imagePrompt: str("Optional, for posts without a link: what the picture should show, for Kino"),
          sources: { type: "array", items: { type: "string" }, description: "Optional source ids from content/sources.json for facts in the post" },
        },
        ["publishAt", "lang", "pillar", "text"],
      ),
      run: (input) => {
        const problems = []
        if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(input.publishAt)) problems.push('publishAt must look like "2026-11-02 08:30"')
        else {
          const at = sgTime(input.publishAt).getTime()
          if (at < Date.now() + 2 * 3600_000) problems.push("publishAt must be at least 2 hours from now")
          if (at > Date.now() + 60 * 86_400_000) problems.push("publishAt can be at most 60 days ahead")
        }
        const all = posts()
        if (all.some((p) => p.publishAt === input.publishAt)) problems.push(`${input.publishAt} already has a post; pick another slot`)
        const text = input.text.trim()
        if (text.length < 20 || text.length > 1500) problems.push("text should be 20 to 1,500 characters")
        if (text.includes("**")) problems.push("no **bold**: Facebook shows the asterisks")
        problems.push(...claimProblems([text, input.imagePrompt ?? ""].filter(Boolean), input.lang, rules))
        if (input.pillar === "product") {
          const approved = [...rules.product.approvedClaims.zh, ...rules.product.approvedClaims.en].map((c) => c.toLowerCase())
          if (!approved.some((c) => text.toLowerCase().includes(c))) problems.push("product posts must use at least one approved claim word for word")
          const products = all.filter((p) => p.pillar === "product").length + 1
          if (products > (all.length + 1) * ctx.config.limits.productPostShare) problems.push("too many product posts already; write a useful one instead")
        }
        if (input.link) {
          if (!/^https:\/\//.test(input.link)) problems.push("link must be https")
          const m = input.link.match(/^https:\/\/herbalbathsg\.com\/blog\/([^/?#]+)/)
          if (m) {
            const { live, planned } = articleIndex()
            const known = [...live, ...planned].find((a) => a.slug === m[1])
            if (!known) problems.push(`/blog/${m[1]} isn't live or planned`)
            else if (known.status === "planned" && known.publishOn > input.publishAt.slice(0, 10)) problems.push(`/blog/${m[1]} is planned for ${known.publishOn}, after this post`)
          }
        }
        if (!input.link && !input.imagePrompt) problems.push("give a link or an imagePrompt: text-only posts get little reach")
        if (problems.length) throw new Error(`Not added:\n- ${problems.join("\n- ")}`)

        const slug = (text.match(/[a-z0-9]+/gi) ?? ["post"]).slice(0, 3).join("-").toLowerCase().slice(0, 24) || "post"
        const base = `${input.publishAt.slice(0, 10)}-${input.pillar}-${slug}`.replace(/-+$/, "")
        let id = base
        for (let n = 2; all.some((p) => p.id === id); n++) id = `${base}-${n}`
        const post = {
          id,
          publishAt: input.publishAt,
          lang: input.lang,
          pillar: input.pillar,
          text,
          ...(input.link ? { link: input.link } : {}),
          ...(input.imagePrompt ? { imagePrompt: input.imagePrompt.trim() } : {}),
          ...(input.sources?.length ? { sources: input.sources } : {}),
          by: "autopilot",
        }
        ctx.changes.json(POSTS, { posts: [] }, (doc) => {
          if (doc.posts.some((p) => p.id === id || p.publishAt === post.publishAt)) return doc
          doc.posts.push(post)
          doc.posts.sort((a, b) => a.publishAt.localeCompare(b.publishAt))
          return doc
        })
        ctx.changes.text(POSTS_CSV, () => postsCsv(ctx.changes.readJson(POSTS, { posts: [] }).posts))
        ctx.run.stats.postsAdded = (ctx.run.stats.postsAdded ?? 0) + 1
        return { added: id }
      },
    },
  ]
}

/** Images referenced by posts must exist in public/ before the scheduler uses them. */
export const imageExists = (image) => !!image && existsSync(path.join(ROOT, "public", image))
