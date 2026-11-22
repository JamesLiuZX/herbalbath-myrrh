import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { bearerOk } from "@/app/lib/orders"

// The operator's read path (ops/OPERATOR.md): orders since a timestamp, for
// tallying units by campaign. It returns what was bought and when. It holds no
// names, phone numbers or addresses, because orders don't store them.
//
//   GET /api/internal/orders?since=<ms since epoch>&limit=<n>
//   Authorization: Bearer <ORDERS_API_TOKEN>
//
// With ORDERS_API_TOKEN unset every request is refused.

export const dynamic = "force-dynamic"

const isRedisConfigured = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
const redis = isRedisConfigured ? Redis.fromEnv() : null

const FIELDS = ["reference", "status", "packageId", "bottles", "qty", "amount", "campaignId", "captainCode", "lang", "consent", "createdAt"] as const

export async function GET(request: Request) {
  if (!bearerOk(request.headers.get("authorization"), process.env.ORDERS_API_TOKEN)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  if (!redis) return NextResponse.json({ persisted: false, orders: [] })

  const url = new URL(request.url)
  const since = Math.max(0, Number(url.searchParams.get("since")) || 0)
  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get("limit")) || 200))
  const references = await redis.zrange<string[]>("orders:byTime", since, "+inf", { byScore: true, offset: 0, count: limit })
  const rows = await Promise.all(references.map((ref) => redis.hgetall<Record<string, unknown>>(`order:${ref}`)))
  const orders = rows.filter(Boolean).map((row) => Object.fromEntries(FIELDS.map((f) => [f, row![f] ?? ""])))
  return NextResponse.json({ persisted: true, orders })
}
