"use client"

import Link from "next/link"
import { Phone, MessageCircle, QrCode } from "lucide-react"

interface StickyMobileCTAProps {
  onWhatsAppClick: () => void
  phoneNumber?: string
  whatsappLabel?: string
  callLabel?: string
  /** When set, a PayNow button takes the widest slot and the call button shrinks to an icon. */
  payHref?: string
  payLabel?: string
}

// Reusable mobile-only bottom action bar: phone call (tel: link, zero
// friction) + WhatsApp (routed through the caller's click handler so it can
// still fire referral tracking / ad-pixel conversion events), plus PayNow on
// pages that sell. Matches the pattern already used on /blog and /pain-points
// pages, now shared instead of copy-pasted.
export function StickyMobileCTA({
  onWhatsAppClick,
  phoneNumber = "+6584261225",
  whatsappLabel = "WhatsApp",
  callLabel = "立即拨打",
  payHref,
  payLabel = "PayNow 付款",
}: StickyMobileCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-3 md:hidden z-50">
      <div className="flex gap-2">
        <a
          href={`tel:${phoneNumber}`}
          aria-label={callLabel}
          className={`flex items-center justify-center gap-2 bg-stone-800 text-white py-3.5 rounded-xl text-base font-medium active:bg-stone-900 transition-colors ${
            payHref ? "w-12 shrink-0" : "flex-1"
          }`}
        >
          <Phone className="h-5 w-5" />
          {!payHref && callLabel}
        </a>
        <button
          type="button"
          onClick={onWhatsAppClick}
          className="flex-1 flex items-center justify-center gap-1.5 whitespace-nowrap bg-green-600 text-white py-3.5 rounded-xl text-base font-medium active:bg-green-700 transition-colors"
        >
          <MessageCircle className="h-5 w-5 shrink-0" />
          {whatsappLabel}
        </button>
        {payHref && (
          <Link
            href={payHref}
            className="flex-1 flex items-center justify-center gap-1.5 whitespace-nowrap bg-brand-700 text-white py-3.5 rounded-xl text-base font-semibold active:bg-brand-800 transition-colors"
          >
            <QrCode className="h-5 w-5 shrink-0" />
            {payLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
