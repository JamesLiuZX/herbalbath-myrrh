"use client"

import { useEffect, useState, useCallback } from "react"
import { trackReferralClick } from "@/app/actions/trackReferral"

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    ttq?: { track: (...args: unknown[]) => void }
  }
}

// Fires a "Contact" conversion event on whichever ad pixels are loaded
// (see app/layout.tsx — pixels only load once their env var is set).
// This is the closest on-site signal to a real lead for a WhatsApp-only
// checkout funnel, so it's fired at the exact moment someone clicks through.
function trackWhatsAppClickConversion() {
  if (typeof window === "undefined") return
  window.fbq?.("track", "Contact")
  window.ttq?.track("Contact")
}

export function useReferral(baseWhatsappMessage: string) {
  const [refId, setRefId] = useState<string | null>(null)

  useEffect(() => {
    // Read directly from window.location instead of next/navigation's
    // useSearchParams(). useSearchParams is a "dynamic API" that forces
    // Next.js to bail out of static rendering for the whole page (it only
    // has a value once client-side JS runs), which meant the homepage,
    // /testimonials, and /partner were shipping an empty loading-spinner
    // shell as their server-rendered HTML — invisible to any crawler or
    // link-preview bot that doesn't execute JavaScript. Referral capture
    // only ever needs to run client-side anyway, so a plain browser API
    // gets the same result without that cost.
    const urlRef = new URLSearchParams(window.location.search).get("ref")
    if (urlRef) {
      localStorage.setItem("referralId", urlRef)
      setRefId(urlRef)
    } else {
      const storedRef = localStorage.getItem("referralId")
      if (storedRef) {
        setRefId(storedRef)
      }
    }
  }, [])

  const getWhatsAppLink = useCallback(
    (whatsappNumber: string, extraContext?: string) => {
      let message = baseWhatsappMessage
      if (extraContext) {
        message += ` ${extraContext}`
      }
      if (refId) {
        message += ` (Referred by: ${refId})`
        // Fire-and-forget the tracking action, no need to await
        trackReferralClick(refId, window.location.pathname)
      }
      trackWhatsAppClickConversion()
      const encodedMessage = encodeURIComponent(message)
      return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    },
    [refId, baseWhatsappMessage],
  )

  return { refId, getWhatsAppLink }
}
