import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Phone, MessageCircle, Leaf, Shield, Clock, Star } from "lucide-react"
import { painPointsData } from "@/app/lib/pain-points-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/breadcrumbs"

export const metadata: Metadata = {
  title: "常见疼痛问题 | Pain Points & Solutions | HerbalBath SG",
  description:
    "新加坡乐龄人士常见疼痛问题的天然解决方案。膝盖痛、腰酸背痛、风湿关节炎、手脚麻痹等问题的专业指南。Natural pain relief solutions for Singapore seniors - knee pain, back pain, arthritis, numbness.",
  keywords: [
    "herbalbath",
    "herbal bath singapore",
    "knee pain singapore",
    "back pain elderly",
    "joint pain relief",
    "膝盖疼痛",
    "腰酸背痛",
    "关节炎",
  ],
  openGraph: {
    title: "常见疼痛问题 - HerbalBath SG",
    description: "新加坡乐龄人士常见疼痛问题的天然解决方案",
  },
}

const painPointIcons: Record<string, string> = {
  "knee-pain": "🦵",
  "back-pain": "🔙",
  "joint-arthritis": "🦴",
  "numbness-tingling": "🤚",
  "neck-shoulder-stiffness": "💪",
  "sleep-difficulties": "😴",
  "morning-stiffness": "🌅",
  "weather-related-pain": "🌧️",
}

// FAQ Schema for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is HerbalBath Myrrh Spray?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HerbalBath Myrrh Spray is a 100% natural pain relief spray made from myrrh and frankincense, ancient herbs known for their anti-inflammatory and pain-relieving properties. It works in 10 seconds and is trusted by over 15,000 Singapore users.",
      },
    },
    {
      "@type": "Question",
      name: "Is HerbalBath safe for elderly seniors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, HerbalBath is specifically designed for seniors aged 55+. It uses 100% natural ingredients with no side effects, making it safe for daily use. It's been trusted by Singapore seniors for over 8 years.",
      },
    },
    {
      "@type": "Question",
      name: "How does herbal bath help with joint pain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The myrrh and frankincense in HerbalBath spray contain natural anti-inflammatory compounds that penetrate deep into joints and muscles, providing relief from pain and stiffness within 10 seconds.",
      },
    },
  ],
}

export default function PainPointsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
        {/* Header */}
        <header className="bg-emerald-800 text-white py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold font-serif">
              HerbalBath SG
            </Link>
            <div className="flex items-center gap-4">
              <a
                href="tel:+6588930000"
                className="hidden md:flex items-center gap-2 text-lg font-medium hover:text-emerald-200 transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>8893 0XXX</span>
              </a>
              <a
                href="https://wa.me/6588930000"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-base font-medium transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs
            items={[
              { label: "首页 Home", href: "/" },
              { label: "常见疼痛问题 Pain Points", href: "/pain-points" },
            ]}
          />

          {/* Hero Section */}
          <section className="text-center py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-emerald-900 mb-4">
              常见疼痛问题指南
            </h1>
            <p className="text-xl md:text-2xl text-emerald-700 mb-2">
              Pain Points & Natural Solutions Guide
            </p>
            <p className="text-lg text-stone-600 max-w-3xl mx-auto mt-4 leading-relaxed">
              专为新加坡55岁以上乐龄人士设计的健康指南。了解常见疼痛问题的原因、症状和天然缓解方法。
            </p>
            <p className="text-base text-stone-500 max-w-3xl mx-auto mt-2">
              Health guide designed for Singapore seniors 55+. Understand causes, symptoms, and natural relief methods for common pain issues.
            </p>
          </section>

          {/* Trust Badges */}
          <section className="flex flex-wrap justify-center gap-6 md:gap-10 py-8 border-y border-stone-200">
            <div className="flex items-center gap-2 text-emerald-700">
              <Shield className="h-6 w-6" />
              <span className="text-lg font-medium">8年品质保证</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
              <span className="text-lg font-medium">15,000+ 好评</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <Leaf className="h-6 w-6" />
              <span className="text-lg font-medium">100% 天然成分</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <Clock className="h-6 w-6" />
              <span className="text-lg font-medium">10秒见效</span>
            </div>
          </section>

          {/* Pain Points Grid */}
          <section className="py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-emerald-900 mb-8">
              选择您想了解的疼痛问题
              <span className="block text-lg font-normal text-stone-600 mt-2">
                Select a pain point to learn more
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {painPointsData.map((painPoint) => (
                <Link key={painPoint.slug} href={`/pain-points/${painPoint.slug}`}>
                  <Card className="h-full hover:shadow-lg hover:border-emerald-300 transition-all duration-300 cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="text-4xl mb-3">{painPointIcons[painPoint.slug] || "🩹"}</div>
                      <CardTitle className="text-xl font-bold text-emerald-800 group-hover:text-emerald-600 transition-colors">
                        {painPoint.titleZh}
                      </CardTitle>
                      <CardDescription className="text-base text-stone-600">
                        {painPoint.titleEn}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-stone-600 text-base line-clamp-3 mb-4">
                        {painPoint.descriptionZh}
                      </p>
                      <div className="flex items-center text-emerald-600 font-medium group-hover:text-emerald-500">
                        <span>了解详情 Learn More</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-emerald-50 rounded-2xl p-8 md:p-12 text-center my-12">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-4">
              想要立即缓解疼痛？
              <span className="block text-lg font-normal text-emerald-700 mt-2">
                Want immediate pain relief?
              </span>
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-8">
              HerbalBath没药喷雾采用千年古方，10秒见效，15,000+新加坡用户信赖之选。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-lg px-8 py-6 h-auto"
              >
                <Link href="/">
                  了解更多产品信息
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-emerald-700 text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6 h-auto"
              >
                <a href="https://wa.me/6588930000">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp 咨询
                </a>
              </Button>
            </div>
          </section>

          {/* Related Blog Posts */}
          <section className="py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-emerald-900 mb-8">
              相关健康文章
              <span className="block text-lg font-normal text-stone-600 mt-2">
                Related Health Articles
              </span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/blog/knee-pain-relief-singapore"
                className="px-6 py-3 bg-white border border-stone-200 rounded-full hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-stone-700"
              >
                膝盖痛缓解指南
              </Link>
              <Link
                href="/blog/myrrh-frankincense-miracle-herbs"
                className="px-6 py-3 bg-white border border-stone-200 rounded-full hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-stone-700"
              >
                没药乳香的神奇功效
              </Link>
              <Link
                href="/blog/anti-inflammatory-diet-guide"
                className="px-6 py-3 bg-white border border-stone-200 rounded-full hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-stone-700"
              >
                抗炎饮食指南
              </Link>
              <Link
                href="/blog/gentle-exercises-for-seniors"
                className="px-6 py-3 bg-white border border-stone-200 rounded-full hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-stone-700"
              >
                乐龄温和运动
              </Link>
              <Link
                href="/blog"
                className="px-6 py-3 bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition-colors"
              >
                查看全部文章 →
              </Link>
            </div>
          </section>
        </div>

        {/* Sticky Mobile CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 md:hidden z-50">
          <div className="flex gap-3">
            <a
              href="tel:+6588930000"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 text-white py-4 rounded-xl text-lg font-medium"
            >
              <Phone className="h-5 w-5" />
              立即拨打
            </a>
            <a
              href="https://wa.me/6588930000"
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-xl text-lg font-medium"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
