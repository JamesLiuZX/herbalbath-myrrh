"use server"

import { Redis } from "@upstash/redis"
import { normaliseOrder, type RecordOrderInput } from "@/app/lib/orders"
import { resolvePromotions } from "@/app/lib/promotions"
import { PROMOTIONS } from "@/app/lib/promotions-data"
import { recordPurchase } from "./customers"

// The order record behind the "I've paid" tap on /pay. Without Redis it does
// nothing and the page behaves exactly as before. It never blocks, and never
// logs what the customer typed.

const isRedisConfigured = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
const redis = isRedisConfigured ? Redis.fromEnv() : null

const ORDERS_BY_TIME = "orders:byTime"

export async function recordOrder(input: RecordOrderInput): Promise<{ ok: boolean; persisted: boolean }> {
  try {
    const promo = resolvePromotions(PROMOTIONS, Date.now())
    const checked = normaliseOrder(input, promo.packages, promo.campaign?.id ?? null)
    if (!checked.ok) return { ok: false, persisted: false }
    if (!redis) return { ok: true, persisted: false }

    const { order, contact } = checked
    const key = `order:${order.reference}`
    // A second tap on the same reference updates the order but keeps its first timestamp and its place in the index.
    const isNew = (await redis.hsetnx(key, "createdAt", order.createdAt)) === 1
    const { createdAt, ...rest } = order
    await redis.hset(key, rest as unknown as Record<string, unknown>)
    if (isNew) await redis.zadd(ORDERS_BY_TIME, { score: Date.parse(createdAt), member: order.reference })
    if (isNew && contact) await recordPurchase({ phone: contact.phone, name: contact.name, bottles: order.bottles * order.qty, lang: order.lang })
    return { ok: true, persisted: true }
  } catch {
    return { ok: false, persisted: false }
  }
}
