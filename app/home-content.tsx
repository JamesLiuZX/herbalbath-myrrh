"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Menu, Phone, QrCode, Users, Award, Star } from "lucide-react"
import Image from "next/image"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useReferral } from "@/app/hooks/useReferral"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { testimonialImages } from "@/app/lib/testimonial-data" // Import from the new data file
import { FAQSection } from "@/components/faq-section"
import { StickyMobileCTA } from "@/components/sticky-mobile-cta"
import { BundleSelector } from "@/components/bundle-selector"
import { MonthlyOfferCountdown } from "@/components/monthly-offer-countdown"
import { ReorderReminderButton } from "@/components/reorder-reminder-button"
import { CONTACT, SHOPEE_URL } from "@/app/lib/growth-config"

function Stars({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <span className="inline-flex text-copper-500" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`${className} fill-current`} />
      ))}
    </span>
  )
}
import Link from "next/link"

// Real customer videos (same source as /testimonials) — previously the
// homepage carousel only showed a "coming soon" placeholder here even though
// these two videos already exist and are live on /testimonials.
const realVideoTestimonials = [
  { youtubeId: "hkTuQsdXSrQ", title: "客户见证合集 (第一集)" },
  { youtubeId: "nMsJT527FWY", title: "客户见证合集 (第二集)" },
]

// Store logos, small copies in /images/logos (the originals were up to 1200px for a 20px icon).
const PLATFORMS = [
  ["/images/logos/carousell.webp", "Carousell"],
  ["/images/logos/tiktok-shop.webp", "TikTok Shop"],
  ["/images/logos/facebook.webp", "Facebook"],
  ["/images/logos/shopee.webp", "Shopee"],
] as const

const READING = [
  { href: "/blog/knee-pain-relief-singapore", title: "膝盖痛缓解指南", desc: "10个帮助乐龄人士缓解膝盖疼痛的实用建议" },
  { href: "/blog/myrrh-frankincense-miracle-herbs", title: "没药乳香的功效", desc: "探索这两种千年草药的历史与科学原理" },
  { href: "/blog/gentle-exercises-for-seniors", title: "乐龄温和运动", desc: "5种最适合新加坡乐龄人士的安全运动" },
]

const useLanguage = () => {
  const [language, setLanguage] = useState<"zh" | "en">("zh")

  // <html lang> was hardcoded to "zh" in the root layout regardless of which
  // language was actually being displayed — wrong for screen readers and
  // browser translate prompts whenever a visitor switched to English.
  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-SG" : "en-SG"
  }, [language])

  return { language, setLanguage }
}

