// Reorder nudge engine.
//
// The economics this exists to fix: a bottle lasts 3–4 months, so a customer
// can buy at most ~3 times a year. At S$39 that is roughly S$90–110 of annual
// revenue per person, which is far too little to support paid acquisition.
// The only way the business compounds is if the people who already bought
// buy again — and they will not remember to, because the trigger (an empty
// bottle) happens 90 days after the moment they last thought about you.
//
// Cost of running this, at Singapore rates: a utility-category template is
// about S$0.0205 per message. Nudging 15,000 customers costs roughly S$310.
// The same 15,000 messages sent as marketing-category would cost ~S$1,400.
//
// ⚠️ CATEGORY MATTERS. Meta classifies templates, and the classification
// drives both price and policy. A message that follows up on a specific
// prior transaction ("your last order was on X, it should be running low")
// is normally accepted as utility. A message that opens with an offer or a
// discount is marketing — 4.5x the price, and it needs marketing opt-in.
// Write the template as a transaction follow-up FIRST; if you want to
// mention the bundle price, keep it secondary and be prepared for Meta to
// re-categorise. Verify the assigned category in WhatsApp Manager after
// submitting — do not assume.

import { USAGE } from "./growth-config"

/**
 * Sorted set of phone -> nudge-due epoch ms, so the cron can ask Redis for
 * exactly who is due instead of scanning the whole customer base.
 *
 * Lives here rather than beside the customer actions because a "use server"
 * module may only export async functions — a plain const export there is a
 * build error.
 */
export const NUDGE_QUEUE_KEY = "reorder:queue"

export interface CustomerRecord {
  /** Digits only with country code, e.g. 6591234567. */
  phone: string
  name: string
  /** ISO timestamp of their most recent order. */
  lastPurchaseAt: string
  /** Bottles in that order — 4 bottles lasts far longer than 1. */
  bottles: number
  lang: "zh" | "en"
  optedOut: boolean
  nudgesSent: number
}

/**
 * When this customer should next hear from us.
 *
 * Scaled by quantity: someone who bought the 4-bottle bundle will not be
 * empty at day 75, and nudging them then is how you train people to ignore
 * you. One bottle is the baseline; each additional bottle extends the runway.
 */
export function computeNudgeDueAt(lastPurchaseAt: string, bottles: number): Date {
  const base = new Date(lastPurchaseAt)
  const effectiveBottles = Math.max(1, bottles)
  const daysOfSupply = USAGE.reorderNudgeDay * effectiveBottles
  const due = new Date(base)
  due.setDate(due.getDate() + daysOfSupply)
  return due
}

/** Second and final nudge. After this we stop — more reads as spam. */
export function computeFollowUpDueAt(lastPurchaseAt: string, bottles: number): Date {
  const effectiveBottles = Math.max(1, bottles)
  const due = new Date(lastPurchaseAt)
  due.setDate(due.getDate() + USAGE.reorderFollowUpDay * effectiveBottles)
  return due
}

export const MAX_NUDGES_PER_CYCLE = 2

export interface WhatsAppTemplateMessage {
  to: string
  templateName: string
  languageCode: string
  /** Positional body parameters, in template order. */
  bodyParams: string[]
}

export function buildReorderMessage(customer: CustomerRecord): WhatsAppTemplateMessage {
  const daysSince = Math.floor(
    (Date.now() - new Date(customer.lastPurchaseAt).getTime()) / (1000 * 60 * 60 * 24),
  )
  return {
    to: customer.phone,
    // Create this template in WhatsApp Manager. Suggested body, submitted
    // under UTILITY as a follow-up to a prior order:
    //   "{{1}} 您好，您在 {{2}} 天前订购的没药喷雾差不多该用完了。
    //    需要补货可以直接回复这则讯息，我们照旧送到府上。"
    templateName: customer.lang === "zh" ? "reorder_reminder_zh" : "reorder_reminder_en",
    languageCode: customer.lang === "zh" ? "zh_CN" : "en",
    bodyParams: [customer.name || "您好", String(daysSince)],
  }
}

export interface SendResult {
  to: string
  ok: boolean
  dryRun: boolean
  error?: string
}

const GRAPH_VERSION = "v21.0"

/**
 * Sends via the WhatsApp Cloud API directly.
 *
 * Deliberately not using a BSP (Wati, Respond.io, SleekFlow): they add a
 * per-seat platform fee and often a per-message markup on top of Meta's
 * rate, for a dashboard that isn't needed when the sending logic is a cron
 * job. Meta's own API has no licence fee.
 *
 * With no credentials configured this returns dry-run results instead of
 * throwing, so the whole pipeline — selection, scheduling, rescheduling —
 * can be exercised against real data before a single message goes out.
 */
export async function sendWhatsAppTemplate(
  message: WhatsAppTemplateMessage,
): Promise<SendResult> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneNumberId) {
    return { to: message.to, ok: true, dryRun: true }
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: message.to,
          type: "template",
          template: {
            name: message.templateName,
            language: { code: message.languageCode },
            components: [
              {
                type: "body",
                parameters: message.bodyParams.map((text) => ({ type: "text", text })),
              },
            ],
          },
        }),
      },
    )

    if (!response.ok) {
      const body = await response.text()
      return { to: message.to, ok: false, dryRun: false, error: `${response.status}: ${body}` }
    }
    return { to: message.to, ok: true, dryRun: false }
  } catch (error) {
    return {
      to: message.to,
      ok: false,
      dryRun: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
