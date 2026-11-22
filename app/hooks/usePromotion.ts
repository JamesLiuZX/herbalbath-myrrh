"use client"

import { useEffect, useState } from "react"
import { PROMOTIONS } from "@/app/lib/promotions-data"
import { resolvePromotions, type PromoSnapshot } from "@/app/lib/promotions"

const fingerprint = (s: PromoSnapshot) =>
  `${s.campaign?.id ?? ""}|${s.permitValid}|${s.listPrice ?? ""}|${s.packages.map((p) => `${p.id}:${p.price}`).join(",")}`

/**
 * The offer to show. The first paint uses what the server resolved, so
 * hydration matches; then it is resolved once more in the browser, because a
 * cached page can be up to ten minutes older than a campaign boundary.
 */
export function usePromotion(initial: PromoSnapshot): PromoSnapshot {
  const [snapshot, setSnapshot] = useState(initial)
  useEffect(() => {
    const now = resolvePromotions(PROMOTIONS, Date.now())
    if (fingerprint(now) !== fingerprint(initial)) setSnapshot(now)
  }, [initial])
  return snapshot
}