const content = {
  zh: {
    nav: {
      testimonials: "真实见证",
      details: "产品详情",
      usage: "使用方法",
      buy: "选择套餐",
      blog: "健康知识",
    },
    hero: {
      badge: "千年智慧 • 天然疗愈",
      product: "HerbalBath 草本沐 · 没药草本能量油",
      title: "告别疼痛,重获自由",
      subtitle: "没药草本能量油，15,000+用户见证的神奇效果。天然草本，深层舒缓，让您重新享受无痛生活。",
      cta: "立即体验",
      pay_cta: "立即订购 · PayNow",
      shopee_cta: "Shopee购买",
      whatsapp_cta: "WhatsApp咨询",
      // Lifted verbatim from product_cta.features so the hero adds no new claim.
      chips: ["10秒感受温热", "一瓶可用3-4个月"],
      trust_badges: {
        users: "15,000+ 新加坡人信赖",
        rating: "4.9星好评",
        platforms: "多平台销售",
        years: "8年品牌",
      },
    },
    testimonials_section: {
      title: "15,000+用户真实见证",
      subtitle:
        "真实回购客户的故事：从半信半疑到大量囤货，因为它真的解决了困扰多年的疼痛问题，现在全家人都在用，还推荐给亲朋好友 →",
      video_placeholder: {
        title: "客户使用视频",
        coming_soon: "即将上线",
      },
    },
    quote: {
      text: "用了三周，僵硬的肩膀松了很多，抬手很轻松。那种热感真的很舒服，比我之前用的药油持久！",
      author: "- 陈女士, 62岁",
    },
    product_cta: {
      title: "选择套餐",
      price: "S$39",
      original_price: "S$49",
      offer: "买3送1 + 免费送货",
      pay_cta: "PayNow 立即付款",
      cta: "WhatsApp咨询",
      phone_cta: "电话订购",
      guarantee: "30天不满意，全额退款",
    },
  },
  en: {
    nav: {
      testimonials: "Testimonials",
      details: "Product details",
      usage: "How to use",
      buy: "Packages",
      blog: "Health Journal",
    },
    hero: {
      badge: "Ancient Wisdom • Natural Healing",
      product: "HerbalBath Myrrh Herbal Energy Oil",
      title: "Say Goodbye to Pain",
      subtitle: "Myrrh Herbal Energy Oil with 15,000+ proven results. Natural herbs for deep relief and pain-free living.",
      cta: "Try Now",
      pay_cta: "Order now · PayNow",
      shopee_cta: "View on Shopee",
      whatsapp_cta: "WhatsApp Us",
      chips: ["Warmth in 10 seconds", "One bottle lasts 3-4 months"],
      trust_badges: {
        users: "Trusted by 15,000+ Singaporeans",
        rating: "4.9 Star Rating",
        platforms: "Available on Multiple Platforms",
        years: "8 Years Running",
      },
    },
    testimonials_section: {
      title: "15,000+ Real User Stories",
      subtitle:
        "Stories of loyal customers: From skepticism to bulk buying, because it actually solved their long-standing pain problems. Now their whole family uses it and they recommend it to friends →",
      video_placeholder: {
        title: "Customer Videos",
        coming_soon: "Coming Soon",
      },
    },
    quote: {
      text: "After three weeks, my stiff shoulder loosened so much. The heat sensation is wonderful - it lasts longer than the medicated oil I used before.",
      author: "- Mdm. Tan, 62",
    },
    product_cta: {
      title: "Choose a package",
      price: "S$39",
      original_price: "S$49",
      offer: "Buy 3 Get 1 Free + Free Delivery",
      pay_cta: "Pay now with PayNow",
      cta: "WhatsApp Order",
      phone_cta: "Call to Order",
      guarantee: "30-Day Money-Back Guarantee",
    },
  },
}

/** Server-rendered product details for each language (components/product-details.tsx). */
type HomePageContentProps = { details: Record<"zh" | "en", ReactNode> }

