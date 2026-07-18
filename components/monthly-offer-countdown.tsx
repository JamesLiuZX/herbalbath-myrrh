"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface MonthlyOfferCountdownProps {
  language: "zh" | "en"
}

function daysLeftInMonth(): number {
  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return Math.max(1, Math.ceil((lastDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
}

// Honest urgency: the "买3送1" offer really is reviewed and re-confirmed on a
// monthly cycle, so counting down to month-end is a true statement rather
// than a fabricated countdown to a fake deadline. Computed client-side to
// avoid a stale server-rendered day count.
export function MonthlyOfferCountdown({ language }: MonthlyOfferCountdownProps) {
  const [days, setDays] = useState<number | null>(null)

  useEffect(() => {
    setDays(daysLeftInMonth())
  }, [])

  if (days === null) return null

  return (
    <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1 text-xs sm:text-sm font-medium">
      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
      {language === "zh" ? (
        <span>本月优惠还剩 {days} 天</span>
      ) : (
        <span>
          {days} day{days === 1 ? "" : "s"} left in this month's offer
        </span>
      )}
    </div>
  )
}
