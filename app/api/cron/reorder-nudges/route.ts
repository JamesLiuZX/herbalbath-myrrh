import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import {
  buildReorderMessage,
  computeFollowUpDueAt,
  sendWhatsAppTemplate,
  MAX_NUDGES_PER_CYCLE,
  NUDGE_QUEUE_KEY,
  type CustomerRecord,
} from "@/app/lib/reorder"

// Vercel CRON — daily reorder nudges. See vercel.json.
//
// Runs every day rather than weekly on purpose: the queue is scored by each
// customer's own due date, so a daily pass spreads sends evenly instead of
// dumping thousands of messages in one burst. Bursts look like spam to Meta's
// quality system, and a quality-rating drop lowers your daily send limit,
// which is much harder to recover from than it is to avoid.

const CRON_SECRET = process.env.CRON_SECRET

const isRedisConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
)
const redis = isRedisConfigured ? Redis.fromEnv() : null

/** Caps work per invocation so the function can't exceed its execution limit. */
const BATCH_LIMIT = 200

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  if (!redis) {
    return NextResponse.json({
      success: false,
      reason: "Redis not configured — set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
    })
  }

  const startedAt = new Date().toISOString()
  const now = Date.now()

  try {
    const duePhones = await redis.zrange<string[]>(NUDGE_QUEUE_KEY, 0, now, {
      byScore: true,
      offset: 0,
      count: BATCH_LIMIT,
    })

    if (!duePhones.length) {
      return NextResponse.json({ success: true, startedAt, due: 0, sent: 0, dryRun: false })
    }

    let sent = 0
    let skipped = 0
    let failed = 0
    let dryRun = false

    for (const phone of duePhones) {
      const raw = await redis.hgetall<Record<string, string>>(`customer:${phone}`)
      if (!raw?.phone) {
        // Orphaned queue entry with no customer hash behind it — drop it,
        // otherwise it is retried every single day forever.
        await redis.zrem(NUDGE_QUEUE_KEY, phone)
        skipped++
        continue
      }

      const customer: CustomerRecord = {
        phone: raw.phone,
        name: raw.name ?? "",
        lastPurchaseAt: raw.lastPurchaseAt,
        bottles: Number(raw.bottles ?? 1),
        lang: raw.lang === "en" ? "en" : "zh",
        optedOut: raw.optedOut === "true",
        nudgesSent: Number(raw.nudgesSent ?? 0),
      }

      if (customer.optedOut || customer.nudgesSent >= MAX_NUDGES_PER_CYCLE) {
        await redis.zrem(NUDGE_QUEUE_KEY, phone)
        skipped++
        continue
      }

      const result = await sendWhatsAppTemplate(buildReorderMessage(customer))
      if (result.dryRun) dryRun = true

      if (!result.ok) {
        console.error(`[CRON reorder] Send failed for ${phone}:`, result.error)
        failed++
        // Leave the queue entry in place so tomorrow's run retries it. A
        // transient Graph API error should not silently cost a reorder.
        continue
      }

      sent++
      const nudgesSent = customer.nudgesSent + 1

      if (nudgesSent >= MAX_NUDGES_PER_CYCLE) {
        // Done nudging this cycle. They leave the queue and only re-enter it
        // when recordPurchase() runs again for their next order.
        await Promise.all([
          redis.hset(`customer:${phone}`, { nudgesSent }),
          redis.zrem(NUDGE_QUEUE_KEY, phone),
        ])
      } else {
        const followUpAt = computeFollowUpDueAt(customer.lastPurchaseAt, customer.bottles)
        await Promise.all([
          redis.hset(`customer:${phone}`, { nudgesSent }),
          redis.zadd(NUDGE_QUEUE_KEY, { score: followUpAt.getTime(), member: phone }),
        ])
      }
    }

    const remaining = await redis.zcount(NUDGE_QUEUE_KEY, 0, now)

    console.log(
      `[CRON reorder] ${startedAt} — due:${duePhones.length} sent:${sent} skipped:${skipped} failed:${failed} dryRun:${dryRun}`,
    )

    return NextResponse.json({
      success: true,
      startedAt,
      due: duePhones.length,
      sent,
      skipped,
      failed,
      dryRun,
      remainingDue: remaining,
      note: dryRun
        ? "DRY RUN — no messages were actually sent. Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID to go live."
        : undefined,
    })
  } catch (error) {
    console.error("[CRON reorder] Run failed:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  return GET(request)
}
