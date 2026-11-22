// Fails when the operator has not checked in for too long (ops/OPERATOR.md).
// Run by .github/workflows/heartbeat.yml; a failure there emails the owner.
import { readFileSync } from "node:fs"
import path from "node:path"
import { OPS } from "./lib/paths.mjs"

export const MAX_SILENT_DAYS = 9

/** Days since the last recorded run, or Infinity when there is no usable record. */
export function silentDays(heartbeat, now = Date.now()) {
  const last = Date.parse(heartbeat?.lastRun ?? "")
  return Number.isFinite(last) ? (now - last) / 86_400_000 : Infinity
}

export function heartbeatProblem(heartbeat, now = Date.now()) {
  if (heartbeat?.paused) return null
  const days = silentDays(heartbeat, now)
  if (days === Infinity) return "ops/status/heartbeat.json has no lastRun: the operator has never checked in."
  if (days > MAX_SILENT_DAYS) return `The operator last checked in ${Math.floor(days)} days ago (${heartbeat.lastRun}). The limit is ${MAX_SILENT_DAYS}.`
  return null
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let heartbeat = null
  try {
    heartbeat = JSON.parse(readFileSync(path.join(OPS, "status", "heartbeat.json"), "utf8"))
  } catch {
    // Reported below as "never checked in".
  }
  const problem = heartbeatProblem(heartbeat)
  if (problem) {
    console.error(`${problem}\nOpen the "HerbalBath Operator" session in Claude, or the scheduled task list, and see why it stopped.`)
    process.exit(1)
  }
  console.log(`Operator last checked in ${heartbeat.lastRun} (${heartbeat.shift ?? "run"}).`)
}
