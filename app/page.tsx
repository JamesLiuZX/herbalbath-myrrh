"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  MessageCircle,
  Menu,
  Phone,
  Flame,
  Leaf,
  CalendarDays,
  ShieldCheck,
  Truck,
  Award,
  Star,
  ChevronRight,
  Droplets,
  Sparkles,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useReferral } from "@/app/hooks/useReferral"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { testimonialImages } from "@/app/lib/testimonial-data"
import { FAQSection } from "@/components/faq-section"
import { StickyMobileCTA } from "@/components/sticky-mobile-cta"
import { BundleSelector } from "@/components/bundle-selector"
import { ReorderReminderButton } from "@/components/reorder-reminder-button"

// Real customer videos (same source as /testimonials).
const realVideoTestimonials = [
  { youtubeId: "hkTuQsdXSrQ", title: "客户见证合集 (第一集)" },
  { youtubeId: "nMsJT527FWY", title: "客户见证合集 (第二集)" },
]

// Homepage shows a curated subset of testimonial screenshots; the full set
// lives on /testimonials. Fewer, larger tiles load faster on mobile and read
// better for a 55+ audience than a wall of screenshots.
const homepageTestimonialImages = testimonialImages.slice(0, 6)

const SHOPEE_URL =
  "https://shopee.sg/Myrrh-Soreness-Muscle-Relief-Spray-Herbalbath-Singapore-i.177895131.41413960917"

const useLanguage = () => {
  const [language, setLanguage] = useState<"zh" | "en">("zh")

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-SG" : "en-SG"
  }, [language])

  return { language, setLanguage }
}

