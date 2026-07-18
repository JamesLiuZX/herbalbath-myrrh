"use client"

import { Phone, MessageCircle } from "lucide-react"

interface StickyMobileCTAProps {
  onWhatsAppClick: () => void
  phoneNumber?: string
  whatsappLabel?: string
  callLabel?: string
}

// Reusable mobile-only bottom action bar: phone call (tel: link, zero
// friction) + WhatsApp (routed through the caller's click handler so it can
// still fire referral tracking / ad-pixel conversion events). Matches the
// pattern already used on /blog and /pain-points pages, now shared instead
// of copy-pasted.
export function StickyMobileCTA({
  onWhatsAppClick,
  phoneNumber = "+6584261225",
  whatsappLabel = "WhatsApp",
  callLabel = "立即拨打",
}: StickyMobileCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-3 md:hidden z-50">
      <div className="flex gap-3">
        <a
          href={`tel:${phoneNumber}`}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 text-white py-3.5 rounded-xl text-base font-medium active:bg-emerald-800 transition-colors"
        >
          <Phone className="h-5 w-5" />
          {callLabel}
        </a>
        <button
          type="button"
          onClick={onWhatsAppClick}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 rounded-xl text-base font-medium active:bg-green-700 transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          {whatsappLabel}
        </button>
      </div>
    </div>
  )
}
