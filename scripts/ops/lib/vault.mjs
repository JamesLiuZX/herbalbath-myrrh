// Private data in a public repository. Each collection (leads, outbox,
// ledger, plans, notes) is one AES-256-GCM encrypted file in ops/private/,
// readable only with OPS_DATA_KEY: a GitHub secret on the server, and your
// .env.local on your own machine (scripts/ops/vault-cli.mjs reads it).
// Nothing in here ever goes into a log, a commit message or a pull request.

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { OPS } from "./paths.mjs"

export const VAULT_DIR = path.join(OPS, "private")
const NAME = /^[a-z][a-z0-9-]{0,40}$/

export class VaultError extends Error {}

function keyFrom(secret) {
  const trimmed = secret.trim()
  // A random 32-byte key in base64 (what the README tells you to make) is used
  // as is; any other passphrase is stretched with scrypt.
  const raw = Buffer.from(trimmed, "base64")
  if (raw.length === 32 && raw.toString("base64") === trimmed) return raw
  return scryptSync(trimmed, "herbalbath-autopilot-vault", 32)
}

export class Vault {
  constructor({ key = process.env.OPS_DATA_KEY, dir = VAULT_DIR } = {}) {
    this.dir = dir
    this.key = key ? keyFrom(key) : null
  }

  get available() {
    return !!this.key
  }

  /** Repo-relative path of a collection's file. */
  rel(name) {
    if (!NAME.test(name)) throw new VaultError(`"${name}" isn't a valid vault collection name.`)
    return path.join("ops", "private", `${name}.json.enc`)
  }

  file(name) {
    return path.join(this.dir, path.basename(this.rel(name)))
  }

  exists(name) {
    return existsSync(this.file(name))
  }

  read(name, fallback = {}) {
    const file = this.file(name)
    if (!existsSync(file)) return structuredClone(fallback)
    if (!this.key) throw new VaultError("OPS_DATA_KEY isn't set, so private data can't be read.")
    const { iv, tag, data } = JSON.parse(readFileSync(file, "utf8"))
    const decipher = createDecipheriv("aes-256-gcm", this.key, Buffer.from(iv, "base64"))
    decipher.setAAD(Buffer.from(name))
    decipher.setAuthTag(Buffer.from(tag, "base64"))
    try {
      const json = Buffer.concat([decipher.update(Buffer.from(data, "base64")), decipher.final()]).toString("utf8")
      return JSON.parse(json)
    } catch {
      throw new VaultError(`ops/private/${name} can't be decrypted with this OPS_DATA_KEY.`)
    }
  }

  write(name, value) {
    if (!this.key) throw new VaultError("OPS_DATA_KEY isn't set, so private data can't be written.")
    mkdirSync(this.dir, { recursive: true })
    const iv = randomBytes(12)
    const cipher = createCipheriv("aes-256-gcm", this.key, iv)
    cipher.setAAD(Buffer.from(name))
    const data = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()])
    const sealed = { v: 1, iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: data.toString("base64") }
    writeFileSync(this.file(name), `${JSON.stringify(sealed)}\n`)
  }

  /** Read, change, write. `fn` may mutate its argument or return a new value. */
  update(name, fallback, fn) {
    const current = this.read(name, fallback)
    const next = fn(current) ?? current
    this.write(name, next)
    return next
  }
}

/** Keeps a list from growing forever: the newest `max` entries survive. */
export const capped = (list, max) => (list.length > max ? list.slice(list.length - max) : list)
