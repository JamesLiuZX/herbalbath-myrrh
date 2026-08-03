"use server"

import { Redis } from "@upstash/redis"

// Trade enquiries from clinics, medical halls and multi-outlet chains.
// Kept separate from consumer referral data because these are a different
// sales motion entirely: a handful of high-value leads that each deserve a
// follow-up, not an aggregate counter.

const isRedisConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
)

const redis = isRedisConfigured ? Redis.fromEnv() : null

export type TradeOutletType =
  | "tcm-clinic"
  | "medical-hall"
  | "tuina-reflexology"
  | "physio-chiro"
  | "eldercare"
  | "other"

export interface TradeLead {
  businessName: string
  contactName: string
  phone: string
  outletType: TradeOutletType
  outletCount: string
  notes: string
  createdAt: string
}

export interface SubmitTradeLeadResult {
  ok: boolean
  persisted: boolean
  error?: string
}

export async function submitTradeLead(
  lead: Omit<TradeLead, "createdAt">,
): Promise<SubmitTradeLeadResult> {
  if (lead.businessName.trim().length < 2) {
    return { ok: false, persisted: false, error: "请输入店名 / Please enter your business name" }
  }
  const phoneDigits = lead.phone.replace(/\D/g, "")
  if (phoneDigits.length < 8) {
    return { ok: false, persisted: false, error: "请输入联络电话 / Please enter a contact number" }
  }

  const record: TradeLead = { ...lead, createdAt: new Date().toISOString() }

  if (!redis) {
    // Without a store the enquiry would be silently lost, and a trade lead is
    // worth far too much for that. Log it loudly so it's at least recoverable
    // from Vercel's function logs until Redis is connected.
    console.warn("[TradeLead] NO REDIS — capture manually:", JSON.stringify(record))
    return { ok: true, persisted: false }
  }

  try {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    await Promise.all([
      redis.hset(`trade:lead:${id}`, record as unknown as Record<string, unknown>),
      redis.zadd("trade:leads", { score: Date.now(), member: id }),
    ])
    return { ok: true, persisted: true }
  } catch (error) {
    console.error("[TradeLead] Redis write failed:", error)
    console.warn("[TradeLead] Capture manually:", JSON.stringify(record))
    return { ok: true, persisted: false }
  }
}

/** Newest-first, for whatever you use to work the pipeline. */
export async function listTradeLeads(limit = 50): Promise<TradeLead[]> {
  if (!redis) return []
  try {
    const ids = await redis.zrange<string[]>("trade:leads", 0, limit - 1, { rev: true })
    if (!ids.length) return []
    const leads = await Promise.all(
      ids.map((id) => redis.hgetall<Record<string, string>>(`trade:lead:${id}`)),
    )
    return leads.filter(Boolean) as unknown as TradeLead[]
  } catch (error) {
    console.error("[TradeLead] Redis read failed:", error)
    return []
  }
}
