"use server"

import { Redis } from "@upstash/redis"

// Persists referral clicks to Upstash Redis (the official successor to the
// now-deprecated Vercel KV) when it's configured, so the Partner Program can
// actually verify and pay commissions. Falls back to console.log — the
// previous behavior — if no Redis store is connected yet, so nothing breaks
// before that's set up.
//
// To enable: add a Redis integration from the Vercel Marketplace
// (vercel.com/marketplace?category=storage&search=redis), which injects
// UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN automatically.
const isRedisConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
)

const redis = isRedisConfigured ? Redis.fromEnv() : null

export async function trackReferralClick(refId: string | null, referredFrom: string) {
  if (!refId) {
    return { success: false, message: "No referral ID provided." }
  }

  const timestamp = new Date().toISOString()

  if (redis) {
    try {
      const clickId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      await Promise.all([
        redis.hset(`referral:click:${clickId}`, { refId, referredFrom, timestamp }),
        redis.zadd(`referral:${refId}:clicks`, { score: Date.now(), member: clickId }),
        redis.incr(`referral:${refId}:count`),
        redis.sadd("referral:known-ids", refId),
      ])
    } catch (error) {
      console.error("[Referral Tracking] Redis write failed, falling back to log:", error)
      console.log(`[Referral Tracking] Timestamp: ${timestamp}, Referral ID: ${refId}, Referred From: ${referredFrom}`)
    }
  } else {
    console.log(`[Referral Tracking] Timestamp: ${timestamp}, Referral ID: ${refId}, Referred From: ${referredFrom}`)
  }

  return { success: true, message: `Referral ${refId} tracked successfully.` }
}

export interface ReferralStats {
  refId: string
  totalClicks: number
  configured: boolean
}

/** Lets the Partner page show a real click count once Redis is configured. */
export async function getReferralStats(refId: string): Promise<ReferralStats> {
  if (!redis || !refId.trim()) {
    return { refId, totalClicks: 0, configured: Boolean(redis) }
  }
  const totalClicks = (await redis.get<number>(`referral:${refId}:count`)) ?? 0
  return { refId, totalClicks, configured: true }
}
