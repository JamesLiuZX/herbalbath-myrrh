import path from "node:path"

export const ROOT = path.resolve(new URL("../../..", import.meta.url).pathname)
export const OPS = path.join(ROOT, "ops")
/** Scratch output for a run (decks, CSV exports, summaries). Gitignored. */
export const SCRATCH = path.join(ROOT, ".ops")

/** Today's date in Singapore as YYYY-MM-DD, and the weekday. */
export function sgToday(now = new Date()) {
  const date = now.toLocaleDateString("en-CA", { timeZone: "Asia/Singapore" })
  const weekday = now.toLocaleDateString("en-GB", { timeZone: "Asia/Singapore", weekday: "long" })
  return { date, weekday }
}

/** "2026-10-18 08:00" in Singapore time, as a Date. */
export const sgTime = (stamp) => new Date(`${stamp.replace(" ", "T")}:00+08:00`)

export function addDays(iso, n) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export const daysBetween = (a, b) => Math.round((new Date(`${b}T00:00:00Z`) - new Date(`${a}T00:00:00Z`)) / 86_400_000)
