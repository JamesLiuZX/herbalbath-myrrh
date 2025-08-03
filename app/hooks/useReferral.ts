"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { trackReferralClick } from "@/app/actions/trackReferral"

export function useReferral(baseWhatsappMessage: string) {
  const [refId, setRefId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Priority: URL param > localStorage > null
    const urlRef = searchParams.get("ref")
    if (urlRef) {
      localStorage.setItem("referralId", urlRef)
      setRefId(urlRef)
    } else {
      const storedRef = localStorage.getItem("referralId")
      if (storedRef) {
        setRefId(storedRef)
      }
    }
  }, [searchParams])

  const getWhatsAppLink = useCallback(
    (whatsappNumber: string) => {
      let message = baseWhatsappMessage
      if (refId) {
        message += ` (Referred by: ${refId})`
        // Fire-and-forget the tracking action, no need to await
        trackReferralClick(refId, window.location.pathname)
      }
      const encodedMessage = encodeURIComponent(message)
      return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    },
    [refId, baseWhatsappMessage],
  )

  return { refId, getWhatsAppLink }
}
