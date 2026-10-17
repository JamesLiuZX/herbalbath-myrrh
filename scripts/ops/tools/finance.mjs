// Bookkeeping. James sends bank (Aspire) and Shopee exports to the Telegram bot;
// the inbox stores them in the vault. The finance agent reads them, records
// categorised transactions in a ledger, and reports the month: sales by
// channel, costs, cash, and the GST registration threshold. All arithmetic is
// done here, in code, not by the model.

import { writeFileSync, mkdirSync } from "node:fs"
import path from "node:path"
import { SCRATCH, addDays } from "../lib/paths.mjs"
import { capped } from "../lib/vault.mjs"
import { obj, str } from "./common.mjs"

export const FINANCE_FALLBACK = { uploads: [], ledger: [] }
export const CATEGORIES = [
  "sales-paynow",
  "sales-shopee",
  "sales-trade",
  "sales-other",
  "refunds",
  "stock",
  "packaging",
  "delivery",
  "platform-fees",
  "advertising",
  "software",
  "media-gpu",
  "professional-fees",
  "owner-transfer",
  "tax",
  "other",
]
const SALES = new Set(["sales-paynow", "sales-shopee", "sales-trade", "sales-other"])
const NON_OPERATING = new Set(["owner-transfer", "tax"])
// Singapore: GST registration is compulsory once taxable turnover passes S$1m in a calendar year,
// or is expected to in the next 12 months. We watch the trailing 12 months.
export const GST_THRESHOLD = 1_000_000

/** A small CSV parser: quotes, escaped quotes, commas and newlines inside quotes. */
export function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ""
  let quoted = false
  const src = text.replace(/^﻿/, "")
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        cell += '"'
        i++
      } else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"') quoted = true
    else if (c === ",") {
      row.push(cell)
      cell = ""
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++
      row.push(cell)
      if (row.some((x) => x !== "")) rows.push(row)
      row = []
      cell = ""
    } else cell += c
  }
  row.push(cell)
  if (row.some((x) => x !== "")) rows.push(row)
  return rows
}

export function ledgerTotals(ledger, from, to) {
  const rows = ledger.filter((t) => t.date >= from && t.date <= to)
  const byCategory = {}
  for (const t of rows) byCategory[t.category] = Math.round(((byCategory[t.category] ?? 0) + t.amount) * 100) / 100
  const sales = rows.filter((t) => SALES.has(t.category)).reduce((s, t) => s + t.amount, 0)
  const refunds = rows.filter((t) => t.category === "refunds").reduce((s, t) => s + t.amount, 0)
  const costs = rows.filter((t) => t.amount < 0 && !SALES.has(t.category) && t.category !== "refunds" && !NON_OPERATING.has(t.category)).reduce((s, t) => s + t.amount, 0)
  const r = (n) => Math.round(n * 100) / 100
  return { from, to, transactions: rows.length, sales: r(sales), refunds: r(refunds), operatingCosts: r(costs), operatingProfit: r(sales + refunds + costs), byCategory }
}

