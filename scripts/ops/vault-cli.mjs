#!/usr/bin/env node
// Your window into Autopilot's private data, on your own machine.
//   node scripts/ops/vault-cli.mjs keygen                  make a new OPS_DATA_KEY
//   node --env-file=.env.local scripts/ops/vault-cli.mjs list
//   node --env-file=.env.local scripts/ops/vault-cli.mjs show <collection>
// Collections: leads, outbox, activity, insights, plan, research, finance, state, reports.

import { randomBytes } from "node:crypto"
import { existsSync, readdirSync } from "node:fs"
import { Vault, VAULT_DIR } from "./lib/vault.mjs"

const [cmd, name] = process.argv.slice(2)

if (cmd === "keygen") {
  console.log(randomBytes(32).toString("base64"))
  console.log("\nPut this in .env.local as OPS_DATA_KEY=... and in GitHub: Settings → Secrets and variables → Actions → OPS_DATA_KEY. Keep a copy somewhere safe: without it the private data can't be read.")
} else if (cmd === "list") {
  const files = existsSync(VAULT_DIR) ? readdirSync(VAULT_DIR).filter((f) => f.endsWith(".json.enc")) : []
  console.log(files.map((f) => f.replace(".json.enc", "")).join("\n") || "The vault is empty.")
} else if (cmd === "show" && name) {
  const vault = new Vault()
  if (!vault.available) {
    console.error("Set OPS_DATA_KEY (run with --env-file=.env.local).")
    process.exit(1)
  }
  console.log(JSON.stringify(vault.read(name, {}), null, 2))
} else {
  console.log("Usage: vault-cli.mjs keygen | list | show <collection>")
}
