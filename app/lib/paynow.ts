// PayNow (SGQR / EMVCo merchant-presented mode) payloads for HerbalBath.
//
// Every merchant field below was decoded from the static QR that Aspire issued
// to HERBALBATH PTE. LTD. (public/images/paynow-qr.png) and checked against
// that QR's own CRC. Nothing here is guessed: Aspire only receives PayNow
// through the proxy printed in that QR (a VPA ending in #XNAP), never through
// the bare UEN, so the proxy is copied byte for byte and paynow.test.mjs pins
// buildPayNowPayload() with no order to the issued payload.
//
// Per order we add the two things the static QR can't carry: an amount the
// payer can't edit, and a reference that lands on the Aspire statement, so a
// payment can be matched to its WhatsApp order instead of guessed from the
// amount alone.
//
// Deliberately free of imports (no "@/" alias, no React) so Node's built-in
// test runner can load it directly.

export const PAYNOW_MERCHANT = {
  /** "3" is the proxy type Aspire's QR uses for its VPA. */
  proxyType: "3",
  proxyValue: "UEN202115082RA00#XNAP",
  merchantCategoryCode: "7298",
  /** ISO 4217 numeric for SGD. */
  currency: "702",
  country: "SG",
  name: "HERBALBATH PTE. LTD.",
  city: "SINGAPORE",
  postalCode: "409051",
} as const

/** The exact payload encoded in Aspire's static QR, CRC included. */
export const STATIC_PAYNOW_PAYLOAD =
  "00020101021126480009SG.PAYNOW010130221UEN202115082RA00#XNAP030115204729853037025802SG" +
  "5920HERBALBATH PTE. LTD.6009SINGAPORE61064090516304C2BF"

export const MAX_REFERENCE_LENGTH = 25
const MAX_AMOUNT = 999999.99

function tlv(id: string, value: string): string {
  if (value.length > 99) throw new Error(`PayNow field ${id} is longer than 99 characters`)
  return `${id}${String(value.length).padStart(2, "0")}${value}`
}

/** CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF), as SGQR specifies. */
export function crc16(data: string): string {
  let crc = 0xffff
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0")
}

export function formatAmount(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    throw new Error(`PayNow amount must be between 0.01 and ${MAX_AMOUNT}, got ${amount}`)
  }
  return amount.toFixed(2)
}

/**
 * Bank apps copy the reference onto the transfer, so keep it to the subset
 * every app accepts: upper-case letters and digits.
 */
export function sanitizeReference(reference: string): string {
  return reference
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, MAX_REFERENCE_LENGTH)
}

export interface PayNowOrder {
  amount: number
  reference: string
}

/**
 * With no order this rebuilds the static QR exactly. With an order it becomes
 * a one-off QR: point of initiation "12", amount locked, reference attached.
 */
export function buildPayNowPayload(order?: PayNowOrder): string {
  const m = PAYNOW_MERCHANT
  const merchantAccount =
    tlv("00", "SG.PAYNOW") + tlv("01", m.proxyType) + tlv("02", m.proxyValue) + tlv("03", order ? "0" : "1")

  const fields = [
    tlv("00", "01"),
    tlv("01", order ? "12" : "11"),
    tlv("26", merchantAccount),
    tlv("52", m.merchantCategoryCode),
    tlv("53", m.currency),
    ...(order ? [tlv("54", formatAmount(order.amount))] : []),
    tlv("58", m.country),
    tlv("59", m.name),
    tlv("60", m.city),
    tlv("61", m.postalCode),
  ]

  if (order) {
    const reference = sanitizeReference(order.reference)
    if (!reference) throw new Error("PayNow reference is empty after sanitising")
    fields.push(tlv("62", tlv("01", reference)))
  }

  const body = fields.join("") + "6304"
  return body + crc16(body)
}

export interface TlvField {
  id: string
  value: string
  children?: TlvField[]
}

/** Splits a payload back into fields; used by tests and the internal check page. */
export function parseTlv(payload: string, nested = ["26", "62"]): TlvField[] {
  const out: TlvField[] = []
  let i = 0
  while (i < payload.length) {
    const id = payload.slice(i, i + 2)
    const length = Number(payload.slice(i + 2, i + 4))
    if (!/^\d{2}$/.test(id) || !Number.isInteger(length)) throw new Error(`Malformed TLV at offset ${i}`)
    const value = payload.slice(i + 4, i + 4 + length)
    if (value.length !== length) throw new Error(`Truncated TLV field ${id}`)
    out.push(nested.includes(id) ? { id, value, children: parseTlv(value, []) } : { id, value })
    i += 4 + length
  }
  return out
}

export function payloadHasValidCrc(payload: string): boolean {
  return payload.length > 8 && crc16(payload.slice(0, -4)) === payload.slice(-4)
}

/** The same unambiguous alphabet as captain codes (no 0/O, 1/I/L, 5/S). */
const REFERENCE_ALPHABET = "ABCDEFGHJKMNPQRTUVWXY2346789"

/**
 * HB + MMDD in Singapore time + 4 random characters, e.g. HB1018K7Q2. The date
 * lets a human find the day's orders at a glance; four characters keep a
 * collision under ~1% a month at the current 15–20 orders a day.
 */
export function newOrderReference(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-SG", {
    timeZone: "Asia/Singapore",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)
  const mm = parts.find((p) => p.type === "month")?.value ?? "00"
  const dd = parts.find((p) => p.type === "day")?.value ?? "00"

  const bytes = new Uint8Array(4)
  globalThis.crypto.getRandomValues(bytes)
  const suffix = Array.from(bytes, (b) => REFERENCE_ALPHABET[b % REFERENCE_ALPHABET.length]).join("")
  return `HB${mm}${dd}${suffix}`
}
