// Shared by the Facebook scheduler, the social agent and the media executor,
// so posts.csv is written the same way whoever touches posts.json.

export const SITE = "https://herbalbathsg.com"

/** Our own links get UTM tags so GA4 can tell which post brought the visit. */
export function tagged(link, id) {
  if (!link?.startsWith(SITE)) return link
  const url = new URL(link)
  url.searchParams.set("utm_source", "facebook")
  url.searchParams.set("utm_medium", "social")
  url.searchParams.set("utm_campaign", id)
  return url.toString()
}

export const absolute = (image) => (image?.startsWith("/") ? `${SITE}${image}` : image)

export function postsCsv(posts) {
  const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`
  const rows = [["date", "time (SGT)", "language", "pillar", "text", "link", "image", "image prompt (Kino)"]]
  for (const p of posts) {
    const [date, time] = p.publishAt.split(" ")
    rows.push([date, time, p.lang, p.pillar, p.text, tagged(p.link, p.id), absolute(p.image), p.imagePrompt])
  }
  // A byte-order mark so Excel opens the Chinese text as UTF-8.
  return `﻿${rows.map((r) => r.map(cell).join(",")).join("\r\n")}\r\n`
}
