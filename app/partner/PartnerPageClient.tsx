"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Store, MessageCircle, ArrowRight } from "lucide-react"
import { useReferral } from "@/app/hooks/useReferral"
import { StickyMobileCTA } from "@/components/sticky-mobile-cta"
import { CONTACT, CAPTAIN, WHOLESALE_TIERS } from "@/app/lib/growth-config"

// This page used to be the referral program itself: it minted a
// `?ref=<name>` URL and asked the partner to copy it to their clipboard.
// That flow assumed someone comfortable selecting text, switching apps and
// pasting — which is not the person actually doing the referring here, and
// when any step failed it failed silently. It has been split into the two
// motions that really exist:
//
//   /kit   — individuals (代理 / captains). Code + forwardable image.
//   /trade — businesses. Wholesale ladder + trade enquiry.
//
// Keeping /partner as the fork preserves any printed or already-forwarded
// links to this URL rather than 404ing people who have it.

export default function PartnerPageClient() {
  const { getWhatsAppLink } = useReferral("您好，我想了解合作方式。")

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-red-700">
            草药浴 HerbalBath
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">合作方式</h1>
          <p className="text-lg md:text-xl text-gray-600 mt-4">请选择适合您的方式</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="border-2 hover:border-red-300 transition-colors">
            <CardContent className="p-8 flex flex-col h-full">
              <Award className="w-12 h-12 text-red-600 mb-4" />
              <h2 className="text-2xl font-bold">个人推荐大使</h2>
              <p className="text-gray-600 mt-3 leading-relaxed flex-grow">
                推荐给亲友和群组，赚取 {CAPTAIN.commissionPct}% 佣金。
                不用囤货、不用收钱，我们直接送货。一分钟拿到您的介绍码和推荐图片。
              </p>
              <Button asChild className="w-full mt-6 py-6 text-lg bg-red-700 hover:bg-red-800">
                <Link href="/kit">
                  领取我的介绍码 <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-gray-400 transition-colors">
            <CardContent className="p-8 flex flex-col h-full">
              <Store className="w-12 h-12 text-gray-700 mb-4" />
              <h2 className="text-2xl font-bold">店铺批发合作</h2>
              <p className="text-gray-600 mt-3 leading-relaxed flex-grow">
                中医诊所、中药店、推拿足底反射、物理治疗中心。
                起订 {WHOLESALE_TIERS[0].minUnits} 支，附免费试用装和柜台展示架。
              </p>
              <Button asChild variant="outline" className="w-full mt-6 py-6 text-lg border-2">
                <Link href="/trade">
                  查看批发价格 <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-14">
          <p className="text-gray-600 mb-4 text-lg">有疑问？</p>
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-lg py-6"
            onClick={() => window.open(getWhatsAppLink(CONTACT.whatsappNumber), "_blank")}
          >
            <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp {CONTACT.whatsappDisplay}
          </Button>
        </div>
      </main>

      <StickyMobileCTA
        onWhatsAppClick={() => window.open(getWhatsAppLink(CONTACT.whatsappNumber), "_blank")}
        callLabel="Call Now"
      />
    </div>
  )
}
