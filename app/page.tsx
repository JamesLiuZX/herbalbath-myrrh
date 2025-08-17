"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Menu, Phone, Zap, Heart, Sparkles, Flame } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useReferral } from "@/app/hooks/useReferral"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { testimonialImages } from "@/app/lib/testimonial-data" // Import from the new data file
import { Suspense } from "react"

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
      title: "告别疼痛，重获自由",
      subtitle: "没药喷雾，15,000+用户见证的神奇效果。天然草本，深层舒缓，让您重新享受无痛生活。",
      cta: "立即体验",
      whatsapp_cta: "WhatsApp咨询",
    },
    testimonials_section: {
      title: "15,000+用户真实见证",
      subtitle: "每一份见证，都是重获新生的故事 →",
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
      whatsapp_cta: "WhatsApp Us",
    },
    testimonials_section: {
      title: "15,000+ Real User Stories",
      subtitle: "Every testimonial is a life reclaimed →",
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

  const whatsappNumber = "+6594606058"
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
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <div className="flex items-center justify-between">
            <a href="/" className="text-xl sm:text-2xl font-serif font-semibold text-gray-800 truncate">
              HerbalBath SG
            </a>
            <nav className="hidden lg:flex items-center space-x-6 text-gray-600">
              <a href="#testimonials" className="hover:text-primary transition-colors">
                {t.nav.testimonials}
              </a>
              <a href="#usage" className="hover:text-primary transition-colors">
                {t.nav.usage}
              </a>
              <a href="#how-it-works" className="hover:text-primary transition-colors">
                {t.nav.how_it_works}
              </a>
              <a href="#benefits" className="hover:text-primary transition-colors">
                {t.nav.benefits}
              </a>
              <a href="/blog" className="hover:text-primary transition-colors">
                {t.nav.blog}
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <LanguageToggle />
              </div>
              <Button
                className="hidden sm:flex bg-green-600 hover:bg-green-700 text-sm px-4 h-9"
                onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {t.hero.whatsapp_cta}
              </Button>
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 mt-6 text-lg">
                    <a href="#testimonials" onClick={() => setIsMenuOpen(false)}>
                      {t.nav.testimonials}
                    </a>
                    <a href="#usage" onClick={() => setIsMenuOpen(false)}>
                      {t.nav.usage}
                    </a>
                    <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>
                      {t.nav.how_it_works}
                    </a>
                    <a href="#benefits" onClick={() => setIsMenuOpen(false)}>
                      {t.nav.benefits}
                    </a>
                    <a href="/blog" onClick={() => setIsMenuOpen(false)}>
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
        <section className="py-12 sm:py-16 lg:py-20 text-center bg-secondary/50">
          <div className="container mx-auto px-4 max-w-7xl">
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              {t.hero.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t.hero.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">{t.hero.subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-base h-12 px-8 w-full sm:w-auto"
                onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
              >
                {t.hero.cta}
              </Button>

              {/* Mobile Language Toggle Button */}
              <div className="block md:hidden w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base h-12 px-8 bg-background/80 backdrop-blur-sm w-full sm:w-auto"
                  onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
                >
                  {language === "zh" ? "English" : "中文"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-12 px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t.testimonials_section.title}
              </h2>
              <p className="text-base md:text-lg text-gray-600">{t.testimonials_section.subtitle}</p>
            </div>
            <TestimonialsCarousel
              screenshots={testimonialImages}
              videoPlaceholder={t.testimonials_section.video_placeholder}
              showViewAllButton={true}
            />
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20 bg-red-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.problems.title}</h2>
              <p className="text-base md:text-lg text-red-600 font-semibold">{t.problems.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {t.problems.items.map((problem, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl mb-3">{problem.icon}</div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{problem.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{problem.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="usage" className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.usage.title}</h2>
              <p className="text-base md:text-lg text-gray-600">{t.usage.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto mb-12">
              {t.usage.methods.map((method, index) => (
                <Card key={index} className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{method.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                      <p className="text-gray-700 mb-4 leading-relaxed">{method.desc}</p>
                      <ol className="space-y-2">
                        {method.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start space-x-2 text-sm">
                            <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {stepIndex + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-green-50 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">为什么效果这么好？</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {t.usage.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Flame className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-sm leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-amber-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t.how_it_works.title}</h2>
              <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">{t.how_it_works.intro}</p>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-l-4 border-amber-500">
                <p className="text-gray-700 leading-relaxed italic">{t.how_it_works.story}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
              {t.how_it_works.reasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-2xl shadow-lg"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                    <reason.icon className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">{reason.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{reason.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="benefits" className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.benefits.title}</h2>
            </div>

            <div className="max-w-5xl mx-auto mb-12">
              <h3 className="text-xl font-bold text-center mb-8">{t.benefits.comparison.title}</h3>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-50 font-semibold text-sm md:text-base">
                  <div className="p-4 text-center">对比项目</div>
                  <div className="p-4 text-center bg-green-100 text-green-800">我们的产品</div>
                  <div className="p-4 text-center">其他产品</div>
                </div>
                {t.benefits.comparison.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 border-t text-sm md:text-base">
                    <div className="p-4 font-medium bg-gray-50">{item.feature}</div>
                    <div className="p-4 bg-green-50 text-green-800 font-semibold">{item.us}</div>
                    <div className="p-4 text-gray-600">{item.others}</div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-background border-l-4 border-primary max-w-4xl mx-auto">
              <CardContent className="p-6">
                <p className="text-base md:text-lg text-gray-800 italic mb-4 leading-relaxed">
                  "{t.benefits.testimonial.quote}"
                </p>
                <p className="font-semibold text-gray-600">{t.benefits.testimonial.author}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="product-cta" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <Card className="max-w-5xl mx-auto p-6 md:p-10 shadow-2xl bg-white border-2 border-green-200">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.product_cta.title}</h2>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-4xl md:text-6xl font-bold text-green-600">{t.product_cta.price}</span>
                  <div className="text-left">
                    <div className="text-xl md:text-2xl text-gray-500 line-through">{t.product_cta.original_price}</div>
                    <div className="text-red-600 font-bold text-sm md:text-base">{t.product_cta.offer}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  {t.product_cta.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-green-600 text-lg">{feature}</span>
                    </div>
                  ))}
                  <div className="bg-green-100 p-4 rounded-lg mt-6">
                    <p className="text-green-800 font-semibold text-center">{t.product_cta.guarantee}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-base h-14 w-full text-lg font-semibold"
                    onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
                  >
                    <MessageCircle className="w-6 h-6 mr-2" />
                    {t.product_cta.cta}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base h-12 w-full bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-50"
                    onClick={() => window.open(`tel:${whatsappNumber}`, "_blank")}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    {t.product_cta.phone_cta}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-red-600 to-orange-600 text-white text-center">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{t.final_cta.title}</h2>
            <p className="text-base md:text-lg max-w-3xl mx-auto mb-8 leading-relaxed opacity-90">
              {t.final_cta.subtitle}
            </p>
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100 text-lg h-14 px-10 font-bold shadow-2xl"
              onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
            >
              <MessageCircle className="w-6 h-6 mr-2" />
              {t.final_cta.cta}
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500 max-w-7xl">
          <p>&copy; {new Date().getFullYear()} HerbalBath SG. All Rights Reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="/partner" className="hover:text-primary">
              Partner Program
            </a>
            <span>&bull;</span>
            <a href="/blog" className="hover:text-primary">
              Health Journal
            </a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 shadow-2xl animate-pulse-green"
          onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
        >
          <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
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
