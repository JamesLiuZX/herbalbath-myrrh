"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Menu, CheckCircle, Phone, Zap, Heart, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useReferral } from "@/app/hooks/useReferral"
import { TestimonialsGallery } from "@/components/testimonials-gallery"
import { testimonialImages } from "@/app/lib/testimonial-data" // Import from the new data file

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
      badge: "源自千年智慧的天然疗愈方案",
      title: "唤醒身体的自愈力",
      subtitle:
        "HerbalBath 没药喷雾，不仅仅是缓解疼痛。它是一种生活方式的回归，让您重获行动的自由与喜悦。15,000+ 用户亲证的改变。",
      cta: "体验焕然一新",
    },
    testimonials_section: {
      title: "听听超过15,000位用户的真实心声",
      subtitle: "每一份见证，都是一个重获新生的故事。向右滑动查看更多 ->",
      video_placeholder: {
        title: "客户使用视频",
        coming_soon: "即将上线",
      },
    },
    problems: {
      title: "疼痛，是否正在悄悄偷走您的生活？",
      items: [
        { icon: "🌄", title: "清晨的僵硬", desc: "起床时关节不适，需要慢慢活动才能恢复正常。" },
        { icon: "🚶‍♀️", title: "活动的阻碍", desc: "上下楼梯、提东西、甚至抱孙子都感到力不从心。" },
        { icon: "☁️", title: "旧伤的困扰", desc: "天气变化或劳累后，陈年旧伤就开始隐隐作痛。" },
        { icon: "🌙", title: "睡眠的干扰", desc: "深夜因酸痛而辗转反侧，影响第二天的精神。" },
      ],
    },
    how_it_works: {
      title: "神奇之源：古老智慧与现代科学的结晶",
      intro:
        "我们的配方核心，是两种传承千年的传奇植物精华——没药与乳香。它们曾是比黄金更贵重的圣物，如今，我们用科学让它们的治愈力重焕新生。",
      reasons: [
        {
          icon: Heart,
          title: "没药：天然的镇痛大师",
          desc: "数千年来，没药被用于缓解深层疼痛。它能温和地舒缓紧张的肌肉与关节，带来持久的舒适感。",
        },
        {
          icon: Zap,
          title: "乳香：卓越的抗炎卫士",
          desc: "乳香以其强大的抗炎特性闻名，能有效减少关节的肿胀与不适，从根源上解决问题。",
        },
        {
          icon: Sparkles,
          title: "现代科技：深层渗透技术",
          desc: "我们采用先进的提取技术，将活性成分制成微小分子，能快速穿透皮肤，直达不适之处，发挥最大功效。",
        },
      ],
    },
    benefits: {
      title: "感受非凡功效，重拾生活乐趣",
      items: [
        "快速舒缓关节与肌肉的紧张不适",
        "提升关节灵活性，让行动更自如",
        "改善局部血液循环，为身体注入活力",
        "100%天然草本成分，温和亲肤，可安心长期使用",
      ],
      testimonial: {
        quote: "用了三个星期，我僵硬了很久的肩膀松了很多，现在抬手很轻松。味道也很好闻，很天然。",
        author: "- 陈女士, 62岁",
      },
    },
    product_cta: {
      title: "您的专属天然疗愈方案",
      price: "S$28.90",
      original_price: "S$35.90",
      cta: "立即订购，开启您的疗愈之旅",
      guarantee: "我们承诺，30天内不满意，全额退款。",
    },
    final_cta: {
      title: "是时候，为自己选择一个更好的方案了",
      subtitle: "不要再让疼痛定义您的生活。今天就开始您的天然疗愈之旅。",
      cta: "立即体验神奇效果",
    },
  },
  en: {
    nav: {
      testimonials: "Testimonials",
      how_it_works: "How It Works",
      benefits: "The Benefits",
      blog: "Health Journal",
    },
    hero: {
      badge: "A Natural Healing Solution from Ancient Wisdom",
      title: "Awaken Your Body's Healing Power",
      subtitle:
        "HerbalBath Myrrh Spray is more than pain relief. It's a return to a lifestyle of freedom and joy in movement. A change witnessed by over 15,000 users.",
      cta: "Experience a New Beginning",
    },
    testimonials_section: {
      title: "Hear From Over 15,000 Happy Users",
      subtitle: "Every testimonial is a story of a life reclaimed. Scroll right for more ->",
      video_placeholder: {
        title: "Customer Videos",
        coming_soon: "Coming Soon",
      },
    },
    problems: {
      title: "Is Pain Quietly Stealing Your Life?",
      items: [
        { icon: "🌄", title: "Morning Stiffness", desc: "Waking up with joint discomfort, needing time to warm up." },
        {
          icon: "🚶‍♀️",
          title: "Activity Hurdles",
          desc: "Stairs, carrying groceries, or even lifting a grandchild feels daunting.",
        },
        {
          icon: "☁️",
          title: "Old Injury Woes",
          desc: "Past injuries ache and throb with weather changes or after a long day.",
        },
        {
          icon: "🌙",
          title: "Sleep Disruption",
          desc: "Tossing and turning from aches, ruining the next day's energy.",
        },
      ],
    },
    how_it_works: {
      title: "The Source: Where Ancient Wisdom Meets Modern Science",
      intro:
        "At the heart of our formula are two legendary botanical resins—Myrrh and Frankincense. Once more precious than gold, we've unlocked their healing power with science.",
      reasons: [
        {
          icon: Heart,
          title: "Myrrh: The Natural Soother",
          desc: "For millennia, Myrrh has been used to soothe deep aches. It gently calms tense muscles and joints, providing lasting comfort.",
        },
        {
          icon: Zap,
          title: "Frankincense: The Anti-Inflammatory Guardian",
          desc: "Renowned for its potent anti-inflammatory properties, Frankincense helps reduce swelling and discomfort at the source.",
        },
        {
          icon: Sparkles,
          title: "Modern Science: Deep-Penetration Technology",
          desc: "Our advanced extraction creates micro-particles that penetrate quickly and deeply, delivering maximum benefits right where you need them.",
        },
      ],
    },
    benefits: {
      title: "Feel the Benefits, Rediscover Your Joy",
      items: [
        "Rapidly soothes tension in joints and muscles.",
        "Enhances flexibility for more fluid movement.",
        "Improves local circulation, revitalizing your body.",
        "100% natural, gentle on the skin, and safe for long-term use.",
      ],
      testimonial: {
        quote:
          "After three weeks, my stiff shoulder has loosened so much, and lifting my arm is easy now. The scent is lovely and natural too.",
        author: "- Mdm. Tan, 62",
      },
    },
    product_cta: {
      title: "Your Personal Natural Healing Solution",
      price: "S$28.90",
      original_price: "S$35.90",
      cta: "Order Now & Begin Your Healing Journey",
      guarantee: "Our Promise: 30-Day Money-Back Guarantee if you're not satisfied.",
    },
    final_cta: {
      title: "It's Time to Choose a Better Path for Yourself",
      subtitle: "Don't let pain define your life. Start your natural healing journey today.",
      cta: "Experience the Miraculous Effects Now",
    },
  },
}

