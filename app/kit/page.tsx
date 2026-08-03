import type { Metadata } from "next"
import Link from "next/link"
import { CaptainKitClient } from "./CaptainKitClient"

export const metadata: Metadata = {
  title: "推荐大使工具包 | 草药浴 HerbalBath",
  description:
    "生成您的专属介绍码和推荐图片，分享给朋友即可赚取佣金。每月 PayNow 发放。",
  // Kept out of search results deliberately: this page is handed out in
  // person and over WhatsApp to people you've actually onboarded. Indexing it
  // would fill the program with strangers, which is precisely what makes a
  // referral network stop converting.
  robots: { index: false, follow: false },
}

export default function CaptainKitPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-red-700">
            草药浴 HerbalBath
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">推荐大使工具包</h1>
          <p className="text-lg text-gray-600 mt-3 leading-relaxed">
            推荐给亲友，赚取佣金。不用囤货，不用收钱，我们直接送货。
          </p>
        </div>
        <CaptainKitClient />
      </main>
    </div>
  )
}
