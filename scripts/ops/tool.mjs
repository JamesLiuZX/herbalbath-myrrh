#!/usr/bin/env node
// One Autopilot tool call from the command line. The operator session
// (ops/OPERATOR.md) is Claude itself, so it needs no API loop; what it does
// need is for every post, brief, lead, email and deck to pass through the same
// rules the agents' tools enforce in code. This is that door.
//
//   node scripts/ops/tool.mjs --list
//   node scripts/ops/tool.mjs add_post '{"publishAt":"2026-12-01 08:30", ...}'
//   node scripts/ops/tool.mjs upsert_lead --input-file lead.json
//
// Public tools write files in this repository. Private ones (leads, emails,
// plans) write to OPS_PRIVATE_DIR, a directory outside this public repository.

import { readFileSync } from "node:fs"
import { Changes } from "./lib/changes.mjs"
import { loadConfig } from "./lib/config.mjs"
import { ROOT, sgToday } from "./lib/paths.mjs"
import { PlainStore } from "./lib/plain-store.mjs"
import { validate } from "./lib/schema.mjs"
import { b2bTools } from "./tools/b2b.mjs"
import { cmoTools, researchTools } from "./tools/cmo.mjs"
import { commonTools } from "./tools/common.mjs"
import { creativeTools } from "./tools/creative.mjs"
import { deckTools } from "./tools/deck.mjs"
import { socialTools } from "./tools/social.mjs"

export function operatorContext({ store = new PlainStore(), root = ROOT, config = loadConfig(), agent = "operator" } = {}) {
  const changes = new Changes({ vault: store, root })
  return { agent, config, changes, today: sgToday(), gpu: false, run: { reports: [], attachments: [], emailsForApproval: [], stats: {} } }
}

export function operatorTools(ctx) {
  const all = [commonTools, socialTools, creativeTools, b2bTools, deckTools, cmoTools, researchTools].flatMap((make) => make(ctx))
  return [...new Map(all.map((t) => [t.name, t])).values()]
}

/** Validates the input against the tool's schema, runs it, and returns its result. Throws with the tool's own refusal message. */
export async function runTool(name, input, options = {}) {
  const ctx = options.ctx ?? operatorContext(options)
  const tool = operatorTools(ctx).find((t) => t.name === name)
  if (!tool) throw new Error(`There is no tool called "${name}". Run with --list to see them.`)
  const problems = validate(input, tool.input_schema)
  if (problems.length) throw new Error(`${name}: ${problems.join("; ")}`)
  const result = await tool.run(input)
  return { result, run: ctx.run }
}

async function main(argv) {
  if (!argv.length || argv[0] === "--help") {
    console.log("Usage: node scripts/ops/tool.mjs --list | <tool> '<json>' | <tool> --input-file <path> [--agent <name>]")
    return 0
  }
  if (argv[0] === "--list") {
    for (const t of operatorTools(operatorContext())) console.log(`${t.name}\n    ${t.description.split("\n")[0]}`)
    return 0
  }
  const [name, ...rest] = argv
  const flag = (f) => (rest.includes(f) ? rest[rest.indexOf(f) + 1] : undefined)
  const file = flag("--input-file")
  const raw = file ? readFileSync(file, "utf8") : rest.find((a) => !a.startsWith("--")) ?? "{}"
  let input
  try {
    input = JSON.parse(raw)
  } catch (error) {
    console.error(`The input isn't valid JSON: ${error.message}`)
    return 2
  }
  try {
    const { result, run } = await runTool(name, input, { agent: flag("--agent") ?? "operator" })
    console.log(typeof result === "string" ? result : JSON.stringify(result, null, 2))
    if (run.attachments.length) console.log(`\nFiles made: ${run.attachments.map((a) => a.path ?? a.file ?? a).join(", ")}`)
    if (run.emailsForApproval.length) console.log(`\n${run.emailsForApproval.length} email(s) waiting for approval.`)
    return 0
  } catch (error) {
    console.error(`Refused: ${error.message}`)
    return 1
  }
}

if (import.meta.url === `file://${process.argv[1]}`) process.exitCode = await main(process.argv.slice(2))
