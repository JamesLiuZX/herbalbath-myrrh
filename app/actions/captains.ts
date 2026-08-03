"use server"

import { Redis } from "@upstash/redis"
import {
  generateCaptainCode,
  isValidCaptainCode,
  normaliseCaptainCode,
  type Captain,
} from "@/app/lib/captains"

// Same graceful-degradation pattern as trackReferral.ts: if no Redis store is
// connected the page still works end to end, it just can't persist. That
// matters because the captain kit is useful the moment it exists — the code
// and the share assets are generated client-side regardless.
const isRedisConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
)

const redis = isRedisConfigured ? Redis.fromEnv() : null

function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  // Accept 84261225, 6584261225 and +65 8426 1225 as the same person.
  return digits.length === 8 ? `65${digits}` : digits
}

export interface RegisterCaptainResult {
  ok: boolean
  captain?: Captain
  /** True when we returned an existing code instead of minting a new one. */
  existing?: boolean
  persisted: boolean
  error?: string
}

/**
 * Idempotent by phone number. A captain who forgets their code and registers
 * again gets the SAME code back rather than a second one — otherwise their
 * already-forwarded cards would silently stop attributing.
 */
export async function registerCaptain(
  name: string,
  phoneRaw: string,
): Promise<RegisterCaptainResult> {
  const trimmedName = name.trim()
  const phone = normalisePhone(phoneRaw)

  if (trimmedName.length < 2) {
    return { ok: false, persisted: false, error: "请输入您的姓名 / Please enter your name" }
  }
  if (!/^65[89]\d{7}$/.test(phone)) {
    return {
      ok: false,
      persisted: false,
      error: "请输入有效的新加坡手机号 / Please enter a valid Singapore mobile number",
    }
  }

  if (!redis) {
    // No store yet — still hand back a usable code so the kit is testable.
    return {
      ok: true,
      persisted: false,
      captain: {
        code: generateCaptainCode(),
        name: trimmedName,
        phone,
        createdAt: new Date().toISOString(),
      },
    }
  }

  try {
    const existingCode = await redis.get<string>(`captain:byPhone:${phone}`)
    if (existingCode) {
      const existing = await redis.hgetall<Record<string, string>>(`captain:${existingCode}`)
      if (existing?.code) {
        return {
          ok: true,
          existing: true,
          persisted: true,
          captain: existing as unknown as Captain,
        }
      }
    }

    // Retry on collision. With a 28-character alphabet over 5 places the
    // space is ~17M, so this effectively never loops, but a silent
    // collision would hand two captains the same code and merge their
    // commissions — worth the three lines to make impossible.
    let code = generateCaptainCode()
    for (let attempt = 0; attempt < 5; attempt++) {
      const taken = await redis.exists(`captain:${code}`)
      if (!taken) break
      code = generateCaptainCode()
    }

    const captain: Captain = {
      code,
      name: trimmedName,
      phone,
      createdAt: new Date().toISOString(),
    }

    await Promise.all([
      redis.hset(`captain:${code}`, captain as unknown as Record<string, unknown>),
      redis.set(`captain:byPhone:${phone}`, code),
      redis.sadd("captains:all", code),
    ])

    return { ok: true, persisted: true, captain }
  } catch (error) {
    console.error("[Captains] Redis write failed:", error)
    return {
      ok: true,
      persisted: false,
      captain: {
        code: generateCaptainCode(),
        name: trimmedName,
        phone,
        createdAt: new Date().toISOString(),
      },
    }
  }
}

export async function lookupCaptain(codeRaw: string): Promise<Captain | null> {
  const code = normaliseCaptainCode(codeRaw)
  if (!isValidCaptainCode(code) || !redis) return null

  try {
    const captain = await redis.hgetall<Record<string, string>>(`captain:${code}`)
    return captain?.code ? (captain as unknown as Captain) : null
  } catch (error) {
    console.error("[Captains] Redis read failed:", error)
    return null
  }
}

export interface CaptainScore {
  code: string
  name: string
  phone: string
  shares: number
  attributedOrders: number
  attributedRevenue: number
}

/**
 * Records that a captain actually pushed their link out. Distinct from an
 * order: share count is the leading indicator, orders are the lagging one.
 * A captain with zero shares 30 days in is not "slow", they are inactive —
 * that is the number to act on while there is still time to re-onboard them.
 */
export async function recordCaptainShare(codeRaw: string): Promise<void> {
  const code = normaliseCaptainCode(codeRaw)
  if (!isValidCaptainCode(code) || !redis) return
  try {
    await redis.hincrby(`captain:${code}:stats`, "shares", 1)
  } catch (error) {
    console.error("[Captains] Failed to record share:", error)
  }
}

/**
 * Called when an order is confirmed. Not wired to a checkout yet — orders
 * close over WhatsApp — so today this is the endpoint the fulfilment side
 * calls (or you call by hand) once payment lands. Recording it here is what
 * makes the monthly payout a script instead of an evening of scrolling chat.
 */
export async function recordCaptainOrder(
  codeRaw: string,
  orderValue: number,
): Promise<{ ok: boolean }> {
  const code = normaliseCaptainCode(codeRaw)
  if (!isValidCaptainCode(code) || !redis) return { ok: false }
  try {
    await Promise.all([
      redis.hincrby(`captain:${code}:stats`, "attributedOrders", 1),
      redis.hincrbyfloat(`captain:${code}:stats`, "attributedRevenue", orderValue),
    ])
    return { ok: true }
  } catch (error) {
    console.error("[Captains] Failed to record order:", error)
    return { ok: false }
  }
}

export async function getCaptainScore(codeRaw: string): Promise<CaptainScore | null> {
  const captain = await lookupCaptain(codeRaw)
  if (!captain || !redis) return null

  try {
    const stats = await redis.hgetall<Record<string, string>>(`captain:${captain.code}:stats`)
    return {
      code: captain.code,
      name: captain.name,
      phone: captain.phone,
      shares: Number(stats?.shares ?? 0),
      attributedOrders: Number(stats?.attributedOrders ?? 0),
      attributedRevenue: Number(stats?.attributedRevenue ?? 0),
    }
  } catch (error) {
    console.error("[Captains] Failed to read score:", error)
    return null
  }
}