export function HomePageContent({ details }: HomePageContentProps) {
  const { language, setLanguage } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [selectedPackageId, setSelectedPackageId] = useState<"single" | "bundle">("bundle")
  const t = content[language]

  // wa.me links must be digits-only (no "+"); tel: links keep the "+".
  const whatsappNumber = CONTACT.whatsappNumber
  const baseWhatsappMessage = "Hi! I'm interested in the HerbalBath Myrrh Spray and would like to order."
  const { getWhatsAppLink } = useReferral(baseWhatsappMessage)

  const LanguageToggle = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`flex items-center border rounded-full p-1 bg-background ${isMobile ? "text-base" : "text-sm"}`}>
      <Button
        variant={language === "zh" ? "secondary" : "ghost"}
        size="sm"
        className="rounded-full h-7 px-3 text-xs sm:text-sm"
        onClick={() => setLanguage("zh")}
      >
        中文
      </Button>
      <Button
        variant={language === "en" ? "secondary" : "ghost"}
        size="sm"
        className="rounded-full h-7 px-3 text-xs sm:text-sm"
        onClick={() => setLanguage("en")}
      >
        EN
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background font-sans pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 max-w-7xl">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="text-lg sm:text-xl md:text-2xl font-serif font-semibold text-gray-800 truncate min-w-0"
            >
              HerbalBath SG
            </a>
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-gray-600">
              <a href="#testimonials" className="hover:text-primary transition-colors text-sm xl:text-base">
                {t.nav.testimonials}
              </a>
              <a href="#details" className="hover:text-primary transition-colors text-sm xl:text-base">
                {t.nav.details}
              </a>
              <a href="#usage" className="hover:text-primary transition-colors text-sm xl:text-base">
                {t.nav.usage}
              </a>
              <a href="#product-cta" className="hover:text-primary transition-colors text-sm xl:text-base">
                {t.nav.buy}
              </a>
              <a href="/blog" className="hover:text-primary transition-colors text-sm xl:text-base">
                {t.nav.blog}
              </a>
            </nav>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden md:block">
                <LanguageToggle />
              </div>
              <Button
                className="hidden sm:flex bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9"
                onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
              >
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">{t.hero.whatsapp_cta}</span>
                <span className="sm:hidden">WA</span>
              </Button>
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 sm:h-9 sm:w-9">
                    <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[280px] sm:w-[350px]">
                  <div className="flex flex-col space-y-4 mt-6 text-base sm:text-lg">
                    <a
                      href="#testimonials"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 border-b border-gray-100"
                    >
                      {t.nav.testimonials}
                    </a>
                    <a href="#details" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-100">
                      {t.nav.details}
                    </a>
                    <a href="#usage" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-100">
                      {t.nav.usage}
                    </a>
                    <a href="#product-cta" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-100">
                      {t.nav.buy}
                    </a>
                    <a href="/blog" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-100">
                      {t.nav.blog}
                    </a>
                    <div className="pt-4">
                      <LanguageToggle isMobile />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero: the product itself, the price, and one obvious way to pay.
            Grid areas reorder it on phones to headline → product → price and
            buttons, so the bottle is on screen before anyone scrolls. */}
        <section className="relative overflow-hidden bg-[#FBF4E8]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-40 top-1/2 h-[44rem] w-[44rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(173,109,74,0.24),transparent_62%)]" />
            <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(97,151,137,0.16),transparent_60%)]" />
          </div>

          <div className="container relative mx-auto max-w-6xl px-4 py-8 sm:py-12 lg:py-16">
            <div className="grid items-center gap-x-12 gap-y-6 [grid-template-areas:'copy'_'image'_'actions'] lg:grid-cols-[1.1fr_0.9fr] lg:[grid-template-areas:'copy_image'_'actions_image']">
              <div className="text-center [grid-area:copy] lg:self-end lg:text-left">
                <div className="mb-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                  <span className="inline-block rounded-full bg-brand-700/10 px-4 py-2 text-sm font-semibold text-brand-700 sm:text-base">
                    {t.hero.badge}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
                    className="rounded-full border border-stone-300 bg-white/70 px-4 py-2 text-sm font-medium text-stone-700 md:hidden"
                  >
                    {language === "zh" ? "English" : "中文"}
                  </button>
                </div>
                <h1 className="font-serif text-stone-900">
                  <span className="block font-sans text-lg font-semibold tracking-wide text-brand-700 sm:text-xl">
                    {t.hero.product}
                  </span>
                  <span className="mt-2 block text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                    {t.hero.title}
                  </span>
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-stone-700 sm:text-xl lg:mx-0">
                  {t.hero.subtitle}
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-[22rem] [grid-area:image] sm:max-w-sm lg:max-w-md">
                <div aria-hidden="true" className="absolute inset-x-8 bottom-1 h-10 rounded-[100%] bg-[#462013]/25 blur-2xl" />
                <Image
                  src="/images/product-pack.webp"
                  alt={language === "zh" ? "HerbalBath 草本沐没药草本能量油 55ml 及包装盒" : "HerbalBath Myrrh Herbal Energy Oil, 55ml, with its box"}
                  width={738}
                  height={1186}
                  priority
                  sizes="(min-width: 1024px) 26rem, (min-width: 640px) 22rem, 70vw"
                  className="relative mx-auto h-[320px] w-auto sm:h-[400px] lg:h-[540px]"
                />
                {t.hero.chips.map((chip, i) => (
                  <span
                    key={chip}
                    className={`absolute rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-stone-800 shadow-md ring-1 ring-stone-200 sm:px-4 sm:py-2 sm:text-base ${
                      i === 0 ? "left-0 top-[16%]" : "bottom-[20%] right-0"
                    }`}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="[grid-area:actions] lg:self-start">
                <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2 lg:justify-start">
                  <span className="text-4xl font-bold text-brand-700 sm:text-5xl">{t.product_cta.price}</span>
                  <span className="text-xl text-stone-500 line-through">{t.product_cta.original_price}</span>
                  <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white sm:text-base">
                    {t.product_cta.offer}
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    href="/pay?b=bundle"
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-7 text-lg font-semibold text-white shadow-lg shadow-emerald-900/20 transition-colors hover:bg-emerald-800"
                  >
                    <QrCode className="h-6 w-6" />
                    {t.hero.pay_cta}
                  </Link>
                  <button
                    type="button"
                    onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-green-600 bg-white px-7 text-lg font-semibold text-green-700 transition-colors hover:bg-green-50"
                  >
                    <MessageCircle className="h-6 w-6" />
                    {t.hero.whatsapp_cta}
                  </button>
                </div>
                <p className="mt-3 text-center text-base lg:text-left">
                  <a
                    href={SHOPEE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-orange-600 underline-offset-4 hover:underline"
                  >
                    {t.hero.shopee_cta} →
                  </a>
                </p>

                <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-base text-stone-700 lg:justify-start">
                  <li className="flex items-center gap-1.5">
                    <Stars />
                    {t.hero.trust_badges.rating}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Users className="h-5 w-5 text-emerald-700" />
                    {t.hero.trust_badges.users}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Award className="h-5 w-5 text-emerald-700" />
                    {t.hero.trust_badges.years}
                  </li>
                </ul>
                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-stone-600 lg:justify-start">
                  {PLATFORMS.map(([src, alt]) => (
                    <Image key={alt} src={src} alt={alt} width={20} height={20} className="h-5 w-5 rounded-sm" />
                  ))}
                  <span>{t.hero.trust_badges.platforms}</span>
                </div>
              </div>
            </div>

            {/* Real customer quote, the one authentic testimonial quote on the
                site, kept as text (not a faded screenshot) for contrast with a
                55+ audience. */}
            <figure className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/80 px-5 py-4 text-center shadow-sm ring-1 ring-stone-200">
              <div className="mb-1 flex justify-center">
                <Stars />
              </div>
              <blockquote className="text-base italic leading-relaxed text-stone-700 sm:text-lg">
                "{t.quote.text}"
              </blockquote>
              <figcaption className="mt-1.5 text-sm font-semibold text-stone-500 sm:text-base">
                {t.quote.author}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                {t.testimonials_section.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                {t.testimonials_section.subtitle}
              </p>
            </div>
            <div className="px-3 sm:px-4">
              <TestimonialsCarousel
                screenshots={testimonialImages}
                videos={realVideoTestimonials}
                videoPlaceholder={{
                  title: t.testimonials_section.video_placeholder.title,
                  comingSoon: t.testimonials_section.video_placeholder.coming_soon,
                }}
                showViewAllButton={true}
              />
            </div>
          </div>
        </section>

        {details[language]}

        {/* Choosing a package: the end of the product column, at the same width. */}
        <section id="product-cta" className="scroll-mt-16 bg-cream px-0 pb-12 sm:px-4 sm:pb-16">
          <div className="mx-auto max-w-[600px] bg-white px-5 py-9 ring-1 ring-stone-200 sm:rounded-3xl sm:px-8 sm:py-10">
            <h2 className="text-center font-serif text-3xl font-bold text-brand-800 sm:text-4xl">{t.product_cta.title}</h2>
            <div className="mt-4 flex justify-center">
              <MonthlyOfferCountdown language={language} />
            </div>
            <div className="mt-7">
              <BundleSelector
                language={language}
                onSelect={(label, id) => {
                  setSelectedPackage(label)
                  setSelectedPackageId(id)
                }}
              />
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={`/pay?b=${selectedPackageId}`}
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 text-lg font-semibold text-white shadow-lg shadow-emerald-900/20 transition-colors hover:bg-emerald-800"
              >
                <QrCode className="h-6 w-6" />
                {t.product_cta.pay_cta}
              </Link>
              <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      getWhatsAppLink(
                        whatsappNumber,
                        selectedPackage ? `(${language === "zh" ? "套餐" : "Package"}: ${selectedPackage})` : undefined,
                      ),
                      "_blank",
                    )
                  }
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-green-600 bg-white text-base font-semibold text-green-700 transition-colors hover:bg-green-50"
                >
                  <MessageCircle className="h-5 w-5" />
                  {t.product_cta.cta}
                </button>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-stone-300 bg-white text-base font-semibold text-stone-700 transition-colors hover:bg-stone-50"
                >
                  <Phone className="h-5 w-5" />
                  {t.product_cta.phone_cta}
                </a>
              </div>
            </div>
            <p className="mt-6 text-center text-base font-semibold text-brand-800">{t.product_cta.guarantee}</p>
            <div className="mt-3 flex justify-center">
              <ReorderReminderButton language={language} />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection language={language} />

        {/* Further reading: plain links, for readers and for search */}
        <section className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-[600px] px-5">
            <h2 className="font-serif text-2xl font-bold text-brand-800 md:text-3xl">
              {language === "zh" ? "健康知识" : "Health journal"}
            </h2>
            <p className="mt-2 text-base text-stone-600">
              {language === "zh" ? "专为新加坡乐龄人士编写的健康指南" : "Health guides written for Singapore seniors"}
            </p>
            <ul className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
              {READING.map((article) => (
                <li key={article.href}>
                  <Link href={article.href} className="group block py-4">
                    <span className="text-lg font-semibold text-stone-900 transition-colors group-hover:text-brand-700">
                      {article.title}
                    </span>
                    <span className="mt-1 block text-base text-stone-600">{article.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/blog"
              className="mt-5 inline-flex items-center text-lg font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              {language === "zh" ? "阅读更多健康文章" : "Read more articles"} →
            </Link>
          </div>
        </section>
      </main>

      {/* Enhanced Footer with Internal Links for SEO */}
      <footer className="py-10 sm:py-12 bg-stone-100 border-t">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* About */}
            <div>
              <h3 className="font-bold text-emerald-800 mb-4 text-lg">HerbalBath SG</h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-3">
                {language === "zh" 
                  ? "新加坡天然草药疼痛缓解品牌。8年品质保证，15,000+用户信赖。"
                  : "Singapore's natural herbal pain relief brand. 8 years quality assurance, trusted by 15,000+ users."}
              </p>
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <Phone className="h-4 w-4" />
                <a href="tel:+6584261225" className="hover:underline">8426 1225</a>
              </div>
            </div>

            {/* Pain Points */}
            <div>
              <h3 className="font-bold text-emerald-800 mb-4 text-lg">
                {language === "zh" ? "疼痛问题" : "Pain Points"}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/pain-points/knee-pain" className="text-stone-600 hover:text-emerald-600 transition-colors">
                    膝盖疼痛 Knee Pain
                  </Link>
                </li>
                <li>
                  <Link href="/pain-points/back-pain" className="text-stone-600 hover:text-emerald-600 transition-colors">
                    腰酸背痛 Back Pain
                  </Link>
                </li>
                <li>
                  <Link href="/pain-points/joint-arthritis" className="text-stone-600 hover:text-emerald-600 transition-colors">
                    风湿关节炎 Arthritis
                  </Link>
                </li>
                <li>
                  <Link href="/pain-points/neck-shoulder-stiffness" className="text-stone-600 hover:text-emerald-600 transition-colors">
                    肩颈僵硬 Neck Pain
                  </Link>
                </li>
                <li>
                  <Link href="/pain-points" className="text-emerald-700 hover:text-emerald-600 font-medium transition-colors">
                    {language === "zh" ? "查看全部 →" : "View All →"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Health Articles */}
            <div>
              <h3 className="font-bold text-emerald-800 mb-4 text-lg">
                {language === "zh" ? "健康知识" : "Health Articles"}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog/knee-pain-relief-singapore" className="text-stone-600 hover:text-emerald-600 transition-colors">
                    膝盖痛缓解指南
                  </Link>
                </li>
                <li>
                  <Link href="/blog/myrrh-frankincense-miracle-herbs" className="text-stone-600 hover:text-emerald-600 transition-colors">
                    没药乳香的功效
                  </Link>
                </li>
                <li>
                  <Link href="/blog/anti-inflammatory-diet-guide" className="text-stone-600 hover:text-emerald-600 transition-colors">
                    抗炎饮食指南
                  </Link>
                </li>
                <li>
                  <Link href="/blog/gentle-exercises-for-seniors" className="text-stone-600 hover:text-emerald-600 transition-colors">
                    乐龄温和运动
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-emerald-700 hover:text-emerald-600 font-medium transition-colors">
                    {language === "zh" ? "查看全部 →" : "View All →"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-emerald-800 mb-4 text-lg">
                {language === "zh" ? "快速链接" : "Quick Links"}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-stone-600 hover:text-emerald-600 transition-colors">
                    {language === "zh" ? "首页 Home" : "Home"}
                  </Link>
                </li>
                <li>
                  <Link href="/pay" className="text-stone-600 hover:text-emerald-600 transition-colors">
                    {language === "zh" ? "PayNow 付款" : "Pay with PayNow"}
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" className="text-stone-600 hover:text-emerald-600 transition-colors">
                    {language === "zh" ? "客户评价 Reviews" : "Testimonials"}
                  </Link>
                </li>
                <li>
                  <Link href="/partner" className="text-stone-600 hover:text-emerald-600 transition-colors">
                    {language === "zh" ? "成为合作伙伴" : "Partner Program"}
                  </Link>
                </li>
                <li>
                  <a href="#faq" className="text-stone-600 hover:text-emerald-600 transition-colors">
                    {language === "zh" ? "常见问题 FAQ" : "FAQ"}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Ecommerce Platform Logos */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 py-6 border-t border-stone-200">
            <span className="text-sm font-medium text-stone-600">
              {language === "zh" ? "购买渠道：" : "Available on:"}
            </span>
            <div className="flex items-center gap-4">
              {PLATFORMS.map(([src, alt]) => (
                <Image key={alt} src={src} alt={alt} width={32} height={32} className="h-7 w-7 sm:h-8 sm:w-8" />
              ))}
            </div>
          </div>

          {/* Copyright and SEO Text */}
          <div className="text-center pt-6 border-t border-stone-200">
            <p className="text-sm text-stone-500">
              &copy; {new Date().getFullYear()} HerbalBath SG. All Rights Reserved.
            </p>
            <p className="text-xs text-stone-400 mt-2">
              HerbalBath | Herbal Bath Singapore | HerbalBath SG | 新加坡天然草药疼痛缓解 | Natural Herbal Pain Relief
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button - desktop only; mobile uses the sticky call+WhatsApp bar below */}
      <div className="hidden md:block fixed bottom-4 right-4 z-50">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 md:w-16 md:h-16 bg-green-500 hover:bg-green-600 shadow-2xl animate-pulse-green"
          onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
        >
          <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />
        </Button>
      </div>

      <StickyMobileCTA
        onWhatsAppClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
        whatsappLabel="WhatsApp"
        callLabel={language === "zh" ? "立即拨打" : "Call Now"}
        payHref="/pay?b=bundle"
        payLabel={language === "zh" ? "PayNow 付款" : "Pay now"}
      />
    </div>
  )
}
