"use client"

import { CalendarPlus } from "lucide-react"
import { downloadReorderReminderICS } from "@/lib/generate-reorder-ics"

interface ReorderReminderButtonProps {
  language?: "zh" | "en"
  className?: string
}

export function ReorderReminderButton({ language = "zh", className = "" }: ReorderReminderButtonProps) {
  return (
    <button
      type="button"
      onClick={() => downloadReorderReminderICS(3)}
      className={`inline-flex items-center justify-center gap-2 text-sm font-medium text-emerald-700 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 rounded-xl px-4 py-3 transition-colors ${className}`}
    >
      <CalendarPlus className="h-4 w-4 flex-shrink-0" />
      {language === "zh" ? "加入日历：3个月后提醒我补货" : "Add to calendar: remind me to reorder in 3 months"}
    </button>
  )
}
