import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageCircle, ArrowRight, Leaf, Shield, Star } from "lucide-react"
import { posts } from "@/app/lib/blog-data"
import { Breadcrumbs } from "@/components/breadcrumbs"

export const metadata: Metadata = {
  title: "健康知识库 | Health Blog | HerbalBath SG",
  description:
    "新加坡乐龄人士健康知识库。学习如何通过天然方法缓解膝盖痛、腰酸背痛、关节炎等问题。Health knowledge for Singapore seniors - natural pain relief tips and herbal remedies.",
  keywords: [
    "herbalbath",
    "herbal bath singapore",
    "health blog singapore",
    "pain relief tips",
    "elderly health",
    "膝盖痛",
    "关节炎",
    "健康知识",
    "新加坡乐龄",
  ],
  openGraph: {
    title: "健康知识库 - HerbalBath SG",
    description: "新加坡乐龄人士健康知识库",
    type: "website",
  },
  alternates: {
    canonical: "https://herbalbathsg.com/blog",
  },
}

// Collection page schema for SEO
const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "HerbalBath SG Health Blog",
  description: "Health articles for Singapore seniors on natural pain relief and herbal remedies",
  url: "https://herbalbathsg.com/blog",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://herbalbathsg.com/blog/${post.slug}`,
      name: post.title,
    })),
  },
}

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
        {/* Header */}
        <header className="bg-emerald-800 text-white py-4 sticky top-0 z-50">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <Link href="/" className="text-xl md:text-2xl font-bold font-serif">
              HerbalBath SG
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="hover:text-emerald-200 transition-colors">
                首页 Home
              </Link>
              <Link href="/pain-points" className="hover:text-emerald-200 transition-colors">
                疼痛问题 Pain Points
              </Link>
              <Link href="/testimonials" className="hover:text-emerald-200 transition-colors">
                客户评价 Reviews
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <a
                href="tel:+6594606058"
                className="hidden md:flex items-center gap-2 text-lg font-medium hover:text-emerald-200 transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>9460 6058</span>
              </a>
              <a
                href="https://wa.me/6594606058"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-base font-medium transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "首页 Home", href: "/" },
              { label: "健康知识库 Blog", href: "/blog" },
            ]}
          />

          {/* Hero Section */}
          <section className="text-center py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-4 font-serif">
              健康知识库
            </h1>
            <p className="text-xl md:text-2xl text-emerald-700 mb-2">
              Health Knowledge Hub
            </p>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto mt-4 leading-relaxed">
              学习如何更好地管理疼痛，拥抱健康生活。专为新加坡55岁以上乐龄人士编写的健康指南。
            </p>
            <p className="text-base text-stone-500 max-w-2xl mx-auto mt-2">
              Learn to manage pain better and embrace healthy living. Health guides written for Singapore seniors 55+.
            </p>
          </section>

          {/* Trust Badges */}
          <section className="flex flex-wrap justify-center gap-6 md:gap-10 py-6 border-y border-stone-200 mb-12">
            <div className="flex items-center gap-2 text-emerald-700">
              <Shield className="h-5 w-5" />
              <span className="font-medium">专业健康顾问编写</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="font-medium">15,000+ 读者信赖</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <Leaf className="h-5 w-5" />
              <span className="font-medium">天然疗法指南</span>
            </div>
          </section>

          {/* Quick Links to Pain Points */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-emerald-800 mb-4 text-center">
              快速浏览常见疼痛问题 Quick Pain Point Navigation
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/pain-points/knee-pain"
                className="px-5 py-2.5 bg-white border border-stone-200 rounded-full hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-stone-700"
              >
                膝盖疼痛
              </Link>
              <Link
                href="/pain-points/back-pain"
                className="px-5 py-2.5 bg-white border border-stone-200 rounded-full hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-stone-700"
              >
                腰酸背痛
              </Link>
              <Link
                href="/pain-points/joint-arthritis"
                className="px-5 py-2.5 bg-white border border-stone-200 rounded-full hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-stone-700"
              >
                风湿关节炎
              </Link>
              <Link
                href="/pain-points/neck-shoulder-stiffness"
                className="px-5 py-2.5 bg-white border border-stone-200 rounded-full hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-stone-700"
              >
                肩颈僵硬
              </Link>
              <Link
                href="/pain-points"
                className="px-5 py-2.5 bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition-colors flex items-center gap-2"
              >
                查看全部
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Blog Posts Grid */}
          <main>
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-8 text-center font-serif">
              最新健康文章
              <span className="block text-lg font-normal text-stone-600 mt-1">
                Latest Health Articles
              </span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                  <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-emerald-300">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <Badge className="mb-2 w-fit bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                        {post.author}
                      </Badge>
                      <CardTitle className="text-xl md:text-2xl group-hover:text-emerald-600 transition-colors text-emerald-900 font-serif line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-stone-600 text-base line-clamp-3 mb-4">{post.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-stone-500">{post.date}</p>
                        <span className="flex items-center text-emerald-600 font-medium text-sm group-hover:text-emerald-500">
                          阅读更多
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </main>

          {/* CTA Section */}
          <section className="bg-emerald-50 rounded-2xl p-8 md:p-12 text-center my-16">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-4 font-serif">
              想要立即缓解疼痛？
              <span className="block text-lg font-normal text-emerald-700 mt-2">
                Want immediate pain relief?
              </span>
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-8">
              HerbalBath没药喷雾采用千年古方，10秒见效，15,000+新加坡用户信赖之选。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-lg px-8 py-4 rounded-xl transition-colors font-medium"
              >
                了解更多产品信息
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="https://wa.me/6594606058"
                className="inline-flex items-center justify-center gap-2 border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-4 rounded-xl transition-colors font-medium"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp 咨询
              </a>
            </div>
          </section>

          {/* Footer Links for SEO */}
          <footer className="border-t border-stone-200 pt-8 pb-20 md:pb-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-emerald-800 mb-4">热门文章 Popular Articles</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/blog/knee-pain-relief-singapore" className="text-stone-600 hover:text-emerald-600 transition-colors">
                      膝盖痛缓解指南
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog/myrrh-frankincense-miracle-herbs" className="text-stone-600 hover:text-emerald-600 transition-colors">
                      没药乳香的神奇功效
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog/gentle-exercises-for-seniors" className="text-stone-600 hover:text-emerald-600 transition-colors">
                      乐龄温和运动指南
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-emerald-800 mb-4">疼痛问题 Pain Points</h3>
                <ul className="space-y-2">
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
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-emerald-800 mb-4">关于 HerbalBath</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-stone-600 hover:text-emerald-600 transition-colors">
                      首页 Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/testimonials" className="text-stone-600 hover:text-emerald-600 transition-colors">
                      客户评价 Testimonials
                    </Link>
                  </li>
                  <li>
                    <Link href="/partner" className="text-stone-600 hover:text-emerald-600 transition-colors">
                      成为合作伙伴 Partner
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center text-stone-500 text-sm">
              <p>HerbalBath SG - 新加坡天然草药疼痛缓解 | Natural Herbal Pain Relief Singapore</p>
              <p className="mt-1">herbalbath | herbal bath singapore | herbalbath sg</p>
            </div>
          </footer>
        </div>

        {/* Sticky Mobile CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 md:hidden z-50">
          <div className="flex gap-3">
            <a
              href="tel:+6594606058"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 text-white py-4 rounded-xl text-lg font-medium"
            >
              <Phone className="h-5 w-5" />
              立即拨打
            </a>
            <a
              href="https://wa.me/6594606058"
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-xl text-lg font-medium"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
