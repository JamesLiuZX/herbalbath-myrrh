import type { Metadata } from "next"
import PartnerPageClient from "./PartnerPageClient"

// Previously this whole route was a "use client" file, so it had no way to
// export unique metadata and silently inherited the homepage's title/
// description — Search Console would see this as a duplicate. Splitting the
// interactive UI into PartnerPageClient keeps the client behavior identical
// while letting this server file own its own SEO metadata.
export const metadata: Metadata = {
  title: "合作伙伴计划 | Partner & Referral Program",
  description:
    "加入HerbalBath SG合作伙伴计划，分享天然疗愈，赚取推荐奖励。Join our referral program — share natural pain relief with friends and family in Singapore and earn commissions.",
  alternates: {
    canonical: "https://herbalbathsg.com/partner",
  },
  openGraph: {
    title: "合作伙伴计划 - HerbalBath SG",
    description: "分享天然疗愈，赚取推荐奖励。Share natural healing, earn referral rewards.",
    type: "website",
  },
}

export default function PartnerPage() {
  return <PartnerPageClient />
}