const content = {
  zh: {
    nav: {
      testimonials: "用户见证",
      usage: "使用方法",
      order: "价格订购",
      faq: "常见问题",
      blog: "健康知识",
      menu: "菜单",
    },
    hero: {
      eyebrow: "新加坡草本品牌 · 自2016年",
      title_line1: "关节肌肉酸痛？",
      title_line2: "喷一喷，10秒感受温热",
      subtitle: "天然没药与乳香草本配方，适合乐龄人士的关节与肌肉日常保养。",
      rating: "4.9分",
      rating_users: "15,000+ 新加坡用户信赖",
      bullets: [
        { icon: Flame, text: "喷后约10秒感受温热舒缓" },
        { icon: Leaf, text: "天然草本配方，无化学添加" },
        { icon: CalendarDays, text: "一瓶可用3-4个月（每日2次）" },
      ],
      price_label: "每瓶",
      price: "S$39",
      bundle_badge: "买3送1 · 4瓶 S$117",
      delivery_note: "全岛免费送货",
      cta_whatsapp: "WhatsApp 订购",
      cta_shopee: "在 Shopee 购买",
      whatsapp_hint: "按下后会打开 WhatsApp，订购信息已为您准备好。",
      call_prefix: "或拨打电话订购：",
      guarantee: "30天不满意退款",
      cod: "支持货到付款",
      product_caption: "没药舒缓喷雾 · 60ml",
    },
    trust: [
      { icon: Award, title: "8年新加坡品牌", desc: "自2016年服务本地家庭" },
      { icon: Star, title: "4.9星 · 15,000+用户", desc: "真实回购与口碑推荐" },
      { icon: ShieldCheck, title: "30天退款保证", desc: "不满意全额退款" },
    ],
    pains: {
      title: "哪里酸痛？",
      subtitle: "每天被酸痛困扰，做什么都不自在。这些常见部位，都适合用没药喷雾日常保养。",
      items: [
        { zh: "膝盖疼痛", en: "Knee Pain", href: "/pain-points/knee-pain" },
        { zh: "腰酸背痛", en: "Back Pain", href: "/pain-points/back-pain" },
        { zh: "肩颈僵硬", en: "Neck & Shoulder", href: "/pain-points/neck-shoulder-stiffness" },
        { zh: "风湿关节", en: "Arthritis", href: "/pain-points/joint-arthritis" },
      ],
      view_all: "查看全部疼痛问题",
    },
    usage: {
      title: "使用方法",
      subtitle: "三个步骤，简单易记",
      steps: [
        { title: "喷", desc: "距离皮肤5-10公分，直接喷在酸痛部位。" },
        { title: "按", desc: "立即用手掌覆盖按压10秒，帮助温热渗透。" },
        { title: "坚持", desc: "每日早晚各一次，持续使用效果更好。" },
      ],
      note_title: "外用须知",
      note: "本产品仅供外用。初次使用请先在小面积皮肤试用；皮肤破损处请勿使用；如正在服药或有特殊健康状况，请先咨询医生。",
    },
    ingredients: {
      title: "成分与原理",
      intro: "没药与乳香——两千年来备受珍视的两种天然树脂，我们把这份传统智慧做成方便日常使用的喷雾。",
      items: [
        {
          icon: Droplets,
          name: "没药 Myrrh",
          desc: "自古流传的珍贵香料，温热渗透，带来持久舒适感。",
        },
        {
          icon: Sparkles,
          name: "乳香 Frankincense",
          desc: "传统外用配方的核心成分，用于筋骨与关节的日常保养。",
        },
      ],
      mechanism: "采用现代萃取技术，草本精华更易吸收——喷后约10秒即可感受温热。",
      tag: "100%天然成分 · 无化学添加",
    },
    testimonials_section: {
      title: "15,000+ 用户真实见证",
      subtitle: "来自 WhatsApp 的真实反馈与回购记录。",
      quote: "用了三周，僵硬的肩膀松了很多，抬手很轻松。那种热感真的很舒服，比我之前用的药油持久！",
      quote_author: "陈女士，62岁",
    },
    order: {
      title: "价格与订购",
      choose_package: "请选择您的套餐",
      how_title: "如何订购",
      steps: [
        { title: "下单", desc: "WhatsApp 或电话告诉我们数量和地址" },
        { title: "送货", desc: "全岛免费送货上门" },
        { title: "付款", desc: "收货时货到付款，安心方便" },
      ],
      cta_whatsapp: "WhatsApp 订购",
      cta_phone: "电话订购 8426 1225",
      guarantee: "30天不满意，全额退款保证",
      gift_note: "替爸妈订购？告诉我们收件地址，我们直接送到府上。",
      platforms_label: "也可在这些平台购买：",
    },
    final_cta: {
      title: "让身体轻松一点",
      subtitle: "试试15,000+新加坡用户选择的没药喷雾，30天不满意退款。",
      cta: "WhatsApp 订购",
    },
    footer: {
      about:
        "新加坡天然草药舒缓品牌。8年品质保证，15,000+用户信赖。",
      pains: "疼痛问题",
      articles: "健康知识",
      links: "快速链接",
      home: "首页",
      reviews: "客户评价",
      partner: "成为合作伙伴",
      faq: "常见问题",
      view_all: "查看全部 →",
      platforms: "购买渠道：",
    },
  },
  en: {
    nav: {
      testimonials: "Reviews",
      usage: "How to Use",
      order: "Price & Order",
      faq: "FAQ",
      blog: "Health Guides",
      menu: "Menu",
    },
    hero: {
      eyebrow: "Singapore Herbal Brand · Since 2016",
      title_line1: "Sore joints and muscles?",
      title_line2: "Spray on warmth in 10 seconds",
      subtitle: "Natural myrrh & frankincense herbal spray for everyday joint and muscle care, made for seniors.",
      rating: "4.9 stars",
      rating_users: "Trusted by 15,000+ Singaporeans",
      bullets: [
        { icon: Flame, text: "Feel soothing warmth in about 10 seconds" },
        { icon: Leaf, text: "Natural herbal formula, no chemical additives" },
        { icon: CalendarDays, text: "One bottle lasts 3-4 months (twice daily)" },
      ],
      price_label: "Per bottle",
      price: "S$39",
      bundle_badge: "Buy 3 Get 1 Free · 4 bottles S$117",
      delivery_note: "Free island-wide delivery",
      cta_whatsapp: "Order on WhatsApp",
      cta_shopee: "Buy on Shopee",
      whatsapp_hint: "Tapping opens WhatsApp with your order message already written.",
      call_prefix: "Or call to order: ",
      guarantee: "30-day money-back guarantee",
      cod: "Cash on delivery available",
      product_caption: "Myrrh Soreness Relief Spray · 60ml",
    },
    trust: [
      { icon: Award, title: "8 Years in Singapore", desc: "Serving local families since 2016" },
      { icon: Star, title: "4.9 Stars · 15,000+ Users", desc: "Real repeat customers" },
      { icon: ShieldCheck, title: "30-Day Guarantee", desc: "Full refund if not satisfied" },
    ],
    pains: {
      title: "Where does it ache?",
      subtitle: "Daily aches make everything harder. The spray suits everyday care for these common areas.",
      items: [
        { zh: "膝盖疼痛", en: "Knee Pain", href: "/pain-points/knee-pain" },
        { zh: "腰酸背痛", en: "Back Pain", href: "/pain-points/back-pain" },
        { zh: "肩颈僵硬", en: "Neck & Shoulder", href: "/pain-points/neck-shoulder-stiffness" },
        { zh: "风湿关节", en: "Arthritis", href: "/pain-points/joint-arthritis" },
      ],
      view_all: "View all pain points",
    },
    usage: {
      title: "How to Use",
      subtitle: "Three simple steps",
      steps: [
        { title: "Spray", desc: "Hold 5-10cm from the skin and spray on the sore area." },
        { title: "Press", desc: "Cover with your palm and press for 10 seconds to help the warmth sink in." },
        { title: "Repeat", desc: "Use twice daily, morning and night, for best results." },
      ],
      note_title: "For External Use",
      note: "For external use only. Patch-test on a small area first; do not use on broken skin. If you take medication or have a health condition, please check with your doctor first.",
    },
    ingredients: {
      title: "Ingredients & How It Works",
      intro:
        "Myrrh and frankincense — two natural resins treasured for over two thousand years, made easy to use as a daily spray.",
      items: [
        {
          icon: Droplets,
          name: "Myrrh 没药",
          desc: "A resin treasured since antiquity. Warms on contact for lasting comfort.",
        },
        {
          icon: Sparkles,
          name: "Frankincense 乳香",
          desc: "A core ingredient in traditional topical formulas for everyday joint and muscle care.",
        },
      ],
      mechanism: "Modern extraction makes the herbal formula easy to absorb — feel the warmth about 10 seconds after spraying.",
      tag: "100% natural ingredients · No chemical additives",
    },
    testimonials_section: {
      title: "15,000+ Real Customer Stories",
      subtitle: "Real feedback and repeat orders from WhatsApp.",
      quote:
        "After three weeks, my stiff shoulder loosened so much. The warmth feels wonderful and lasts longer than the medicated oil I used before.",
      quote_author: "Mdm. Tan, 62",
    },
    order: {
      title: "Price & Order",
      choose_package: "Choose your package",
      how_title: "How to Order",
      steps: [
        { title: "Order", desc: "WhatsApp or call us with your quantity and address" },
        { title: "Delivery", desc: "Free delivery to your door, island-wide" },
        { title: "Payment", desc: "Pay cash on delivery — simple and safe" },
      ],
      cta_whatsapp: "Order on WhatsApp",
      cta_phone: "Call 8426 1225",
      guarantee: "30-day money-back guarantee",
      gift_note: "Ordering for your parents? Give us their address and we'll deliver straight to them.",
      platforms_label: "Also available on:",
    },
    final_cta: {
      title: "Move a Little Easier",
      subtitle: "Try the myrrh spray chosen by 15,000+ Singaporeans. 30-day money-back guarantee.",
      cta: "Order on WhatsApp",
    },
    footer: {
      about: "Singapore's natural herbal soothing brand. 8 years of quality, trusted by 15,000+ users.",
      pains: "Pain Points",
      articles: "Health Guides",
      links: "Quick Links",
      home: "Home",
      reviews: "Reviews",
      partner: "Partner Program",
      faq: "FAQ",
      view_all: "View All →",
      platforms: "Available on:",
    },
  },
}

