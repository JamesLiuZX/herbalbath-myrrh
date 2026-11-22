"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { formatPrice, perBottle, type Lang, type PromoPackage } from "@/app/lib/promotions"

interface BundleSelectorProps {
  language: Lang
  /** What is on offer now, from content/promotions.json (app/lib/promotions.ts). */
  packages: PromoPackage[]
  defaultId: string
  onSelect?: (label: string, id: string) => void
}

const total = (pkg: PromoPackage, lang: Lang) =>
  pkg.bottles === 1 ? formatPrice(pkg.price) : lang === "zh" ? `${formatPrice(pkg.price)}（共${pkg.bottles}瓶）` : `${formatPrice(pkg.price)} (${pkg.bottles} bottles)`

const each = (pkg: PromoPackage, lang: Lang) => (lang === "zh" ? `每瓶 ${formatPrice(perBottle(pkg))}` : `${formatPrice(perBottle(pkg))} / bottle`)

// Set prices only: the selector states what each set costs and what that is
// per bottle. No "free", "save" or "try" wording, which HSA does not allow in
// advertising for a medicated oil.
export function BundleSelector({ language, packages, defaultId, onSelect }: BundleSelectorProps) {
  const [selected, setSelected] = useState(defaultId)

  // A campaign can start or end while the page is open; never leave a package selected that is no longer on offer.
  useEffect(() => {
    if (!packages.some((p) => p.id === selected)) setSelected(defaultId)
  }, [packages, defaultId, selected])

  return (
    <div className={packages.length > 2 ? "grid grid-cols-1 gap-3 sm:grid-cols-3" : "grid grid-cols-2 gap-3"}>
      {packages.map((pkg) => {
        const isSelected = selected === pkg.id
        const badge = pkg.id === defaultId ? (language === "zh" ? "最受欢迎" : "Most Popular") : null
        return (
          <button
            key={pkg.id}
            type="button"
            onClick={() => {
              setSelected(pkg.id)
              onSelect?.(pkg.label[language], pkg.id)
            }}
            className={`relative text-left p-3 sm:p-4 rounded-xl border-2 transition-colors ${
              isSelected ? "border-brand-600 bg-brand-50" : "border-gray-200 bg-white hover:border-brand-300"
            }`}
          >
            {badge && (
              <span className="absolute -top-3 right-3 bg-copper-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? "border-brand-600 bg-brand-600" : "border-gray-300"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </span>
              <span className="font-semibold text-sm sm:text-base">{pkg.label[language]}</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-brand-700">{total(pkg, language)}</div>
            <div className="text-xs sm:text-sm text-gray-600">{each(pkg, language)}</div>
          </button>
        )
      })}
    </div>
  )
}
