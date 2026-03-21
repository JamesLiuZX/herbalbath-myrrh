"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Menu, Phone, Zap, Heart, Sparkles, Flame } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useReferral } from "@/app/hooks/useReferral"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { testimonialImages } from "@/app/lib/testimonial-data" // Import from the new data file
import { FAQSection } from "@/components/faq-section"
import Link from "next/link"

const useLanguage = () => {
  const [language, setLanguage] = useState<"zh" | "en">("zh")
  return { language, setLanguage }
}

const content = {
  zh: {
    nav: {
      testimonials: "真实见证",
      how_it_works: "神奇之源",
      benefits: "非凡功效",
      usage: "使用方法",
      blog: "健康知识",
    },
    hero: {
      badge: "千年智慧 • 天然疗愈",
      title: "告别疼痛,重获自由",
      subtitle: "没药喷雾，15,000+用户见证的神奇效果。天然草本，深层舒缓，让您重新享受无痛生活。",
      cta: "立即体验",
      shopee_cta: "Shopee购买",
      whatsapp_cta: "WhatsApp咨询",
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
    problems: {
      title: "其他产品让您失望了吗？",
      subtitle: "虎标万金油、止痛贴只能暂时缓解，我们的没药喷雾10秒见效，深层治愈！",
      items: [
        { icon: "⏰", title: "效果短暂", desc: "其他产品只能暂时缓解，疼痛很快复发" },
        { icon: "🎯", title: "治标不治本", desc: "表面麻痹，无法解决深层组织问题" },
        { icon: "🔥", title: "热感不足", desc: "温热感微弱，无法激活深层血液循环" },
        { icon: "💊", title: "化学成分", desc: "含有化学添加剂，长期使用有副作用" },
      ],
    },
    usage: {
      title: "正确使用方法 - 10秒见效",
      subtitle: "掌握正确方法，释放没药的神奇力量",
      methods: [
        {
          icon: "🌊",
          title: "直接喷雾法",
          desc: "直接喷在疼痛部位，10秒内感受热浪般的舒缓效果",
          steps: ["清洁患处皮肤", "距离5-10cm喷雾", "10秒内感受热感", "每日2次，持续3-4个月"],
        },
        {
          icon: "🔥",
          title: "热掌按压法",
          desc: "喷雾后用手掌按压10秒，热感如滚浪般深入，效果更强",
          steps: ["喷雾在疼痛部位", "立即用手掌覆盖", "按压10秒钟", "感受滚浪般热感深入"],
        },
      ],
      benefits: ["10秒内产生强烈热感", "深层渗透至筋骨组织", "解决风湿、关节炎根本问题", "一瓶可用3-4个月（每日2次）"],
      benefits_title: "为什么效果这么好？",
    },
    how_it_works: {
      title: "耶稣时代的神奇配方",
      intro: "没药与乳香，耶稣诞生时东方三博士的珍贵礼物。两千年来，这些'神迹之药'一直被视为超越西药的天然疗愈圣品。",
      story:
        "在古代，没药比黄金更珍贵，被称为'神的眼泪'。乳香则是'天堂的香气'，两者结合创造了无数医疗奇迹。现代科学证实了古人的智慧 - 这些天然成分的抗炎镇痛效果远超化学药物，且无副作用。",
      reasons: [
        {
          icon: Heart,
          title: "没药：神迹镇痛",
          desc: "耶稣时代的珍贵药材，深层渗透，瞬间激活血液循环，带来持久舒适。",
        },
        {
          icon: Zap,
          title: "乳香：天然消炎",
          desc: "古代'液体黄金'，强效抗炎，从根源解决风湿关节问题。",
        },
        {
          icon: Sparkles,
          title: "超强渗透配方",
          desc: "现代萃取技术，让古老药材发挥最大功效，10秒直达病灶。",
        },
      ],
    },
    benefits: {
      title: "为什么选择我们？",
      comparison: {
        title: "对比其他产品",
        items: [
          { feature: "见效时间", us: "10秒立即见效", others: "30分钟-数小时" },
          { feature: "热感强度", us: "滚浪般强烈热感", others: "微弱温热感" },
          { feature: "持续时间", us: "深层治愈，持久有效", others: "暂时缓解，易复发" },
          { feature: "成分安全", us: "100%天然草本", others: "含化学添加剂" },
          { feature: "使用周期", us: "一瓶用3-4个月", others: "消耗快，成本高" },
        ],
      },
      testimonial: {
        quote: "用了三周，僵硬的肩膀松了很多，抬手很轻松。那种热感真的很神奇，比虎标万金油强太多了！",
        author: "- 陈女士, 62岁",
      },
    },
    product_cta: {
      title: "限时特惠 - 立即订购",
      price: "$38",
      original_price: "$58",
      offer: "买3送1 + 免费送货",
      cta: "WhatsApp咨询",
      phone_cta: "电话订购",
      guarantee: "30天不满意，全额退款",
      features: ["✅ 10秒见效，深层治愈", "✅ 一瓶可用3-4个月", "✅ 100%天然成分", "✅ 买3送1优惠"],
    },
    final_cta: {
      title: "不要再忍受疼痛",
      subtitle: "15,000+用户已经重获新生，您还在等什么？今天就体验没药的神奇力量！",
      cta: "立即体验",
    },
  },
  en: {
    nav: {
      testimonials: "Testimonials",
      how_it_works: "How It Works",
      benefits: "Benefits",
      usage: "Usage Guide",
      blog: "Health Journal",
    },
    hero: {
      badge: "Ancient Wisdom • Natural Healing",
      title: "Say Goodbye to Pain",
      subtitle: "Myrrh Spray with 15,000+ proven results. Natural herbs for deep relief and pain-free living.",
      cta: "Try Now",
      shopee_cta: "View on Shopee",
      whatsapp_cta: "WhatsApp Us",
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
    problems: {
      title: "Tired of Products That Don't Work?",
      subtitle:
        "Tiger Balm and pain patches only provide temporary relief. Our Myrrh Spray works in 10 seconds with deep healing!",
      items: [
        { icon: "⏰", title: "Short-lived Relief", desc: "Other products only mask pain temporarily" },
        { icon: "🎯", title: "Surface Treatment", desc: "Only numbs surface, can't reach deep tissue issues" },
        { icon: "🔥", title: "Weak Heat", desc: "Insufficient warmth to activate deep circulation" },
        { icon: "💊", title: "Chemical Ingredients", desc: "Contains additives with potential side effects" },
      ],
    },
    usage: {
      title: "Proper Usage - 10 Second Results",
      subtitle: "Master the technique to unlock myrrh's miraculous power",
      methods: [
        {
          icon: "🌊",
          title: "Direct Spray Method",
          desc: "Spray directly on painful area, feel wave-like relief in 10 seconds",
          steps: [
            "Clean the affected area",
            "Spray 5-10cm away",
            "Feel heat within 10 seconds",
            "Use twice daily for 3-4 months",
          ],
        },
        {
          icon: "🔥",
          title: "Heat Palm Technique",
          desc: "Spray then press with palm for 10 seconds - intense rolling heat penetrates deeper",
          steps: [
            "Spray on painful area",
            "Cover immediately with palm",
            "Press for 10 seconds",
            "Feel rolling waves of heat penetrate",
          ],
        },
      ],
      benefits: [
        "Intense heat sensation within 10 seconds",
        "Deep penetration to muscle and bone",
        "Addresses root cause of arthritis & rheumatism",
        "One bottle lasts 3-4 months (twice daily)",
      ],
      benefits_title: "Why Is It So Effective?",
    },
    how_it_works: {
      title: "The Jesus-Era Miracle Formula",
      intro:
        "Myrrh and Frankincense - the precious gifts from the Three Wise Men at Jesus' birth. For two millennia, these 'miracle medicines' have been revered as natural healing treasures that surpass Western medicine.",
      story:
        "In ancient times, myrrh was more precious than gold, called 'God's Tears'. Frankincense was 'Heaven's Fragrance'. Together, they created countless medical miracles. Modern science confirms ancient wisdom - these natural compounds provide superior anti-inflammatory and pain relief compared to chemical drugs, with zero side effects.",
      reasons: [
        {
          icon: Heart,
          title: "Myrrh: Miraculous Relief",
          desc: "Precious medicine from Jesus' era, penetrates deeply, instantly activates circulation for lasting comfort.",
        },
        {
          icon: Zap,
          title: "Frankincense: Natural Anti-inflammatory",
          desc: "Ancient 'liquid gold', powerful anti-inflammatory that addresses rheumatic issues at the source.",
        },
        {
          icon: Sparkles,
          title: "Super-Penetration Formula",
          desc: "Modern extraction technology maximizes ancient medicine potency, reaching affected areas in 10 seconds.",
        },
      ],
    },
    benefits: {
      title: "Why Choose Us?",
      comparison: {
        title: "vs Other Products",
        items: [
          { feature: "Effect Time", us: "10 seconds immediate", others: "30 minutes - hours" },
          { feature: "Heat Intensity", us: "Rolling wave heat", others: "Weak warmth" },
          { feature: "Duration", us: "Deep healing, lasting", others: "Temporary, returns quickly" },
          { feature: "Safety", us: "100% natural herbs", others: "Chemical additives" },
          { feature: "Value", us: "One bottle 3-4 months", others: "Quick consumption, costly" },
        ],
      },
      testimonial: {
        quote:
          "After three weeks, my stiff shoulder loosened so much. The heat sensation is amazing - much stronger than Tiger Balm!",
        author: "- Mdm. Tan, 62",
      },
    },
    product_cta: {
      title: "Limited Time Offer - Order Now",
      price: "$38",
      original_price: "$58",
      offer: "Buy 3 Get 1 Free + Free Delivery",
      cta: "WhatsApp Order",
      phone_cta: "Call to Order",
      guarantee: "30-Day Money-Back Guarantee",
      features: [
        "✅ 10-second results, deep healing",
        "✅ One bottle lasts 3-4 months",
        "✅ 100% natural ingredients",
        "✅ Buy 3 Get 1 Free deal",
      ],
    },
    final_cta: {
      title: "Stop Suffering in Pain",
      subtitle:
        "15,000+ users have reclaimed their lives. What are you waiting for? Experience myrrh's miraculous power today!",
      cta: "Try Now",
    },
  },
}

function HomePageContent() {
  const { language, setLanguage } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = content[language]

  const whatsappNumber = "+6584261225"
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
    <div className="min-h-screen bg-background font-sans">
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
              <a href="#usage" className="hover:text-primary transition-colors text-sm xl:text-base">
                {t.nav.usage}
              </a>
              <a href="#how-it-works" className="hover:text-primary transition-colors text-sm xl:text-base">
                {t.nav.how_it_works}
              </a>
              <a href="#benefits" className="hover:text-primary transition-colors text-sm xl:text-base">
                {t.nav.benefits}
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
                    <a href="#usage" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-100">
                      {t.nav.usage}
                    </a>
                    <a
                      href="#how-it-works"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 border-b border-gray-100"
                    >
                      {t.nav.how_it_works}
                    </a>
                    <a href="#benefits" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-100">
                      {t.nav.benefits}
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
        {/* Hero Section */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 text-center bg-secondary/50">
          <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
            <span className="inline-block bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              {t.hero.badge}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6 px-2">
              {t.hero.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-2 leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* Trust Badges Section */}
            <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 text-xs sm:text-sm">
              {/* First row - Users and Rating */}
              <div className="flex flex-col xs:flex-row items-center justify-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-sm min-w-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="font-medium text-gray-700 truncate">{t.hero.trust_badges.users}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-sm">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xs">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-medium text-gray-700">{t.hero.trust_badges.rating}</span>
                </div>
              </div>

              {/* Second row - Years and Platforms */}
              <div className="flex flex-col xs:flex-row items-center justify-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="font-medium text-gray-700">{t.hero.trust_badges.years}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-sm">
                  <div className="flex gap-1">
                    <img
                      src="/images/carousell-logo.png"
                      alt="Carousell"
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm flex-shrink-0"
                    />
                    <img
                      src="/images/tiktok-shop-logo.png"
                      alt="TikTok Shop"
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm flex-shrink-0"
                    />
                    <img
                      src="/images/facebook-logo.png"
                      alt="Facebook"
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm flex-shrink-0"
                    />
                    <img
                      src="/images/shopee-logo.png"
                      alt="Shopee"
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm flex-shrink-0"
                    />
                  </div>
                  <span className="font-medium text-gray-700 truncate">{t.hero.trust_badges.platforms}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8 w-full sm:w-auto max-w-xs"
                onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
              >
                {t.hero.cta}
              </Button>

              {/* Secondary Shopee CTA Button */}
              <Button
                size="lg"
                variant="outline"
                className="bg-orange-500 hover:bg-orange-600 text-white border-orange-600 hover:border-orange-700 text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8 w-full sm:w-auto max-w-xs"
                onClick={() =>
                  window.open(
                    "https://shopee.sg/Myrrh-Soreness-Muscle-Relief-Spray-Herbalbath-Singapore-i.177895131.41413960917",
                    "_blank",
                  )
                }
              >
                {t.hero.shopee_cta}
              </Button>

              {/* Mobile Language Toggle Button */}
              <div className="block md:hidden w-full sm:w-auto max-w-xs">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-sm sm:text-base h-11 sm:h-12 w-full bg-background/80 backdrop-blur-sm w-full"
                  onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
                >
                  {language === "zh" ? "English" : "中文"}
                </Button>
              </div>
            </div>
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
                videoPlaceholder={t.testimonials_section.video_placeholder}
                showViewAllButton={true}
              />
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-red-50">
          <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                {t.problems.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-red-600 font-semibold px-2 leading-relaxed">
                {t.problems.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto">
              {t.problems.items.map((problem, index) => (
                <div key={index} className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{problem.icon}</div>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{problem.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="usage" className="py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                {t.usage.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2 leading-relaxed">{t.usage.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-6xl mx-auto mb-8 sm:mb-12">
              {t.usage.methods.map((method, index) => (
                <Card key={index} className="p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="text-3xl sm:text-4xl flex-shrink-0">{method.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                      <p className="text-gray-700 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{method.desc}</p>
                      <ol className="space-y-2">
                        {method.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start space-x-2 text-xs sm:text-sm">
                            <span className="bg-orange-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {stepIndex + 1}
                            </span>
                            <span className="text-gray-700 leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-green-50 rounded-2xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
                {t.usage.benefits_title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {t.usage.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-8 sm:py-12 md:py-16 lg:py-20 bg-amber-50">
          <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
                {t.how_it_works.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed px-2">
                {t.how_it_works.intro}
              </p>
              <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-l-4 border-amber-500">
                <p className="text-gray-700 leading-relaxed italic text-sm sm:text-base">{t.how_it_works.story}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 max-w-6xl mx-auto">
              {t.how_it_works.reasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center space-y-3 sm:space-y-4 p-4 sm:p-6 bg-white rounded-2xl shadow-lg"
                >
                  <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center">
                    <reason.icon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                      {reason.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">{reason.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="benefits" className="py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                {t.benefits.title}
              </h2>
            </div>

            <div className="max-w-5xl mx-auto mb-8 sm:mb-12">
              <h3 className="text-lg sm:text-xl font-bold text-center mb-6 sm:mb-8 px-2">
                {t.benefits.comparison.title}
              </h3>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-50 font-semibold text-xs sm:text-sm md:text-base">
                  <div className="p-2 sm:p-4 text-center">{language === "zh" ? "对比项目" : "Comparison"}</div>
                  <div className="p-2 sm:p-4 text-center bg-green-100 text-green-800">
                    {language === "zh" ? "我们的产品" : "Our Product"}
                  </div>
                  <div className="p-2 sm:p-4 text-center">{language === "zh" ? "其他产品" : "Other Products"}</div>
                </div>
                {t.benefits.comparison.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 border-t text-xs sm:text-sm md:text-base">
                    <div className="p-2 sm:p-4 font-medium bg-gray-50">{item.feature}</div>
                    <div className="p-2 sm:p-4 bg-green-50 text-green-800 font-semibold">{item.us}</div>
                    <div className="p-2 sm:p-4 text-gray-600">{item.others}</div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-background border-l-4 border-primary max-w-4xl mx-auto">
              <CardContent className="p-4 sm:p-6">
                <p className="text-sm sm:text-base md:text-lg text-gray-800 italic mb-3 sm:mb-4 leading-relaxed">
                  "{t.benefits.testimonial.quote}"
                </p>
                <p className="font-semibold text-gray-600 text-sm sm:text-base">{t.benefits.testimonial.author}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          id="product-cta"
          className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-green-50 to-blue-50"
        >
          <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
            <Card className="max-w-5xl mx-auto p-4 sm:p-6 md:p-10 shadow-2xl bg-white border-2 border-green-200">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                  {t.product_cta.title}
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <span className="text-3xl sm:text-4xl md:text-6xl font-bold text-green-600">
                    {t.product_cta.price}
                  </span>
                  <div className="text-center sm:text-left">
                    <div className="text-lg sm:text-xl md:text-2xl text-gray-500 line-through">
                      {t.product_cta.original_price}
                    </div>
                    <div className="text-red-600 font-bold text-sm md:text-base">{t.product_cta.offer}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div className="space-y-3 sm:space-y-4">
                  {t.product_cta.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                      <span className="text-green-600 text-sm sm:text-base md:text-lg">{feature}</span>
                    </div>
                  ))}
                  <div className="bg-green-100 p-3 sm:p-4 rounded-lg mt-4 sm:mt-6">
                    <p className="text-green-800 font-semibold text-center text-sm sm:text-base">
                      {t.product_cta.guarantee}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:gap-4">
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-sm sm:text-base md:text-lg h-12 sm:h-14 w-full font-semibold"
                    onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
                  >
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    {t.product_cta.cta}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-sm sm:text-base h-10 sm:h-12 w-full bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-50"
                    onClick={() => window.open(`tel:${whatsappNumber}`, "_blank")}
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {t.product_cta.phone_cta}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection language={language} />

        {/* Pain Points Quick Links Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-3 font-serif">
                {language === "zh" ? "常见疼痛问题" : "Common Pain Points"}
              </h2>
              <p className="text-lg text-stone-600">
                {language === "zh" 
                  ? "了解更多关于您的疼痛问题和天然解决方案"
                  : "Learn more about your pain issues and natural solutions"}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/pain-points/knee-pain"
                className="p-6 bg-emerald-50 rounded-xl text-center hover:bg-emerald-100 hover:shadow-md transition-all"
              >
                <span className="text-3xl mb-2 block">🦵</span>
                <span className="font-medium text-emerald-800 block">膝盖疼痛</span>
                <span className="text-sm text-stone-500">Knee Pain</span>
              </Link>
              <Link
                href="/pain-points/back-pain"
                className="p-6 bg-emerald-50 rounded-xl text-center hover:bg-emerald-100 hover:shadow-md transition-all"
              >
                <span className="text-3xl mb-2 block">🔙</span>
                <span className="font-medium text-emerald-800 block">腰酸背痛</span>
                <span className="text-sm text-stone-500">Back Pain</span>
              </Link>
              <Link
                href="/pain-points/joint-arthritis"
                className="p-6 bg-emerald-50 rounded-xl text-center hover:bg-emerald-100 hover:shadow-md transition-all"
              >
                <span className="text-3xl mb-2 block">🦴</span>
                <span className="font-medium text-emerald-800 block">风湿关节炎</span>
                <span className="text-sm text-stone-500">Arthritis</span>
              </Link>
              <Link
                href="/pain-points/neck-shoulder-stiffness"
                className="p-6 bg-emerald-50 rounded-xl text-center hover:bg-emerald-100 hover:shadow-md transition-all"
              >
                <span className="text-3xl mb-2 block">💪</span>
                <span className="font-medium text-emerald-800 block">肩颈僵硬</span>
                <span className="text-sm text-stone-500">Neck Stiffness</span>
              </Link>
            </div>
            <div className="text-center mt-6">
              <Link
                href="/pain-points"
                className="inline-flex items-center text-emerald-700 hover:text-emerald-600 font-medium text-lg"
              >
                {language === "zh" ? "查看全部疼痛问题" : "View All Pain Points"} →
              </Link>
            </div>
          </div>
        </section>

        {/* Related Blog Articles Section */}
        <section className="py-12 md:py-16 bg-stone-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-3 font-serif">
                {language === "zh" ? "健康知识库" : "Health Knowledge"}
              </h2>
              <p className="text-lg text-stone-600">
                {language === "zh" 
                  ? "专为新加坡乐龄人士编写的健康指南"
                  : "Health guides written for Singapore seniors"}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/blog/knee-pain-relief-singapore"
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-stone-100"
              >
                <h3 className="font-bold text-emerald-800 mb-2">膝盖痛缓解指南</h3>
                <p className="text-stone-600 text-sm">10个帮助乐龄人士缓解膝盖疼痛的实用建议...</p>
              </Link>
              <Link
                href="/blog/myrrh-frankincense-miracle-herbs"
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-stone-100"
              >
                <h3 className="font-bold text-emerald-800 mb-2">没药乳香的神奇功效</h3>
                <p className="text-stone-600 text-sm">探索这两种千年草药的历史与科学原理...</p>
              </Link>
              <Link
                href="/blog/gentle-exercises-for-seniors"
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-stone-100"
              >
                <h3 className="font-bold text-emerald-800 mb-2">乐龄温和运动</h3>
                <p className="text-stone-600 text-sm">5种最适合新加坡乐龄人士的安全运动...</p>
              </Link>
            </div>
            <div className="text-center mt-6">
              <Link
                href="/blog"
                className="inline-flex items-center text-emerald-700 hover:text-emerald-600 font-medium text-lg"
              >
                {language === "zh" ? "阅读更多健康文章" : "Read More Articles"} →
              </Link>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white text-center">
          <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2">
              {t.final_cta.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed opacity-90 px-2">
              {t.final_cta.subtitle}
            </p>
            <Button
              size="lg"
              className="bg-white text-emerald-700 hover:bg-gray-100 text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-10 font-bold shadow-2xl"
              onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              {t.final_cta.cta}
            </Button>
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
              <img src="/images/carousell-logo.png" alt="Carousell" className="h-7 w-7 sm:h-8 sm:w-8" />
              <img src="/images/tiktok-shop-logo.png" alt="TikTok Shop" className="h-7 w-7 sm:h-8 sm:w-8" />
              <img src="/images/facebook-logo.png" alt="Facebook" className="h-7 w-7 sm:h-8 sm:w-8" />
              <img src="/images/shopee-logo.png" alt="Shopee" className="h-7 w-7 sm:h-8 sm:w-8" />
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

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50">
        <Button
          size="icon"
          className="rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-500 hover:bg-green-600 shadow-2xl animate-pulse-green"
          onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
        </Button>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  )
}
