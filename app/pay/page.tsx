import type { Metadata } from "next"
import { PayClient } from "./PayClient"

// A payment page is reached through a link James sends or a button on the
// site, never from search: it is noindex so it can't outrank the homepage or
// be crawled with someone's order reference in it.
export const metadata: Metadata = {
  title: "PayNow 付款 | HerbalBath SG",
  description: "用 PayNow 为 HerbalBath 没药喷雾付款。金额与参考号已自动填好，付款后 WhatsApp 告诉我们即可。",
  robots: { index: false, follow: true },
  alternates: { canonical: "/pay" },
}

export default function PayPage() {
  return <PayClient />
}