export default function HomePage() {
  const { language, setLanguage } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const t = content[language]

  const whatsappNumber = "+6584261225"
  const baseWhatsappMessage = "Hi! I'm interested in the HerbalBath Myrrh Spray and would like to order."
  const { getWhatsAppLink } = useReferral(baseWhatsappMessage)

  const openWhatsApp = (extraContext?: string) =>
    window.open(getWhatsAppLink(whatsappNumber, extraContext), "_blank")

  const LanguageToggle = () => (
    <div className="flex items-center border-2 border-stone-200 rounded-full p-1 bg-white">
      <Button
        variant={language === "zh" ? "secondary" : "ghost"}
        size="sm"
        className={`rounded-full h-9 px-4 text-base font-medium ${
          language === "zh" ? "bg-emerald-700 text-white hover:bg-emerald-700" : "text-stone-600"
        }`}
        onClick={() => setLanguage("zh")}
      >
        中文
      </Button>
      <Button
        variant={language === "en" ? "secondary" : "ghost"}
        size="sm"
        className={`rounded-full h-9 px-4 text-base font-medium ${
          language === "en" ? "bg-emerald-700 text-white hover:bg-emerald-700" : "text-stone-600"
        }`}
        onClick={() => setLanguage("en")}
      >
        English
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background font-sans pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200">
        <div className="container mx-auto px-3 sm:px-4 py-2.5 max-w-7xl">
          <div className="flex items-center justify-between gap-2">
            <a href="/" className="flex items-center gap-2 min-w-0">
              <Image
                src="/images/logo.png"
                alt="HerbalBath 草本沐"
                width={40}
                height={40}
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-contain flex-shrink-0"
              />
              <span className="text-lg sm:text-xl font-serif font-semibold text-emerald-900 truncate">
                HerbalBath <span className="whitespace-nowrap">草本沐</span>
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-stone-700">
              <a href="#testimonials" className="hover:text-emerald-700 text-base py-2">
                {t.nav.testimonials}
              </a>
              <a href="#usage" className="hover:text-emerald-700 text-base py-2">
                {t.nav.usage}
              </a>
              <a href="#order" className="hover:text-emerald-700 text-base py-2">
                {t.nav.order}
              </a>
              <a href="#faq" className="hover:text-emerald-700 text-base py-2">
                {t.nav.faq}
              </a>
              <Link href="/blog" className="hover:text-emerald-700 text-base py-2">
                {t.nav.blog}
              </Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="tel:+6584261225"
                className="hidden xl:flex items-center gap-2 text-emerald-800 font-bold text-lg hover:underline underline-offset-4"
              >
                <Phone className="w-5 h-5" />
                8426 1225
              </a>
              <div className="hidden md:block">
                <LanguageToggle />
              </div>
              <Button
                className="hidden sm:flex bg-green-700 hover:bg-green-800 text-white text-base px-4 h-11"
                onClick={() => openWhatsApp()}
              >
                <MessageCircle className="w-5 h-5 mr-1.5" />
                WhatsApp
              </Button>
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden h-11 px-3 text-base gap-1.5">
                    <Menu className="h-5 w-5" />
                    {t.nav.menu}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[350px]">
                  <div className="flex flex-col space-y-1 mt-8 text-xl">
                    <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="py-3.5 border-b border-stone-100">
                      {t.nav.testimonials}
                    </a>
                    <a href="#usage" onClick={() => setIsMenuOpen(false)} className="py-3.5 border-b border-stone-100">
                      {t.nav.usage}
                    </a>
                    <a href="#order" onClick={() => setIsMenuOpen(false)} className="py-3.5 border-b border-stone-100">
                      {t.nav.order}
                    </a>
                    <a href="#faq" onClick={() => setIsMenuOpen(false)} className="py-3.5 border-b border-stone-100">
                      {t.nav.faq}
                    </a>
                    <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="py-3.5 border-b border-stone-100">
                      {t.nav.blog}
                    </Link>
                    <a
                      href="tel:+6584261225"
                      className="py-3.5 border-b border-stone-100 flex items-center gap-2 text-emerald-800 font-bold"
                    >
                      <Phone className="w-5 h-5" />
                      8426 1225
                    </a>
                    <div className="pt-5">
                      <LanguageToggle />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ============ HERO: product-first fold ============ */}
        <section className="bg-gradient-to-b from-secondary/70 to-background border-b border-stone-100">
          <div className="container mx-auto px-4 max-w-7xl py-8 sm:py-10 lg:py-16">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center">
              {/* Text + CTA column */}
              <div className="text-center lg:text-left order-1">
                <span className="inline-block bg-emerald-100 text-emerald-900 px-4 py-1.5 rounded-full text-base font-medium mb-4">
                  {t.hero.eyebrow}
                </span>

                <h1 className="font-bold text-stone-900 leading-tight mb-4 text-balance text-[1.75rem] xs:text-3xl sm:text-4xl lg:text-5xl">
                  {t.hero.title_line1}
                  <br />
                  <span className="text-emerald-800">{t.hero.title_line2}</span>
                </h1>

                <p className="text-lg md:text-xl text-stone-700 leading-relaxed mb-4 max-w-xl mx-auto lg:mx-0 text-pretty">
                  {t.hero.subtitle}
                </p>

                {/* Rating line */}
                <a
                  href="#testimonials"
                  className="inline-flex items-center gap-2 mb-6 text-stone-800 hover:text-emerald-800"
                >
                  <span className="flex" aria-hidden="true">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                    ))}
                  </span>
                  <span className="text-base sm:text-lg font-semibold underline underline-offset-4 decoration-stone-300">
                    {t.hero.rating} · {t.hero.rating_users}
                  </span>
                </a>

                {/* Product image — mobile position: right after the headline */}
                <div className="lg:hidden mb-6">
                  <ProductImageCard t={t} priority />
                </div>

                {/* Benefit bullets */}
                <ul className="space-y-3 mb-6 max-w-md mx-auto lg:mx-0 text-left">
                  {t.hero.bullets.map((b, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <b.icon className="w-5 h-5 text-emerald-800" />
                      </span>
                      <span className="text-lg text-stone-800">{b.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Price row */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base text-stone-600">{t.hero.price_label}</span>
                    <span className="text-4xl sm:text-5xl font-bold text-emerald-800">{t.hero.price}</span>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="bg-red-600 text-white text-base font-bold px-3 py-1 rounded-full">
                      {t.hero.bundle_badge}
                    </span>
                    <span className="text-base text-stone-700 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      {t.hero.delivery_note}
                    </span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-3">
                  <Button
                    size="lg"
                    className="bg-green-700 hover:bg-green-800 text-white text-lg font-semibold h-14 px-8 w-full sm:w-auto rounded-xl"
                    onClick={() => openWhatsApp()}
                  >
                    <MessageCircle className="w-6 h-6 mr-2" />
                    {t.hero.cta_whatsapp}
                  </Button>
                  <Button
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold h-14 px-8 w-full sm:w-auto rounded-xl"
                    onClick={() => window.open(SHOPEE_URL, "_blank")}
                  >
                    {t.hero.cta_shopee}
                  </Button>
                </div>
                <p className="text-base text-stone-600 mb-3">{t.hero.whatsapp_hint}</p>

                <p className="text-lg text-stone-800 mb-4">
                  {t.hero.call_prefix}
                  <a
                    href="tel:+6584261225"
                    className="font-bold text-emerald-800 underline underline-offset-4 whitespace-nowrap"
                  >
                    8426 1225
                  </a>
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-base text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    {t.hero.guarantee}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-5 h-5 text-emerald-700" />
                    {t.hero.cod}
                  </span>
                </div>

                {/* Visible language switch for mobile, where the header
                    toggle is hidden — seniors shouldn't have to find the
                    menu to change language. */}
                <button
                  type="button"
                  className="md:hidden mt-5 text-lg text-emerald-800 font-medium underline underline-offset-4 py-2 px-3"
                  onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
                >
                  {language === "zh" ? "Switch to English" : "切换到中文"}
                </button>
              </div>

              {/* Product image — desktop column */}
              <div className="hidden lg:block order-2">
                <ProductImageCard t={t} priority />
              </div>
            </div>
          </div>
        </section>

        {/* ============ Trust strip ============ */}
        <section className="bg-white border-b border-stone-100">
          <div className="container mx-auto px-4 max-w-6xl py-6 sm:py-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {t.trust.map((item, i) => (
                <div key={i} className="flex items-center gap-3 justify-center sm:justify-start">
                  <span className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-emerald-800" />
                  </span>
                  <div className="text-left">
                    <p className="text-lg font-bold text-stone-900 leading-snug">{item.title}</p>
                    <p className="text-base text-stone-600 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ Pain areas (ailment-first) ============ */}
        <section className="py-10 sm:py-14">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="font-bold text-emerald-900 mb-3">{t.pains.title}</h2>
              <p className="text-lg text-stone-700 leading-relaxed">{t.pains.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {t.pains.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between gap-2 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl hover:bg-emerald-100 transition-colors"
                >
                  <span>
                    <span className="block text-xl font-bold text-emerald-900">{item.zh}</span>
                    <span className="block text-base text-stone-600">{item.en}</span>
                  </span>
                  <ChevronRight className="w-6 h-6 text-emerald-700 flex-shrink-0" />
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href="/pain-points"
                className="inline-flex items-center text-emerald-800 hover:text-emerald-600 font-semibold text-lg py-2 underline underline-offset-4 decoration-emerald-200"
              >
                {t.pains.view_all}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ============ How to use ============ */}
        <section id="usage" className="py-10 sm:py-14 bg-secondary/50 scroll-mt-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <h2 className="font-bold text-emerald-900 mb-3">{t.usage.title}</h2>
              <p className="text-lg text-stone-700">{t.usage.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {t.usage.steps.map((step, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm text-center">
                  <span className="mx-auto mb-4 w-14 h-14 rounded-full bg-emerald-800 text-white flex items-center justify-center text-2xl font-bold">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">{step.title}</h3>
                  <p className="text-lg text-stone-700 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 max-w-3xl mx-auto">
              <p className="text-lg font-bold text-stone-900 mb-1.5">{t.usage.note_title}</p>
              <p className="text-base text-stone-700 leading-relaxed">{t.usage.note}</p>
            </div>
          </div>
        </section>

        {/* ============ Ingredients & mechanism ============ */}
        <section id="ingredients" className="py-10 sm:py-14 scroll-mt-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <h2 className="font-bold text-emerald-900 mb-4">{t.ingredients.title}</h2>
              <p className="text-lg text-stone-700 leading-relaxed">{t.ingredients.intro}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 max-w-3xl mx-auto">
              {t.ingredients.items.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                  <span className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-emerald-800" />
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">{item.name}</h3>
                  <p className="text-lg text-stone-700 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center max-w-3xl mx-auto">
              <p className="text-lg text-stone-800 leading-relaxed mb-4">{t.ingredients.mechanism}</p>
              <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-900 text-base font-semibold px-4 py-2 rounded-full">
                <Leaf className="w-5 h-5" />
                {t.ingredients.tag}
              </span>
            </div>
          </div>
        </section>

        {/* ============ Testimonials ============ */}
        <section id="testimonials" className="py-10 sm:py-14 bg-secondary/50 scroll-mt-20">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="font-bold text-emerald-900 mb-3">{t.testimonials_section.title}</h2>
              <p className="text-lg text-stone-700">{t.testimonials_section.subtitle}</p>
            </div>

            {/* Featured quote (same real quote referenced in product schema) */}
            <figure className="max-w-2xl mx-auto mb-8 bg-white rounded-2xl border-l-4 border-emerald-700 shadow-sm p-6">
              <span className="flex mb-2" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                ))}
              </span>
              <blockquote className="text-lg sm:text-xl text-stone-800 leading-relaxed mb-3">
                "{t.testimonials_section.quote}"
              </blockquote>
              <figcaption className="text-base font-semibold text-stone-600">
                — {t.testimonials_section.quote_author}
              </figcaption>
            </figure>

            <TestimonialsCarousel
              screenshots={homepageTestimonialImages}
              videos={realVideoTestimonials}
              videoPlaceholder={{ title: "客户使用视频", comingSoon: "即将上线" }}
              showViewAllButton={true}
            />
          </div>
        </section>

        {/* ============ Price & order ============ */}
        <section id="order" className="py-10 sm:py-16 scroll-mt-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-3xl border-2 border-emerald-100 shadow-lg p-5 sm:p-8 md:p-10">
              <div className="text-center mb-6">
                <h2 className="font-bold text-emerald-900 mb-2">{t.order.title}</h2>
                <p className="text-lg text-stone-700">{t.order.choose_package}</p>
              </div>

              <div className="max-w-2xl mx-auto mb-8">
                <BundleSelector language={language} onSelect={setSelectedPackage} />
              </div>

              {/* How ordering works — numbered, explicit */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-stone-900 text-center mb-4">{t.order.how_title}</h3>
                <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  {t.order.steps.map((step, index) => (
                    <li key={index} className="flex md:flex-col items-center md:text-center gap-3 bg-stone-50 rounded-2xl p-4">
                      <span className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span>
                        <span className="block text-lg font-bold text-stone-900">{step.title}</span>
                        <span className="block text-base text-stone-700">{step.desc}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-col gap-3 max-w-md mx-auto mb-5">
                <Button
                  size="lg"
                  className="bg-green-700 hover:bg-green-800 text-white text-lg font-semibold h-14 w-full rounded-xl"
                  onClick={() =>
                    openWhatsApp(
                      selectedPackage ? `(${language === "zh" ? "套餐" : "Package"}: ${selectedPackage})` : undefined,
                    )
                  }
                >
                  <MessageCircle className="w-6 h-6 mr-2" />
                  {t.order.cta_whatsapp}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg font-semibold h-14 w-full rounded-xl border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-50 bg-white"
                  onClick={() => window.open("tel:+6584261225", "_self")}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {t.order.cta_phone}
                </Button>
                <p className="text-base text-stone-600 text-center">{t.hero.whatsapp_hint}</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center mb-5">
                <p className="text-lg font-bold text-emerald-900 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-6 h-6" />
                  {t.order.guarantee}
                </p>
              </div>

              <p className="text-base text-stone-700 text-center mb-6">{t.order.gift_note}</p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5 pt-5 border-t border-stone-100">
                <span className="text-base font-medium text-stone-600">{t.order.platforms_label}</span>
                <div className="flex items-center gap-4">
                  <a href={SHOPEE_URL} target="_blank" rel="noopener noreferrer" aria-label="Shopee">
                    <img src="/images/shopee-logo.png" alt="Shopee" className="h-8 w-8" />
                  </a>
                  <img src="/images/carousell-logo.png" alt="Carousell" className="h-8 w-8" />
                  <img src="/images/tiktok-shop-logo.png" alt="TikTok Shop" className="h-8 w-8" />
                  <img src="/images/facebook-logo.png" alt="Facebook" className="h-8 w-8" />
                </div>
              </div>

              <div className="text-center mt-5">
                <ReorderReminderButton language={language} />
              </div>
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <FAQSection language={language} />

        {/* ============ Health guides (SEO) ============ */}
        <section className="py-10 sm:py-14">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-8">
              <h2 className="font-bold text-emerald-900 mb-3 font-serif">
                {language === "zh" ? "健康知识库" : "Health Knowledge"}
              </h2>
              <p className="text-lg text-stone-600">
                {language === "zh"
                  ? "专为新加坡乐龄人士编写的健康指南"
                  : "Health guides written for Singapore seniors"}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
              <Link
                href="/blog/knee-pain-relief-singapore"
                className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-stone-100"
              >
                <h3 className="text-xl font-bold text-emerald-800 mb-2">膝盖痛缓解指南</h3>
                <p className="text-stone-600 text-base">10个帮助乐龄人士缓解膝盖疼痛的实用建议</p>
              </Link>
              <Link
                href="/blog/myrrh-frankincense-miracle-herbs"
                className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-stone-100"
              >
                <h3 className="text-xl font-bold text-emerald-800 mb-2">没药乳香的功效</h3>
                <p className="text-stone-600 text-base">探索这两种千年草药的历史与原理</p>
              </Link>
              <Link
                href="/blog/gentle-exercises-for-seniors"
                className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-stone-100"
              >
                <h3 className="text-xl font-bold text-emerald-800 mb-2">乐龄温和运动</h3>
                <p className="text-stone-600 text-base">5种最适合新加坡乐龄人士的安全运动</p>
              </Link>
            </div>
            <div className="text-center mt-6">
              <Link
                href="/blog"
                className="inline-flex items-center text-emerald-800 hover:text-emerald-600 font-semibold text-lg py-2 underline underline-offset-4 decoration-emerald-200"
              >
                {language === "zh" ? "阅读更多健康文章" : "Read More Articles"}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ============ Final CTA ============ */}
        <section className="py-12 sm:py-16 bg-emerald-800 text-white text-center">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-bold mb-4 text-white">{t.final_cta.title}</h2>
            <p className="text-lg sm:text-xl mb-8 leading-relaxed opacity-95">{t.final_cta.subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="bg-white text-emerald-900 hover:bg-stone-100 text-lg h-14 px-8 font-bold rounded-xl w-full sm:w-auto"
                onClick={() => openWhatsApp()}
              >
                <MessageCircle className="w-6 h-6 mr-2" />
                {t.final_cta.cta}
              </Button>
              <a
                href="tel:+6584261225"
                className="flex items-center justify-center gap-2 text-lg font-bold text-white underline underline-offset-4 h-14 px-6"
              >
                <Phone className="w-5 h-5" />
                8426 1225
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 sm:py-12 bg-stone-100 border-t">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="font-bold text-emerald-800 mb-4 text-lg">HerbalBath 草本沐</h3>
              <p className="text-stone-600 text-base leading-relaxed mb-3">{t.footer.about}</p>
              <a
                href="tel:+6584261225"
                className="flex items-center gap-2 text-emerald-800 font-bold text-lg hover:underline underline-offset-4"
              >
                <Phone className="h-5 w-5" />
                8426 1225
              </a>
            </div>

            <div>
              <h3 className="font-bold text-emerald-800 mb-4 text-lg">{t.footer.pains}</h3>
              <ul className="space-y-2.5 text-base">
                <li>
                  <Link href="/pain-points/knee-pain" className="text-stone-600 hover:text-emerald-600">
                    膝盖疼痛 Knee Pain
                  </Link>
                </li>
                <li>
                  <Link href="/pain-points/back-pain" className="text-stone-600 hover:text-emerald-600">
                    腰酸背痛 Back Pain
                  </Link>
                </li>
                <li>
                  <Link href="/pain-points/joint-arthritis" className="text-stone-600 hover:text-emerald-600">
                    风湿关节炎 Arthritis
                  </Link>
                </li>
                <li>
                  <Link href="/pain-points/neck-shoulder-stiffness" className="text-stone-600 hover:text-emerald-600">
                    肩颈僵硬 Neck Pain
                  </Link>
                </li>
                <li>
                  <Link href="/pain-points" className="text-emerald-700 hover:text-emerald-600 font-medium">
                    {t.footer.view_all}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-emerald-800 mb-4 text-lg">{t.footer.articles}</h3>
              <ul className="space-y-2.5 text-base">
                <li>
                  <Link href="/blog/knee-pain-relief-singapore" className="text-stone-600 hover:text-emerald-600">
                    膝盖痛缓解指南
                  </Link>
                </li>
                <li>
                  <Link href="/blog/myrrh-frankincense-miracle-herbs" className="text-stone-600 hover:text-emerald-600">
                    没药乳香的功效
                  </Link>
                </li>
                <li>
                  <Link href="/blog/anti-inflammatory-diet-guide" className="text-stone-600 hover:text-emerald-600">
                    抗炎饮食指南
                  </Link>
                </li>
                <li>
                  <Link href="/blog/gentle-exercises-for-seniors" className="text-stone-600 hover:text-emerald-600">
                    乐龄温和运动
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-emerald-700 hover:text-emerald-600 font-medium">
                    {t.footer.view_all}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-emerald-800 mb-4 text-lg">{t.footer.links}</h3>
              <ul className="space-y-2.5 text-base">
                <li>
                  <Link href="/" className="text-stone-600 hover:text-emerald-600">
                    {t.footer.home}
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" className="text-stone-600 hover:text-emerald-600">
                    {t.footer.reviews}
                  </Link>
                </li>
                <li>
                  <Link href="/partner" className="text-stone-600 hover:text-emerald-600">
                    {t.footer.partner}
                  </Link>
                </li>
                <li>
                  <a href="#faq" className="text-stone-600 hover:text-emerald-600">
                    {t.footer.faq}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 py-6 border-t border-stone-200">
            <span className="text-base font-medium text-stone-600">{t.footer.platforms}</span>
            <div className="flex items-center gap-4">
              <img src="/images/carousell-logo.png" alt="Carousell" className="h-8 w-8" />
              <img src="/images/tiktok-shop-logo.png" alt="TikTok Shop" className="h-8 w-8" />
              <img src="/images/facebook-logo.png" alt="Facebook" className="h-8 w-8" />
              <a href={SHOPEE_URL} target="_blank" rel="noopener noreferrer" aria-label="Shopee">
                <img src="/images/shopee-logo.png" alt="Shopee" className="h-8 w-8" />
              </a>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-stone-200">
            <p className="text-base text-stone-500">
              &copy; {new Date().getFullYear()} HerbalBath SG. All Rights Reserved.
            </p>
            <p className="text-sm text-stone-400 mt-2">
              HerbalBath | Herbal Bath Singapore | HerbalBath SG | 新加坡天然草药舒缓 | Natural Herbal Pain Relief
            </p>
            <p className="text-sm text-stone-300 mt-3">
              <Link href="/internal" rel="nofollow" className="hover:text-stone-500 transition-colors">
                Team
              </Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button — desktop only; mobile uses the sticky bar */}
      <div className="hidden md:block fixed bottom-5 right-5 z-50">
        <Button
          size="icon"
          aria-label="WhatsApp"
          className="rounded-full w-16 h-16 bg-green-700 hover:bg-green-800 shadow-xl"
          onClick={() => openWhatsApp()}
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
      </div>

      <StickyMobileCTA
        onWhatsAppClick={() => openWhatsApp()}
        whatsappLabel={t.hero.cta_whatsapp}
        callLabel={language === "zh" ? "拨打电话" : "Call Now"}
      />
    </div>
  )
}

// Product photo card used in the hero. Shown after the headline on mobile and
// as the right-hand column on desktop, with the price visible on the image so
// the first fold always answers "what is it, how much".
function ProductImageCard({
  t,
  priority = false,
}: {
  t: (typeof content)["zh"] | (typeof content)["en"]
  priority?: boolean
}) {
  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-sm lg:max-w-md">
      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-stone-200 bg-white">
        <Image
          src="/images/product-hero.png"
          alt="HerbalBath 没药舒缓喷雾 Myrrh Soreness Relief Spray"
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 640px) 340px, (max-width: 1023px) 384px, 448px"
        />
        <span className="absolute top-3 right-3 bg-emerald-800 text-white text-xl font-bold px-4 py-1.5 rounded-full shadow-md">
          {t.hero.price}
        </span>
      </div>
      <p className="text-center text-base text-stone-600 mt-3">{t.hero.product_caption}</p>
    </div>
  )
}
