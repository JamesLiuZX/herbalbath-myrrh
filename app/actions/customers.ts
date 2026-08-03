"use server"

import { Redis } from "@upstash/redis"
import { computeNudgeDueAt, NUDGE_QUEUE_KEY, type CustomerRecord } from "@/app/lib/reorder"

// The customer list is the asset the whole reorder engine runs on. Right now
// those 15,000 buyers exist only as WhatsApp threads and marketplace order
// histories — which means they are not an asset yet, they are a pile of
// records. Getting them in here is the prerequisite for everything else.
//
// Import path for the existing base: export orders from Shopee/Carousell/
// TikTok Shop, plus scrape your own WhatsApp order threads, into a CSV of
// phone,name,lastPurchaseAt,bottles,lang — then call recordPurchase() for
// each row via a one-off script. It does not need to be perfect; an
// approximate lastPurchaseAt still lands the nudge in the right month.

const isRedisConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
)

const redis = isRedisConfigured ? Redis.fromEnv() : null

function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  return digits.length === 8 ? `65${digits}` : digits
}

export interface RecordPurchaseInput {
  phone: string
  name?: string
  bottles?: number
  lang?: "zh" | "en"
  /** Defaults to now. Pass an ISO string when backfilling historical orders. */
  purchasedAt?: string
}

export async function recordPurchase(
  input: RecordPurchaseInput,
): Promise<{ ok: boolean; persisted: boolean; nudgeDueAt?: string; error?: string }> {
  const phone = normalisePhone(input.phone)
  if (!/^65[89]\d{7}$/.test(phone)) {
    return { ok: false, persisted: false, error: "Invalid Singapore mobile number" }
  }

  const bottles = Math.max(1, input.bottles ?? 1)
  const lastPurchaseAt = input.purchasedAt ?? new Date().toISOString()
  const nudgeDueAt = computeNudgeDueAt(lastPurchaseAt, bottles)

  const record: CustomerRecord = {
    phone,
    name: input.name?.trim() ?? "",
    lastPurchaseAt,
    bottles,
    lang: input.lang ?? "zh",
    optedOut: false,
    nudgesSent: 0,
  }

  if (!redis) {
    return { ok: true, persisted: false, nudgeDueAt: nudgeDueAt.toISOString() }
  }

  try {
    const existing = await redis.hgetall<Record<string, string>>(`customer:${phone}`)
    // Preserve an opt-out across repeat purchases. Someone who told you to
    // stop messaging should stay stopped even if they buy again through a
    // marketplace — re-subscribing them silently is the fastest way to get
    // your WhatsApp number reported and rate-limited.
    if (existing?.optedOut === "true") {
      record.optedOut = true
    }

    await Promise.all([
      redis.hset(`customer:${phone}`, record as unknown as Record<string, unknown>),
      redis.sadd("customers:all", phone),
      record.optedOut
        ? redis.zrem(NUDGE_QUEUE_KEY, phone)
        : redis.zadd(NUDGE_QUEUE_KEY, { score: nudgeDueAt.getTime(), member: phone }),
    ])

    return { ok: true, persisted: true, nudgeDueAt: nudgeDueAt.toISOString() }
  } catch (error) {
    console.error("[Customers] Redis write failed:", error)
    return { ok: false, persisted: false, error: "Storage error" }
  }
}

export async function optOutCustomer(phoneRaw: string): Promise<{ ok: boolean }> {
  const phone = normalisePhone(phoneRaw)
  if (!redis) return { ok: false }
  try {
    await Promise.all([
      redis.hset(`customer:${phone}`, { optedOut: true }),
      redis.zrem(NUDGE_QUEUE_KEY, phone),
    ])
    return { ok: true }
  } catch (error) {
    console.error("[Customers] Opt-out failed:", error)
    return { ok: false }
  }
}

export interface CustomerBaseStats {
  configured: boolean
  totalCustomers: number
  dueNow: number
  dueNext30Days: number
}

export async function getCustomerBaseStats(): Promise<CustomerBaseStats> {
  if (!redis) {
    return { configured: false, totalCustomers: 0, dueNow: 0, dueNext30Days: 0 }
  }
  try {
    const now = Date.now()
    const in30Days = now + 30 * 24 * 60 * 60 * 1000
    const [totalCustomers, dueNow, dueNext30Days] = await Promise.all([
      redis.scard("customers:all"),
      redis.zcount(NUDGE_QUEUE_KEY, 0, now),
      redis.zcount(NUDGE_QUEUE_KEY, now, in30Days),
    ])
    return { configured: true, totalCustomers, dueNow, dueNext30Days }
  } catch (error) {
    console.error("[Customers] Stats read failed:", error)
    return { configured: false, totalCustomers: 0, dueNow: 0, dueNext30Days: 0 }
  }
}
