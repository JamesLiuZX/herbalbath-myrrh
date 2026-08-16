"use client"

import { useState } from "react"
import { Check } from "lucide-react"

interface BundleOption {
  id: "single" | "bundle"
  labelZh: string
  labelEn: string
  totalZh: string
  totalEn: string
  perBottleZh: string
  perBottleEn: string
  badgeZh?: string
  badgeEn?: string
}

// Pricing mirrors the existing "买3送1" offer already advertised elsewhere on
// the site (S$39/bottle, buy 3 get 1 free) — this just makes the per-bottle
// savings visible and lets the customer's choice flow into their WhatsApp
// message, instead of only stating the offer in passing.
const OPTIONS: BundleOption[] = [
  {
    id: "single",
    labelZh: "单瓶尝鲜",
    labelEn: "Single Bottle",
    totalZh: "S$39",
    totalEn: "S$39",
    perBottleZh: "每瓶 S$39",
    perBottleEn: "S$39 / bottle",
  },
  {
    id: "bundle",
    labelZh: "买3送1",
    labelEn: "Buy 3 Get 1 Free",
    totalZh: "S$117（共4瓶）",
    totalEn: "S$117 (4 bottles)",
    perBottleZh: "每瓶仅 S$29.25 · 省25%",
    perBottleEn: "Only S$29.25 / bottle · Save 25%",
    badgeZh: "最受欢迎",
    badgeEn: "Most Popular",
  },
]

interface BundleSelectorProps {
  language: "zh" | "en"
  onSelect?: (label: string) => void
}

export function BundleSelector({ language, onSelect }: BundleSelectorProps) {
  const [selected, setSelected] = useState<BundleOption["id"]>("bundle")

  return (
    <div className="grid grid-cols-2 gap-3">
      {OPTIONS.map((opt) => {
        const isSelected = selected === opt.id
        const badge = language === "zh" ? opt.badgeZh : opt.badgeEn
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => {
              setSelected(opt.id)
              onSelect?.(language === "zh" ? opt.labelZh : opt.labelEn)
            }}
            className={`relative text-left p-3 sm:p-4 rounded-xl border-2 transition-colors ${
              isSelected ? "border-green-700 bg-green-50" : "border-gray-200 bg-white hover:border-green-300"
            }`}
          >
            {badge && (
              <span className="absolute -top-3 right-3 bg-red-600 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? "border-green-700 bg-green-700" : "border-gray-300"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </span>
              <span className="font-semibold text-sm sm:text-base">
                {language === "zh" ? opt.labelZh : opt.labelEn}
              </span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-green-800">
              {language === "zh" ? opt.totalZh : opt.totalEn}
            </div>
            <div className="text-sm sm:text-base text-stone-600">
              {language === "zh" ? opt.perBottleZh : opt.perBottleEn}
            </div>
          </button>
        )
      })}
    </div>
  )
}
