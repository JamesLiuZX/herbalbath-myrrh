import type { Metadata } from "next"
import Link from "next/link"
import { TradePageClient } from "./TradePageClient"

export const metadata: Metadata = {
  title: "批发合作 Trade & Wholesale | 草药浴 HerbalBath",
  description:
    "中医诊所、中药店、推拿及物理治疗中心批发合作。买断制，起订一箱，附免费试用装与柜台展示架。",
  // Noindex is deliberate and load-bearing, not tidiness.
  //
  // Under Singapore's medicine advertising rules, a consumer-facing ad
  // carrying medicinal claims needs an HSA permit — but that requirement
  // does not apply to material directed exclusively at people who may
  // lawfully sell or supply the product in the course of their trade.
  // Keeping this page out of the index and off the public nav is part of
  // what keeps it a trade communication rather than a consumer advertisement.
  // If you ever link it from the homepage, that distinction weakens.
  robots: { index: false, follow: false },
}

export default function TradePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-red-700">
            草药浴 HerbalBath
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-14">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="inline-block bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            同业专用 · For trade buyers only
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">批发合作</h1>
          <p className="text-lg md:text-xl text-gray-600 mt-4 leading-relaxed">
            中医诊所 · 中药店 · 推拿足底反射 · 物理治疗 · 乐龄中心
          </p>
        </div>

        <TradePageClient />

        <p className="max-w-3xl mx-auto text-sm text-gray-500 mt-14 leading-relaxed border-t pt-6">
          本页资料仅供同业参考，不构成向一般公众的广告。价格及供货条款以正式报价单为准。
          <br />
          This page is intended for trade buyers only and is not a consumer advertisement.
          Pricing and supply terms are subject to formal quotation.
        </p>
      </main>
    </div>
  )
}
