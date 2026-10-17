// Run with `pnpm test` (Node's built-in runner; Node 22.18+ strips the TS types).
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  STATIC_PAYNOW_PAYLOAD,
  buildPayNowPayload,
  crc16,
  formatAmount,
  newOrderReference,
  parseTlv,
  payloadHasValidCrc,
  sanitizeReference,
} from "./paynow.ts"

const field = (fields, id) => fields.find((f) => f.id === id)

test("the issued static QR carries a valid CRC", () => {
  assert.equal(crc16(STATIC_PAYNOW_PAYLOAD.slice(0, -4)), "C2BF")
  assert.ok(payloadHasValidCrc(STATIC_PAYNOW_PAYLOAD))
})

test("with no order the builder reproduces Aspire's QR byte for byte", () => {
  assert.equal(buildPayNowPayload(), STATIC_PAYNOW_PAYLOAD)
})

test("an order becomes a one-off QR with a locked amount and a reference", () => {
  const payload = buildPayNowPayload({ amount: 117, reference: "HB1018K7Q2" })
  assert.ok(payloadHasValidCrc(payload))
  const fields = parseTlv(payload)

  assert.equal(field(fields, "01").value, "12")
  assert.equal(field(fields, "54").value, "117.00")
  assert.equal(field(field(fields, "62").children, "01").value, "HB1018K7Q2")

  // The merchant account must match the issued QR except for "editable".
  const issued = field(parseTlv(STATIC_PAYNOW_PAYLOAD), "26").children
  const ours = field(fields, "26").children
  for (const id of ["00", "01", "02"]) {
    assert.equal(field(ours, id).value, field(issued, id).value, `merchant field ${id}`)
  }
  assert.equal(field(issued, "03").value, "1")
  assert.equal(field(ours, "03").value, "0")

  for (const id of ["52", "53", "58", "59", "60", "61"]) {
    assert.equal(field(fields, id).value, field(parseTlv(STATIC_PAYNOW_PAYLOAD), id).value, `field ${id}`)
  }
})

test("amounts are formatted to cents and bounded", () => {
  assert.equal(formatAmount(39), "39.00")
  assert.equal(formatAmount(29.25), "29.25")
  assert.throws(() => formatAmount(0))
  assert.throws(() => formatAmount(-5))
  assert.throws(() => formatAmount(Number.NaN))
  assert.throws(() => formatAmount(1_000_000))
})

test("references keep only upper-case letters and digits, max 25", () => {
  assert.equal(sanitizeReference("hb-1018 k7q2"), "HB1018K7Q2")
  assert.equal(sanitizeReference("x".repeat(40)).length, 25)
  assert.throws(() => buildPayNowPayload({ amount: 39, reference: "---" }))
})

test("order references are HB + Singapore date + 4 unambiguous characters", () => {
  // 17 Oct 2026 23:30 UTC is already 18 Oct in Singapore.
  const ref = newOrderReference(new Date("2026-10-17T23:30:00Z"))
  assert.match(ref, /^HB1018[ABCDEFGHJKMNPQRTUVWXY2346789]{4}$/)
})
