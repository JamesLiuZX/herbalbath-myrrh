// Tools every agent has: read the knowledge base and repo docs, check copy
// against the claims rules, remember a lesson for future runs, and report to
// James on Telegram.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { claimProblems, loadRules } from "../../content/lib.mjs"
import { ROOT } from "../lib/paths.mjs"
import { capped } from "../lib/vault.mjs"

// What agents may read. Private data is only reachable through the vault tools.
const READABLE = [
  "ops/knowledge",
  "ops/agents",
  "ops/autonomy.json",
  "ops/creative",
  "content",
  "marketing/facebook",
  "app/lib/growth-config.ts",
  "app/lib/outreach-targets.ts",
  "STRATEGY.md",
  "GROWTH.md",
  "SEO.md",
  "REMINDERS.md",
]

function readable(rel) {
  const clean = path.normalize(String(rel)).replace(/^\.?\/+/, "")
  if (clean.startsWith("..") || path.isAbsolute(clean)) throw new Error("That path is outside the repository.")
  if (!READABLE.some((r) => clean === r || clean.startsWith(`${r}/`))) {
    throw new Error(`Not readable. Allowed: ${READABLE.join(", ")}.`)
  }
  return path.join(ROOT, clean)
}

export const str = (description) => ({ type: "string", description })
export const obj = (properties, required = Object.keys(properties)) => ({ type: "object", additionalProperties: false, properties, required })

export function commonTools(ctx) {
  const rules = loadRules()
  return [
    {
      name: "read_file",
      description: `Read a file from the repository: the knowledge base (ops/knowledge), playbooks, Facebook posts, blog content, growth config, the outreach target list and the strategy docs. Allowed roots: ${READABLE.join(", ")}.`,
      input_schema: obj({ path: str("Repository-relative path, e.g. ops/knowledge/product.md") }),
      run: ({ path: rel }) => {
        const file = readable(rel)
        if (!existsSync(file) || statSync(file).isDirectory()) throw new Error(`${rel} isn't a file. Use list_files.`)
        const text = readFileSync(file, "utf8")
        return text.length > 60_000 ? `${text.slice(0, 60_000)}\n\n[truncated: ${text.length} characters in total]` : text
      },
    },
    {
      name: "list_files",
      description: "List the files in a readable directory.",
      input_schema: obj({ dir: str("Repository-relative directory, e.g. content/blog") }),
      run: ({ dir }) => {
        const full = readable(dir)
        if (!existsSync(full) || !statSync(full).isDirectory()) throw new Error(`${dir} isn't a directory.`)
        return readdirSync(full).slice(0, 300)
      },
    },
    {
      name: "check_claims",
      description:
        "Check public copy (posts, captions, emails, scripts) against HerbalBath's claims rules: banned phrases anywhere, and effect words in any sentence that names the product. Returns the problems; an empty list means it passes. Run it on anything you write before using it.",
      input_schema: obj({ text: str("The copy to check"), lang: { type: "string", enum: ["zh", "en"], description: "Main language of the copy" } }),
      run: ({ text, lang }) => {
        const problems = claimProblems([text], lang, rules)
        return problems.length ? { passes: false, problems } : { passes: true, problems: [] }
      },
    },
    {
      name: "remember",
      description:
        "Save a lesson for future runs of the whole team: what worked, what didn't, a fact James confirmed, a preference he stated. Short and specific. These notes are private and are shown to every agent at the start of each run.",
      input_schema: obj({ note: str("One or two sentences") }),
      run: ({ note }) => {
        ctx.changes.private("insights", { notes: [] }, (v) => {
          v.notes = capped([...(v.notes ?? []), { at: ctx.today.date, agent: ctx.agent, note: note.slice(0, 600) }], 200)
        })
        return "Saved."
      },
    },
    {
      name: "report",
      description:
        "Send James a report on Telegram (private chat): what you did, what you found, what you need from him. Markdown: **bold**, lists, links. Keep it scannable on a phone. Call it once at the end of a run, or when something needs his decision.",
      input_schema: obj({ title: str("Short title"), markdown: str("The report body") }),
      run: ({ title, markdown }) => {
        ctx.run.reports.push({ title: title.slice(0, 120), markdown: markdown.slice(0, 12_000) })
        return "Queued: it's sent when this run finishes."
      },
    },
  ]
}
