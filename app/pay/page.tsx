import type { Metadata } from "next"
import { resolvePromotions } from "@/app/lib/promotions"
import { PROMOTIONS } from "@/app/lib/promotions-data"
import { PayClient } from "./PayClient"

// A payment page is reached through a link James sends or a button on the
// site, never from search: it is noindex so it can't outrank the homepage or
// be crawled with someone's order reference in it.
export const metadata: Metadata = {
  title: "PayNow 付款 | HerbalBath SG",
  description: "用 PayNow 为 HerbalBath 没药草本能量油付款。金额与参考号已自动填好，付款后 WhatsApp 告诉我们即可。",
  robots: { index: false, follow: true },
  alternates: { canonical: "/pay" },
}

// Packages and prices come from content/promotions.json. Re-rendered at most
// every ten minutes so a campaign boundary reaches the page; the client
// resolves once more after it loads.
export const revalidate = 600

export default function PayPage() {
  return <PayClient initialPromo={resolvePromotions(PROMOTIONS, Date.now())} />
}
