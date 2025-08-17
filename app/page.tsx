"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Menu, CheckCircle, Phone, Zap, Heart, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useReferral } from "@/app/hooks/useReferral"
import { TestimonialsGallery } from "@/components/testimonials-gallery"
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
      blog: "健康知识",
    },
    hero: {
      badge: "千年智慧 • 天然疗愈",
      title: "告别疼痛，重获自由",
      subtitle: "没药喷雾，15,000+用户见证的神奇效果。天然草本，深层舒缓，让您重新享受无痛生活。",
      cta: "立即体验",
      whatsapp_cta: "微信咨询",
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
      title: "疼痛正在偷走您的生活？",
      items: [
        { icon: "🌄", title: "晨起僵硬", desc: "关节不适，需要慢慢活动" },
        { icon: "🚶‍♀️", title: "行动受限", desc: "上楼梯、提重物都感到吃力" },
        { icon: "☁️", title: "旧伤复发", desc: "天气变化时隐隐作痛" },
        { icon: "🌙", title: "夜不能寐", desc: "疼痛影响睡眠质量" },
      ],
    },
    how_it_works: {
      title: "古老智慧 × 现代科学",
      intro: "没药与乳香，曾比黄金更珍贵。现在，我们用科学释放它们的治愈力。",
      reasons: [
        {
          icon: Heart,
          title: "没药：天然镇痛",
          desc: "千年传承，温和舒缓肌肉关节，带来持久舒适。",
        },
        {
          icon: Zap,
          title: "乳香：强效抗炎",
          desc: "减少肿胀不适，从根源解决问题。",
        },
        {
          icon: Sparkles,
          title: "深层渗透技术",
          desc: "微分子配方，快速穿透皮肤，直达患处。",
        },
      ],
    },
    benefits: {
      title: "感受神奇效果",
      items: ["快速舒缓关节肌肉紧张", "提升关节灵活性", "改善局部血液循环", "100%天然成分，安心使用"],
      testimonial: {
        quote: "用了三周，僵硬的肩膀松了很多，抬手很轻松。味道也很天然。",
        author: "- 陈女士, 62岁",
      },
    },
    product_cta: {
      title: "您的天然疗愈方案",
      price: "S$28.90",
      original_price: "S$35.90",
      cta: "微信订购",
      phone_cta: "电话订购",
      guarantee: "30天不满意，全额退款",
    },
    final_cta: {
      title: "选择更好的方案",
      subtitle: "不要让疼痛定义您的生活。今天就开始天然疗愈之旅。",
      cta: "微信咨询订购",
    },
  },
  en: {
    nav: {
      testimonials: "Testimonials",
      how_it_works: "How It Works",
      benefits: "Benefits",
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
      title: "Is Pain Stealing Your Life?",
      items: [
        { icon: "🌄", title: "Morning Stiffness", desc: "Joint discomfort upon waking" },
        { icon: "🚶‍♀️", title: "Limited Movement", desc: "Stairs and lifting feel difficult" },
        { icon: "☁️", title: "Old Injuries", desc: "Weather changes trigger pain" },
        { icon: "🌙", title: "Sleepless Nights", desc: "Pain disrupts sleep quality" },
      ],
    },
    how_it_works: {
      title: "Ancient Wisdom × Modern Science",
      intro: "Myrrh and Frankincense, once more precious than gold. Now science unlocks their healing power.",
      reasons: [
        {
          icon: Heart,
          title: "Myrrh: Natural Soother",
          desc: "Millennia-proven, gently calms muscles and joints for lasting comfort.",
        },
        {
          icon: Zap,
          title: "Frankincense: Anti-Inflammatory",
          desc: "Reduces swelling and discomfort at the source.",
        },
        {
          icon: Sparkles,
          title: "Deep-Penetration Tech",
          desc: "Micro-particles penetrate quickly to deliver maximum benefits.",
        },
      ],
    },
    benefits: {
      title: "Feel the Difference",
      items: [
        "Rapidly soothes joint and muscle tension",
        "Enhances flexibility and movement",
        "Improves local circulation",
        "100% natural, safe for daily use",
      ],
      testimonial: {
        quote: "After three weeks, my stiff shoulder loosened so much. Lifting my arm is easy now. Natural scent too.",
        author: "- Mdm. Tan, 62",
      },
    },
    product_cta: {
      title: "Your Natural Healing Solution",
      price: "S$28.90",
      original_price: "S$35.90",
      cta: "WhatsApp Order",
      phone_cta: "Call to Order",
      guarantee: "30-Day Money-Back Guarantee",
    },
    final_cta: {
      title: "Choose a Better Path",
      subtitle: "Don't let pain define your life. Start your natural healing journey today.",
      cta: "WhatsApp to Order",
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
                onClick={() => document.getElementById("product-cta")?.scrollIntoView({ behavior: "smooth" })}
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
            <TestimonialsGallery
              screenshots={testimonialImages}
              videoPlaceholder={t.testimonials_section.video_placeholder}
            />
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-secondary/50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{t.problems.title}</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {t.problems.items.map((problem, index) => (
                <div key={index} className="text-center p-4">
                  <div className="text-4xl mb-3">{problem.icon}</div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{problem.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{problem.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.how_it_works.title}</h2>
              <p className="text-base md:text-lg text-gray-600">{t.how_it_works.intro}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
              {t.how_it_works.reasons.map((reason, index) => (
                <div key={index} className="flex flex-col items-center text-center space-y-4 p-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <reason.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{reason.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{reason.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-12 sm:py-16 lg:py-20 bg-secondary/50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl mx-auto">
              <div className="order-2 lg:order-1 space-y-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{t.benefits.title}</h2>
                <ul className="space-y-4">
                  {t.benefits.items.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-base md:text-lg text-gray-700 leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Card className="bg-background border-l-4 border-primary">
                  <CardContent className="p-6">
                    <p className="text-base md:text-lg text-gray-800 italic mb-4 leading-relaxed">
                      "{t.benefits.testimonial.quote}"
                    </p>
                    <p className="font-semibold text-gray-600">{t.benefits.testimonial.author}</p>
                  </CardContent>
                </Card>
              </div>
              <div className="order-1 lg:order-2">
                <img
                  src="/images/product-hero.png"
                  alt="HerbalBath Myrrh Spray"
                  className="w-full h-auto rounded-2xl shadow-2xl max-w-md mx-auto lg:max-w-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Product CTA Section */}
        <section id="product-cta" className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <Card className="max-w-4xl mx-auto p-6 md:p-10 shadow-xl bg-card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{t.product_cta.title}</h2>
                  <div className="flex items-baseline justify-center md:justify-start gap-3 mb-4">
                    <span className="text-4xl md:text-5xl font-bold text-primary">{t.product_cta.price}</span>
                    <span className="text-lg md:text-xl text-gray-500 line-through">
                      {t.product_cta.original_price}
                    </span>
                  </div>
                  <p className="text-green-600 font-semibold">{t.product_cta.guarantee}</p>
                </div>
                <div className="flex flex-col gap-4">
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-base h-12 w-full"
                    onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t.product_cta.cta}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base h-12 w-full bg-transparent"
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

        {/* Final CTA */}
        <section className="py-12 sm:py-16 lg:py-20 bg-secondary/50 text-center">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.final_cta.title}</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              {t.final_cta.subtitle}
            </p>
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-base h-12 px-8"
              onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
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
