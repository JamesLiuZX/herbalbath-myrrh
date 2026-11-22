// The operator's private store: the same interface as the Vault (vault.mjs),
// but plain JSON files in a directory OUTSIDE this public repository. The
// scheduled Claude session keeps it in the private command repository
// (herbalbath/), so leads and email drafts stay private without a vault key,
// and James can read them on GitHub. Set OPS_PRIVATE_DIR to that directory.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { ROOT } from "./paths.mjs"

const NAME = /^[a-z][a-z0-9-]{0,40}$/

export class StoreError extends Error {}

export class PlainStore {
  constructor({ dir = process.env.OPS_PRIVATE_DIR, root = ROOT } = {}) {
    this.dir = dir ? path.resolve(dir) : null
    if (this.dir) {
      const inside = path.relative(root, this.dir)
      // Private data must never land in the public repository by accident.
      if (!inside.startsWith("..") && !path.isAbsolute(inside)) {
        throw new StoreError("OPS_PRIVATE_DIR points inside this public repository. Point it at the private repository instead.")
      }
    }
  }

  get available() {
    return !!this.dir
  }

  #need() {
    if (!this.dir) throw new StoreError("OPS_PRIVATE_DIR isn't set, so private data (leads, emails) can't be read or written.")
  }

  /** A label for logs and journals; the file itself is outside this repo. */
  rel(name) {
    if (!NAME.test(name)) throw new StoreError(`"${name}" isn't a valid collection name.`)
    return path.join("private", `${name}.json`)
  }

  file(name) {
    this.#need()
    return path.join(this.dir, path.basename(this.rel(name)))
  }

  exists(name) {
    return !!this.dir && existsSync(this.file(name))
  }

  read(name, fallback = {}) {
    if (!this.exists(name)) return structuredClone(fallback)
    return JSON.parse(readFileSync(this.file(name), "utf8"))
  }

  write(name, value) {
    this.#need()
    mkdirSync(this.dir, { recursive: true })
    writeFileSync(this.file(name), `${JSON.stringify(value, null, 2)}\n`)
  }

  update(name, fallback, fn) {
    const current = this.read(name, fallback)
    const next = fn(current) ?? current
    this.write(name, next)
    return next
  }
}
