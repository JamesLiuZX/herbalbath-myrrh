#!/usr/bin/env node
// Schedules the pre-written posts in marketing/facebook/posts.json on the
// HerbalBath Facebook Page through the Graph API.
//   node scripts/facebook/schedule-posts.mjs --dry-run   list what would be scheduled; no API calls
//   node scripts/facebook/schedule-posts.mjs             schedule everything due in the next 28 days
//   node scripts/facebook/schedule-posts.mjs --csv       write marketing/facebook/posts.csv (for spreadsheets or copy-paste)
//
// Needs FB_PAGE_ID and FB_PAGE_TOKEN, a Page access token with
// pages_manage_posts and pages_read_engagement (marketing/facebook/README.md
// shows how to get one). Keep them in .env.local and run with
// `node --env-file=.env.local scripts/facebook/schedule-posts.mjs`.
//
// Safe to re-run: posts whose time has passed, and times that already have a
// scheduled post on the Page, are skipped. A post that links to one of our
// articles waits until that article is live. Meta only accepts times between
// 10 minutes and 30 days ahead, hence the 28-day window: run it every few weeks.

import { writeFileSync, readFileSync } from "node:fs"
import path from "node:path"
import { ROOT, claimProblems, loadRules } from "../content/lib.mjs"
import { SITE, absolute, postsCsv, tagged } from "./posts-lib.mjs"

const POSTS = path.join(ROOT, "marketing/facebook/posts.json")
const GRAPH = `https://graph.facebook.com/${process.env.FB_GRAPH_VERSION || "v26.0"}`
const WINDOW_DAYS = 28
const MIN_LEAD_MINUTES = 15

const args = new Set(process.argv.slice(2))
const dryRun = args.has("--dry-run")

/** "2026-10-18 08:00" in Singapore time, as a Date. */
const when = (publishAt) => new Date(`${publishAt.replace(" ", "T")}:00+08:00`)

function writeCsv(posts) {
  const file = path.join(ROOT, "marketing/facebook/posts.csv")
  writeFileSync(file, postsCsv(posts))
  console.log(`Wrote ${path.relative(ROOT, file)} (${posts.length} posts).`)
}

async function graph(method, edge, params) {
  const body = new URLSearchParams({ ...params, access_token: process.env.FB_PAGE_TOKEN })
  const url = `${GRAPH}/${edge}`
  const res = method === "GET" ? await fetch(`${url}?${body}`) : await fetch(url, { method, body })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.error) throw new Error(json.error?.message ?? `HTTP ${res.status}`)
  return json
}

/** Unix times of everything already scheduled on the Page. */
async function scheduledTimes(pageId) {
  const times = new Set()
  let after
  do {
    const page = await graph("GET", `${pageId}/scheduled_posts`, { fields: "scheduled_publish_time", limit: "100", ...(after ? { after } : {}) })
    for (const p of page.data ?? []) {
      const t = p.scheduled_publish_time
      times.add(typeof t === "number" ? t : Math.floor(Date.parse(t) / 1000))
    }
    after = page.paging?.next ? page.paging.cursors?.after : undefined
  } while (after)
  return times
}

/** null when the link is fine to post, otherwise why not. */
async function linkProblem(link) {
  if (!link?.startsWith(SITE)) return null
  try {
    const res = await fetch(link, { method: "HEAD", redirect: "follow" })
    return res.ok ? null : `${link} isn't live yet (HTTP ${res.status})`
  } catch (e) {
    return `couldn't reach ${link} (${e.cause?.code ?? e.message})`
  }
}

async function main() {
  const { posts } = JSON.parse(readFileSync(POSTS, "utf8"))
  if (args.has("--csv")) return writeCsv(posts)

  const rules = loadRules()
  const now = Date.now()
  const due = posts.filter((p) => {
    const t = when(p.publishAt).getTime()
    return t >= now + MIN_LEAD_MINUTES * 60_000 && t <= now + WINDOW_DAYS * 86_400_000
  })
  console.log(`${due.length} of ${posts.length} posts fall in the next ${WINDOW_DAYS} days.`)
  if (!due.length) return

  const pageId = process.env.FB_PAGE_ID
  if (!dryRun && (!pageId || !process.env.FB_PAGE_TOKEN)) {
    throw new Error("Set FB_PAGE_ID and FB_PAGE_TOKEN (see marketing/facebook/README.md), or use --dry-run.")
  }
  const taken = dryRun ? new Set() : await scheduledTimes(pageId)

  let failed = 0
  for (const p of due) {
    const at = Math.floor(when(p.publishAt).getTime() / 1000)
    const label = `${p.publishAt}  ${p.id}`
    const problems = claimProblems([p.text], p.lang, rules)
    if (problems.length) {
      console.log(`✗ ${label}: fails the claims rules (${problems.join("; ")})`)
      failed++
      continue
    }
    if (taken.has(at)) {
      console.log(`· ${label}: already scheduled`)
      continue
    }
    // Pictures made by the creative agent are served from the site, so they must be deployed first.
    const notReady = (await linkProblem(p.link)) ?? (p.image ? await linkProblem(absolute(p.image)) : null)
    if (notReady) {
      console.log(`… ${label}: waiting, ${notReady}`)
      continue
    }
    if (dryRun) {
      console.log(`✓ ${label}: would schedule (${p.image ? "photo" : p.link ? "link" : "text"})`)
      continue
    }
    try {
      const params = { message: p.text, published: "false", scheduled_publish_time: String(at) }
      if (p.image) {
        // A scheduled post's photo is uploaded unpublished and temporary, then attached.
        const photo = await graph("POST", `${pageId}/photos`, { url: absolute(p.image), published: "false", temporary: "true" })
        params.attached_media = JSON.stringify([{ media_fbid: photo.id }])
      } else if (p.link) {
        params.link = tagged(p.link, p.id)
      }
      const post = await graph("POST", `${pageId}/feed`, params)
      console.log(`✓ ${label}: scheduled (${post.id})`)
    } catch (e) {
      console.log(`✗ ${label}: ${e.message}`)
      failed++
    }
  }
  if (failed) process.exitCode = 1
}

main().catch((e) => {
  console.error(`schedule-posts: ${e.message}`)
  process.exit(1)
})
