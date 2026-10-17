// Every write an Autopilot run makes goes through a Changes journal. Each change
// is applied at once, so the run sees its own work, and is also kept as a
// function. At the end the run moves to the latest main and replays its changes
// on top before pushing. If another run pushed in the meantime (the Telegram
// inbox, the email sender, another agent), nothing is lost on either side.
//
// Scopes: "public" files (Facebook posts, creative briefs, media) can go to a
// pull request when an agent is in review mode; "private" vault collections
// always go straight to main, because an encrypted diff can't be reviewed.

import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { ROOT } from "./paths.mjs"

const BOT = ["-c", "user.name=github-actions[bot]", "-c", "user.email=41898282+github-actions[bot]@users.noreply.github.com"]

const run = (cwd, ...args) => execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export class Changes {
  constructor({ vault, root = ROOT } = {}) {
    this.vault = vault
    this.root = root
    this.ops = []
  }

  abs(rel) {
    const target = path.resolve(this.root, rel)
    const inside = path.relative(this.root, target)
    if (inside.startsWith("..") || path.isAbsolute(inside)) throw new Error(`${rel} is outside the repository.`)
    return target
  }

  readJson(rel, fallback) {
    const file = this.abs(rel)
    return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : structuredClone(fallback)
  }

  readVault(name, fallback = {}) {
    return this.vault.read(name, fallback)
  }

  /** Change a public JSON file. `fn` gets the current value; it may mutate it or return a new one. */
  json(rel, fallback, fn, { scope = "public", indent = 2 } = {}) {
    return this.#record({ kind: "json", rel, fallback, fn, scope, indent })
  }

  /** Write a text file whose content is computed when applied (so a replay recomputes it). */
  text(rel, compute, { scope = "public" } = {}) {
    return this.#record({ kind: "text", rel, compute, scope })
  }

  /** Write bytes (generated images and video). */
  file(rel, data, { scope = "public" } = {}) {
    return this.#record({ kind: "file", rel, data, scope })
  }

  /** Change an encrypted vault collection. Always private. */
  private(name, fallback, fn) {
    return this.#record({ kind: "vault", name, rel: this.vault.rel(name), fallback, fn, scope: "private" })
  }

  #record(op) {
    const result = this.#apply(op)
    this.ops.push(op)
    return result
  }

  #apply(op) {
    if (op.kind === "vault") return this.vault.update(op.name, op.fallback, op.fn)
    const file = this.abs(op.rel)
    mkdirSync(path.dirname(file), { recursive: true })
    if (op.kind === "json") {
      const current = this.readJson(op.rel, op.fallback)
      const next = op.fn(current) ?? current
      writeFileSync(file, `${JSON.stringify(next, null, op.indent)}\n`)
      return next
    }
    if (op.kind === "text") {
      const text = op.compute()
      writeFileSync(file, text)
      return text
    }
    writeFileSync(file, op.data)
    return op.rel
  }

  git(...args) {
    return run(this.root, ...args)
  }

  count(scope) {
    return this.ops.filter((o) => !scope || o.scope === scope).length
  }

  paths(scope) {
    return [...new Set(this.ops.filter((o) => !scope || o.scope === scope).map((o) => o.rel))]
  }

  /**
   * CI only. Moves to the latest origin/main, replays the changes of the given
   * scopes, commits and pushes; on a rejected push it starts over. Returns the
   * new commit sha, or null when there was nothing to commit.
   */
  async commitToMain(message, { scopes = ["private", "public"], attempts = 5 } = {}) {
    const ops = this.ops.filter((o) => scopes.includes(o.scope))
    if (!ops.length) return null
    const rels = [...new Set(ops.map((o) => o.rel))]
    for (let attempt = 1; attempt <= attempts; attempt++) {
      this.git("fetch", "--quiet", "origin", "main")
      this.git("checkout", "--quiet", "--force", "-B", "autopilot-sync", "origin/main")
      for (const op of ops) this.#apply(op)
      this.git("add", "--", ...rels)
      if (!this.git("diff", "--cached", "--name-only")) return null
      this.git(...BOT, "commit", "--quiet", "-m", message)
      try {
        this.git("push", "--quiet", "origin", "HEAD:main")
        return this.git("rev-parse", "HEAD")
      } catch (e) {
        if (attempt === attempts) throw new Error(`Couldn't push to main after ${attempts} tries: ${e.stderr || e.message}`)
        await sleep(2000 * attempt)
      }
    }
    return null
  }

  /** CI only. Puts the public changes on a fresh branch from main and opens a pull request. */
  openPullRequest({ branch, title, body }) {
    const ops = this.ops.filter((o) => o.scope === "public")
    if (!ops.length) return null
    this.git("fetch", "--quiet", "origin", "main")
    this.git("checkout", "--quiet", "--force", "-B", branch, "origin/main")
    for (const op of ops) this.#apply(op)
    this.git("add", "--", ...new Set(ops.map((o) => o.rel)))
    if (!this.git("diff", "--cached", "--name-only")) return null
    this.git(...BOT, "commit", "--quiet", "-m", title)
    this.git("push", "--quiet", "--force", "origin", branch)
    return execFileSync("gh", ["pr", "create", "--base", "main", "--head", branch, "--title", title, "--body", body], {
      cwd: this.root,
      encoding: "utf8",
    }).trim()
  }
}
