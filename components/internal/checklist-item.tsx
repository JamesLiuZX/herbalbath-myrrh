"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"

/**
 * A checkbox persisted to localStorage under `hb-checklist:<id>`. No backend
 * — this is a single-user internal tool, and a per-browser tick mark is
 * enough to make a long checklist actually usable across visits.
 */
export function ChecklistItem({ id, children }: { id: string; children: React.ReactNode }) {
  const [checked, setChecked] = useState(false)
  const storageKey = `hb-checklist:${id}`

  useEffect(() => {
    setChecked(localStorage.getItem(storageKey) === "1")
  }, [storageKey])

  const toggle = () => {
    const next = !checked
    setChecked(next)
    localStorage.setItem(storageKey, next ? "1" : "0")
  }

  return (
    <li>
      <button type="button" onClick={toggle} className="group flex w-full items-start gap-3 text-left">
        <span
          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
            checked ? "border-emerald-600 bg-emerald-600" : "border-gray-300 group-hover:border-emerald-400"
          }`}
        >
          {checked && <Check className="h-3.5 w-3.5 text-white" />}
        </span>
        <span className={`text-sm leading-relaxed ${checked ? "text-gray-400 line-through" : "text-gray-700"}`}>
          {children}
        </span>
      </button>
    </li>
  )
}
