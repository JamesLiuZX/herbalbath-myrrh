import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Phone, MessageCircle, ArrowLeft, Clock, Shield, Leaf, Star, CheckCircle } from "lucide-react"
import { painPointsData, getPainPointBySlug, getAllPainPointSlugs } from "@/app/lib/pain-points-data"
import { posts } from "@/app/lib/blog-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/breadcrumbs"

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate static paths for all pain points
export async function generateStaticParams() {
  return getAllPainPointSlugs().map((slug) => ({ slug }))
}

// Generate metadata for each pain point page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const painPoint = getPainPointBySlug(slug)

  if (!painPoint) {
    return {
      title: "Page Not Found | HerbalBath SG",
    }
  }

  return {
    title: `${painPoint.titleZh} | ${painPoint.titleEn}`,
    description: `${painPoint.descriptionZh} ${painPoint.descriptionEn}`,
    keywords: painPoint.keywords,
    openGraph: {
      title: `${painPoint.titleZh} - HerbalBath SG`,
      description: painPoint.descriptionEn,
      type: "article",
    },
    alternates: {
      canonical: `https://herbalbathsg.com/pain-points/${slug}`,
    },
  }
}

export default async function PainPointPage({ params }: PageProps) {
  const { slug } = await params
  const painPoint = getPainPointBySlug(slug)

  if (!painPoint) {
    notFound()
  }

  // Get related blog posts
  const relatedPosts = posts.filter((post) =>
    painPoint.relatedBlogSlugs.includes(post.slug)
  )

  // Get other pain points for internal linking
  const otherPainPoints = painPointsData
    .filter((p) => p.slug !== slug)
    .slice(0, 4)

  // Article Schema for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${painPoint.titleZh} - ${painPoint.titleEn}`,
    description: painPoint.descriptionEn,
    author: {
      "@type": "Organization",
      name: "HerbalBath SG",
    },
    publisher: {
      "@type": "Organization",
      name: "HerbalBath SG",
      logo: {
        "@type": "ImageObject",
        url: "https://herbalbathsg.com/images/logo.png",
      },
    },
    datePublished: painPoint.lastUpdated,
    dateModified: painPoint.lastUpdated,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://herbalbathsg.com/pain-points/${slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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
              { label: "疼痛问题 Pain Points", href: "/pain-points" },
              { label: painPoint.titleZh, href: `/pain-points/${slug}` },
            ]}
          />

          {/* Back Link */}
          <Link
            href="/pain-points"
            className="inline-flex items-center text-emerald-700 hover:text-emerald-600 mb-6 text-lg"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            返回所有疼痛问题 Back to All Pain Points
          </Link>

          {/* Hero Section */}
          <section className="py-8 md:py-12">
            <div className="max-w-4xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-emerald-900 mb-4">
                {painPoint.titleZh}
              </h1>
              <p className="text-xl md:text-2xl text-emerald-700 mb-6">
                {painPoint.titleEn}
              </p>
              <p className="text-lg text-stone-600 leading-relaxed mb-4">
                {painPoint.descriptionZh}
              </p>
              <p className="text-base text-stone-500">
                {painPoint.descriptionEn}
              </p>
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-2">
              {/* Chinese Content */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 mb-8">
                <div
                  className="prose prose-lg prose-emerald max-w-none
                    prose-headings:font-serif prose-headings:text-emerald-900
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                    prose-p:text-stone-700 prose-p:leading-relaxed prose-p:text-lg
                    prose-li:text-stone-700 prose-li:text-lg
                    prose-strong:text-emerald-800"
                  dangerouslySetInnerHTML={{
                    __html: painPoint.contentZh
                      .replace(/\n## /g, '<h2>')
                      .replace(/\n### /g, '<h3>')
                      .replace(/\n- \*\*/g, '<li><strong>')
                      .replace(/\*\* - /g, '</strong> - ')
                      .replace(/\n- /g, '<li>')
                      .replace(/\n\n/g, '</p><p>')
                      .replace(/\n\d\. \*\*/g, '<li><strong>')
                      .replace(/\*\*$/gm, '</strong></li>')
                  }}
                />
              </div>

              {/* English Content */}
              <div className="bg-stone-50 rounded-2xl p-8 mb-8">
                <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🇬🇧</span> English Version
                </h2>
                <div
                  className="prose prose-stone max-w-none
                    prose-headings:font-serif prose-headings:text-stone-800
                    prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
                    prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
                    prose-p:text-stone-600 prose-p:leading-relaxed
                    prose-li:text-stone-600"
                  dangerouslySetInnerHTML={{
                    __html: painPoint.contentEn
                      .replace(/\n## /g, '<h2>')
                      .replace(/\n### /g, '<h3>')
                      .replace(/\n- \*\*/g, '<li><strong>')
                      .replace(/\*\* - /g, '</strong> - ')
                      .replace(/\n- /g, '<li>')
                      .replace(/\n\n/g, '</p><p>')
                      .replace(/\n\d\. \*\*/g, '<li><strong>')
                      .replace(/\*\*$/gm, '</strong></li>')
                  }}
                />
              </div>

              {/* Product CTA */}
              <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">
                  立即尝试 HerbalBath 没药喷雾
                </h2>
                <p className="text-emerald-100 mb-6 text-lg">
                  专为{painPoint.titleZh}设计的天然解决方案。10秒见效，15,000+用户好评。
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-300" />
                    <span>100% 天然成分</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-300" />
                    <span>无副作用</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-300" />
                    <span>新加坡包邮</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6 h-auto"
                  >
                    <Link href="/">
                      了解更多
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-emerald-600 text-lg px-8 py-6 h-auto"
                  >
                    <a href="https://wa.me/6588930000">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      WhatsApp 下单
                    </a>
                  </Button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Trust Badges */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-800">
                    为什么选择 HerbalBath？
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-stone-800">8年品牌保证</p>
                      <p className="text-sm text-stone-500">Trusted since 2016</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="h-6 w-6 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-stone-800">15,000+ 好评</p>
                      <p className="text-sm text-stone-500">4.9/5 rating</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Leaf className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-stone-800">100% 天然成分</p>
                      <p className="text-sm text-stone-500">No side effects</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-stone-800">10秒快速见效</p>
                      <p className="text-sm text-stone-500">Works in 10 seconds</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-emerald-800">
                      相关文章 Related Articles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedPosts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="block p-3 bg-stone-50 rounded-lg hover:bg-emerald-50 transition-colors"
                      >
                        <h4 className="font-medium text-stone-800 text-base line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-sm text-stone-500 mt-1">{post.date}</p>
                      </Link>
                    ))}
                    <Link
                      href="/blog"
                      className="block text-center text-emerald-600 hover:text-emerald-700 font-medium py-2"
                    >
                      查看全部文章 →
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Other Pain Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-800">
                    其他疼痛问题 Other Pain Points
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {otherPainPoints.map((pp) => (
                    <Link
                      key={pp.slug}
                      href={`/pain-points/${pp.slug}`}
                      className="block p-3 bg-stone-50 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      <h4 className="font-medium text-stone-800">{pp.titleZh}</h4>
                      <p className="text-sm text-stone-500">{pp.titleEn}</p>
                    </Link>
                  ))}
                  <Link
                    href="/pain-points"
                    className="block text-center text-emerald-600 hover:text-emerald-700 font-medium py-2"
                  >
                    查看全部 →
                  </Link>
                </CardContent>
              </Card>

              {/* Contact CTA */}
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-emerald-800 text-lg mb-3">
                    有疑问？联系我们！
                  </h3>
                  <p className="text-stone-600 mb-4">
                    我们的健康顾问随时为您解答
                  </p>
                  <div className="space-y-3">
                    <a
                      href="tel:+6588930000"
                      className="flex items-center justify-center gap-2 w-full bg-emerald-700 text-white py-3 rounded-lg hover:bg-emerald-800 transition-colors font-medium"
                    >
                      <Phone className="h-5 w-5" />
                      立即拨打
                    </a>
                    <a
                      href="https://wa.me/6588930000"
                      className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp 咨询
                    </a>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>

          {/* Keywords for SEO (visually hidden) */}
          <div className="sr-only">
            <p>
              Keywords: {painPoint.keywords.join(", ")}
            </p>
            <p>
              HerbalBath, Herbal Bath Singapore, HerbalBath SG, natural pain relief, myrrh spray, frankincense, 没药喷雾, 天然止痛, Singapore seniors, elderly pain relief
            </p>
          </div>
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