export function financeTools(ctx) {
  const data = () => ctx.changes.readVault("finance", FINANCE_FALLBACK)
  return [
    {
      name: "list_uploads",
      description: "Bank and Shopee exports James has sent to the bot, and whether each has been recorded in the ledger yet.",
      input_schema: obj({}, []),
      run: () => data().uploads.map(({ name, at, rows, processed, kind }) => ({ name, at, kind, rows, processed: !!processed })),
    },
    {
      name: "read_upload",
      description: "Rows of an uploaded CSV export (first row is usually the header). Page through big files with offset.",
      input_schema: obj({ name: str("Upload name"), offset: { type: "integer" }, limit: { type: "integer" } }, ["name"]),
      run: ({ name, offset = 0, limit = 120 }) => {
        const upload = data().uploads.find((u) => u.name === name)
        if (!upload) throw new Error(`No upload called ${name}.`)
        if (upload.kind !== "csv") throw new Error("Only CSV exports can be read; ask James to export CSV.")
        const rows = parseCsv(upload.text)
        return { total: rows.length, header: rows[0], rows: rows.slice(Math.max(1, offset), Math.max(1, offset) + Math.min(limit, 200)) }
      },
    },
    {
      name: "record_transactions",
      description: `Record transactions from an upload in the ledger. amount is SGD, positive for money in and negative for money out. category is one of: ${CATEGORIES.join(", ")}. Duplicates (same date, amount and reference) are skipped, so re-recording a file is safe.`,
      input_schema: obj({
        upload: str("The upload these came from"),
        transactions: {
          type: "array",
          items: obj(
            {
              date: str("YYYY-MM-DD"),
              amount: { type: "number" },
              category: { type: "string", enum: CATEGORIES },
              counterparty: str("Who paid or was paid"),
              memo: str("Description from the statement"),
              ref: str("Bank or order reference, if any"),
            },
            ["date", "amount", "category"],
          ),
        },
      }),
      run: ({ upload, transactions }) => {
        const bad = transactions.filter((t) => !/^\d{4}-\d{2}-\d{2}$/.test(t.date))
        if (bad.length) throw new Error(`${bad.length} transactions have dates that aren't YYYY-MM-DD.`)
        let added = 0
        ctx.changes.private("finance", FINANCE_FALLBACK, (v) => {
          const seen = new Set(v.ledger.map((t) => `${t.date}|${t.amount}|${t.ref ?? t.memo ?? ""}`))
          for (const t of transactions) {
            const key = `${t.date}|${t.amount}|${t.ref ?? t.memo ?? ""}`
            if (seen.has(key)) continue
            seen.add(key)
            v.ledger.push({ ...t, amount: Math.round(t.amount * 100) / 100, source: upload })
            added++
          }
          v.ledger.sort((a, b) => a.date.localeCompare(b.date))
        })
        ctx.run.stats.transactions = (ctx.run.stats.transactions ?? 0) + added
        return { added, skippedAsDuplicates: transactions.length - added }
      },
    },
    {
      name: "mark_processed",
      description: "Mark an upload as fully recorded.",
      input_schema: obj({ name: str("Upload name") }),
      run: ({ name }) => {
        ctx.changes.private("finance", FINANCE_FALLBACK, (v) => {
          const u = v.uploads.find((x) => x.name === name)
          if (u) u.processed = new Date().toISOString()
        })
        return "Marked."
      },
    },
    {
      name: "ledger_summary",
      description: "Totals for a period, computed in code: sales, refunds, operating costs, operating profit, by category. Also the trailing-12-month sales against the S$1m GST registration threshold.",
      input_schema: obj({ from: str("YYYY-MM-DD"), to: str("YYYY-MM-DD") }),
      run: ({ from, to }) => {
        const { ledger } = data()
        const trailing = ledgerTotals(ledger, addDays(ctx.today.date, -365), ctx.today.date)
        return { period: ledgerTotals(ledger, from, to), trailing12MonthSales: trailing.sales, gstThreshold: GST_THRESHOLD, gstHeadroom: Math.round((GST_THRESHOLD - trailing.sales) * 100) / 100 }
      },
    },
    {
      name: "export_ledger",
      description: "Export the ledger for a period as a CSV and attach it to your report.",
      input_schema: obj({ from: str("YYYY-MM-DD"), to: str("YYYY-MM-DD") }),
      run: ({ from, to }) => {
        const rows = data().ledger.filter((t) => t.date >= from && t.date <= to)
        const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`
        const csv = [["date", "amount_sgd", "category", "counterparty", "memo", "ref", "source"], ...rows.map((t) => [t.date, t.amount, t.category, t.counterparty, t.memo, t.ref, t.source])]
          .map((r) => r.map(cell).join(","))
          .join("\r\n")
        const dir = path.join(SCRATCH, "out")
        mkdirSync(dir, { recursive: true })
        const file = path.join(dir, `herbalbath-ledger-${from}-to-${to}.csv`)
        writeFileSync(file, `﻿${csv}\r\n`)
        ctx.run.attachments.push({ file, caption: `Ledger ${from} to ${to}` })
        return { rows: rows.length, attached: path.basename(file) }
      },
    },
  ]
}

/** Used by the inbox when a file arrives. */
export function storeUpload(changes, { name, buffer, mime }) {
  const csv = /\.csv$/i.test(name) || /csv|text\/plain/.test(mime ?? "")
  const entry = { name, at: new Date().toISOString(), kind: csv ? "csv" : "binary", processed: null }
  if (csv) {
    entry.text = buffer.toString("utf8")
    entry.rows = parseCsv(entry.text).length
  } else entry.base64 = buffer.toString("base64")
  changes.private("finance", FINANCE_FALLBACK, (v) => {
    v.uploads = capped([...v.uploads.filter((u) => u.name !== name), entry], 60)
  })
  return entry
}