export default function HomePage() {
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
        className="rounded-full sm:h-7 sm:px-3"
        onClick={() => setLanguage("zh")}
      >
        中文
      </Button>
      <Button
        variant={language === "en" ? "secondary" : "ghost"}
        size="sm"
        className="rounded-full sm:h-7 sm:px-3"
        onClick={() => setLanguage("en")}
      >
        EN
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <a href="/" className="text-xl md:text-2xl font-serif font-semibold text-gray-800">
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
                className="hidden sm:flex bg-green-600 hover:bg-green-700"
                onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
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
        <section className="py-12 sm:py-16 md:py-24 text-center bg-secondary/50">
          <div className="container px-4">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm md:text-base font-medium mb-4">
              {t.hero.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t.hero.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">{t.hero.subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-base h-12 px-8 md:text-lg md:h-14 md:px-10"
                onClick={() => document.getElementById("product-cta")?.scrollIntoView({ behavior: "smooth" })}
              >
                {t.hero.cta}
              </Button>

              {/* Mobile Language Toggle Button */}
              <div className="block md:hidden">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base h-12 px-6 bg-background/80 backdrop-blur-sm"
                  onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
                >
                  {language === "zh" ? "English" : "中文"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-12 sm:py-16 md:py-24">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12 px-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.testimonials_section.title}</h2>
              <p className="text-base sm:text-lg text-gray-600">{t.testimonials_section.subtitle}</p>
            </div>
            <TestimonialsGallery
              screenshots={testimonialImages}
              videoPlaceholder={t.testimonials_section.video_placeholder}
            />
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="py-12 sm:py-16 md:py-24 bg-secondary/50">
          <div className="container px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.problems.title}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
              {t.problems.items.map((problem, index) => (
                <div key={index} className="text-center p-4">
                  <div className="text-4xl mb-3">{problem.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{problem.title}</h3>
                  <p className="text-gray-600 text-sm">{problem.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-12 sm:py-16 md:py-24">
          <div className="container px-4">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.how_it_works.title}</h2>
              <p className="text-base sm:text-lg text-gray-600">{t.how_it_works.intro}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
              {t.how_it_works.reasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                    <reason.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{reason.title}</h3>
                    <p className="text-gray-600">{reason.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-12 sm:py-16 md:py-24 bg-secondary/50">
          <div className="container px-4">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl mx-auto">
              <div className="order-2 lg:order-1 space-y-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.benefits.title}</h2>
                <ul className="space-y-4">
                  {t.benefits.items.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-base sm:text-lg text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Card className="bg-background border-l-4 border-primary">
                  <CardContent className="p-6">
                    <p className="text-base sm:text-lg text-gray-800 italic mb-4">"{t.benefits.testimonial.quote}"</p>
                    <p className="font-semibold text-gray-600">{t.benefits.testimonial.author}</p>
                  </CardContent>
                </Card>
              </div>
              <div className="order-1 lg:order-2">
                <img
                  src="/images/product-hero.png"
                  alt="HerbalBath Myrrh Spray"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Product CTA Section */}
        <section id="product-cta" className="py-12 sm:py-16 md:py-24">
          <div className="container px-4">
            <Card className="max-w-4xl mx-auto p-6 md:p-10 shadow-xl bg-card">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{t.product_cta.title}</h2>
                  <div className="flex items-baseline justify-center md:justify-start gap-3 mb-4">
                    <span className="text-4xl sm:text-5xl font-bold text-primary">{t.product_cta.price}</span>
                    <span className="text-lg sm:text-xl text-gray-500 line-through">
                      {t.product_cta.original_price}
                    </span>
                  </div>
                  <p className="text-green-600 font-semibold">{t.product_cta.guarantee}</p>
                </div>
                <div className="flex flex-col gap-4">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-base h-12 md:text-lg md:h-14 w-full"
                    onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t.product_cta.cta}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base h-12 md:text-lg md:h-14 w-full bg-transparent"
                    onClick={() => window.open(`tel:${whatsappNumber}`, "_blank")}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    电话订购
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 sm:py-16 md:py-24 bg-secondary/50 text-center">
          <div className="container px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.final_cta.title}</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8">{t.final_cta.subtitle}</p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-base h-12 px-8 md:text-lg md:h-14 md:px-10"
              onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
            >
              {t.final_cta.cta}
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container px-4 text-center text-gray-500">
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
      <div className="fixed bottom-5 right-5 z-50">
        <Button
          size="icon"
          className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600 shadow-2xl animate-pulse-green"
          onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
      </div>
    </div>
  )
}
