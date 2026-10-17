// What Autopilot may do on its own: ops/autonomy.json, plus pauses set from
// Telegram (/pause) and the AUTOPILOT_PAUSED repository variable, which stops
// everything at once.

import { readFileSync } from "node:fs"
import path from "node:path"
import { OPS } from "./paths.mjs"

export const AGENTS = ["cmo", "research", "social", "creative", "b2b", "finance"]

export function loadConfig() {
  return JSON.parse(readFileSync(path.join(OPS, "autonomy.json"), "utf8"))
}

/** The vault's state collection: pauses and counters set at run time. */
export const STATE_FALLBACK = { paused: { all: false, agents: {} }, counters: {} }

export function pauseReason({ config, state, agent, env = process.env }) {
  if (env.AUTOPILOT_PAUSED === "true") return "the AUTOPILOT_PAUSED repository variable is true"
  if (config.paused) return "ops/autonomy.json has paused: true"
  if (state?.paused?.all) return "paused from Telegram (/resume all to restart)"
  if (agent && state?.paused?.agents?.[agent]) return `the ${agent} agent is paused from Telegram (/resume ${agent})`
  if (agent && config.agents?.[agent]?.mode === "off") return `ops/autonomy.json has ${agent}.mode: off`
  return null
}

/** auto: public changes go straight to main. review: they go to a pull request. */
export const agentMode = (config, agent) => (config.agents?.[agent]?.mode === "review" ? "review" : "auto")
