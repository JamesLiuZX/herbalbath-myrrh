// Orders placed on /pay. No imports, so Node tests can load this file.
//
// The business used to learn about an order only when a WhatsApp message
// arrived. This keeps that flow exactly as it was, and adds two things: the
// customer can fill in name, phone and address before the tap (so nobody has
// to ask in chat), and the order itself is recorded with what was bought and
// which campaign was running.
//
// What is stored is deliberately small. The address and the gift note travel
// only inside the customer's own WhatsApp message. Name and phone are stored
// only when the customer ticks the reorder-reminder box.

export type Lang = "zh" | "en"

export interface OrderLine {
  reference: string
  packageLabel: string
  qty: number
  amountText: string
  campaignId?: string | null
}

export interface OrderDetails {
  name?: string
  phone?: string
  address?: string
  giftNote?: string
}

export interface RecordOrderInput {
  reference: string
  packageId: string
  qty: number
  lang: Lang
  consent?: boolean
  name?: string
  phone?: string
  captainCode?: string | null
}

export interface OrderRecord {
  reference: string
  /** The customer said they paid. Nothing here confirms the money arrived. */
  status: "self_reported"
  packageId: string
  bottles: number
  qty: number
  amount: number
  campaignId: string
  captainCode: string
  lang: Lang
  consent: boolean
  createdAt: string
}

export const MAX_QTY = 10
/** HB + MMDD + 4 characters from paynow.ts's alphabet, e.g. HB1018K7Q2. */
export const REFERENCE = /^HB(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[ABCDEFGHJKMNPQRTUVWXY2346789]{4}$/

const clean = (value: unknown, max: number) =>
  typeof value === "string"
    ? value
        .replace(/[\u0000-\u001f\u007f]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, max)
    : ""

export function cleanDetails(raw: OrderDetails | null | undefined): Required<OrderDetails> {
  return {
    name: clean(raw?.name, 60),
    phone: clean(raw?.phone, 20),
    address: clean(raw?.address, 200),
    giftNote: clean(raw?.giftNote, 200),
  }
}

/** 8-digit Singapore mobile (8 or 9 first), with or without 65, as "65XXXXXXXX"; otherwise null. */
export function sgMobile(raw: string | null | undefined): string | null {
  const digits = (raw ?? "").replace(/\D/g, "")
  const full = digits.length === 8 ? `65${digits}` : digits
  return /^65[89]\d{7}$/.test(full) ? full : null
}

/** The WhatsApp message after paying. With no details and no campaign it is exactly the message the page has always sent. */
export function buildPaidMessage(lang: Lang, order: OrderLine, details?: OrderDetails): string {
  const d = cleanDetails(details)
  const lines =
    lang === "zh"
      ? [
          `你好！我刚用 PayNow 付款了 ${order.amountText}`,
          `套餐：${order.packageLabel} × ${order.qty}`,
          `参考号：${order.reference}`,
          "",
          `姓名：${d.name}`,
          `送货地址：${d.address}`,
          `联系电话：${d.phone}`,
        ]
      : [
          `Hi! I've just paid ${order.amountText} by PayNow`,
          `Package: ${order.packageLabel} × ${order.qty}`,
          `Reference: ${order.reference}`,
          "",
          `Name:${d.name ? ` ${d.name}` : ""}`,
          `Delivery address:${d.address ? ` ${d.address}` : ""}`,
          `Phone:${d.phone ? ` ${d.phone}` : ""}`,
        ]
  if (d.giftNote) lines.push(lang === "zh" ? `贺卡留言：${d.giftNote}` : `Card message: ${d.giftNote}`)
  if (order.campaignId) lines.push(lang === "zh" ? `活动：${order.campaignId}` : `Campaign: ${order.campaignId}`)
  return lines.join("\n")
}

/** The cash-on-delivery WhatsApp message. */
export function buildCodMessage(lang: Lang, order: Omit<OrderLine, "reference">, details?: OrderDetails): string {
  const d = cleanDetails(details)
  const lines =
    lang === "zh"
      ? [
          "你好！我想订购 HerbalBath 没药草本能量油，货到付款",
          `套餐：${order.packageLabel} × ${order.qty}（${order.amountText}）`,
          "",
          `姓名：${d.name}`,
          `送货地址：${d.address}`,
          `联系电话：${d.phone}`,
        ]
      : [
          "Hi! I'd like to order the HerbalBath Myrrh Herbal Energy Oil, cash on delivery",
          `Package: ${order.packageLabel} × ${order.qty} (${order.amountText})`,
          "",
          `Name:${d.name ? ` ${d.name}` : ""}`,
          `Delivery address:${d.address ? ` ${d.address}` : ""}`,
          `Phone:${d.phone ? ` ${d.phone}` : ""}`,
        ]
  if (d.giftNote) lines.push(lang === "zh" ? `贺卡留言：${d.giftNote}` : `Card message: ${d.giftNote}`)
  return lines.join("\n")
}

type Checked = { ok: true; order: OrderRecord; contact: { name: string; phone: string } | null } | { ok: false; error: string }

/**
 * Turns what the browser sent into a record worth keeping. The amount is
 * worked out here from the price list, never taken from the browser.
 */
export function normaliseOrder(
  raw: RecordOrderInput,
  packages: { id: string; bottles: number; price: number }[],
  campaignId: string | null,
  now: Date = new Date(),
): Checked {
  if (!raw || typeof raw !== "object") return { ok: false, error: "no order" }
  if (typeof raw.reference !== "string" || !REFERENCE.test(raw.reference)) return { ok: false, error: "bad reference" }
  const pkg = packages.find((p) => p.id === raw.packageId)
  if (!pkg) return { ok: false, error: "unknown package" }
  if (!Number.isInteger(raw.qty) || raw.qty < 1 || raw.qty > MAX_QTY) return { ok: false, error: "bad quantity" }
  const phone = sgMobile(raw.phone)
  // Consent only counts when there is a number to remind.
  const consent = raw.consent === true && !!phone
  const code = typeof raw.captainCode === "string" ? raw.captainCode.trim().toUpperCase() : ""
  return {
    ok: true,
    order: {
      reference: raw.reference,
      status: "self_reported",
      packageId: pkg.id,
      bottles: pkg.bottles,
      qty: raw.qty,
      amount: Math.round(pkg.price * raw.qty * 100) / 100,
      campaignId: campaignId ?? "",
      captainCode: /^[A-Z0-9]{4,8}$/.test(code) ? code : "",
      lang: raw.lang === "en" ? "en" : "zh",
      consent,
      createdAt: now.toISOString(),
    },
    contact: consent && phone ? { name: clean(raw.name, 60), phone } : null,
  }
}

/** True only for "Bearer <secret>" with a secret that is actually set. Compared without an early exit. */
export function bearerOk(header: string | null | undefined, secret: string | null | undefined): boolean {
  if (!secret || !header) return false
  const expected = `Bearer ${secret}`
  let diff = header.length ^ expected.length
  for (let i = 0; i < expected.length; i++) diff |= (header.charCodeAt(i) || 0) ^ expected.charCodeAt(i)
  return diff === 0
}
