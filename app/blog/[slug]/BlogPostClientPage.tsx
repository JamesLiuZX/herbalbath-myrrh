"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { posts } from "@/app/lib/blog-data"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, ArrowLeft, Clock, User, Calendar } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { RelatedArticles, RelatedPainPoints } from "@/components/related-articles"

export default function BlogPostClientPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  const whatsappNumber = "+6584261225"
  const whatsappMessage = encodeURIComponent(
    `Hi! I just read your blog post "${post.title}" and I'm interested in the Myrrh spray.`,
  )

  // Article Schema for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `https://herbalbathsg.com${post.image}`,
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
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://herbalbathsg.com/blog/${post.slug}`,
    },
  }

  return (
    <>
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
        {/* Header with phone and WhatsApp */}
        <header className="bg-emerald-800 text-white py-4 sticky top-0 z-50">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <Link href="/" className="text-xl md:text-2xl font-bold font-serif">
              HerbalBath SG
            </Link>
            <div className="flex items-center gap-3 md:gap-4">
              <a
                href="tel:+6584261225"
                className="hidden md:flex items-center gap-2 text-lg font-medium hover:text-emerald-200 transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>8426 1225</span>
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
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
              { label: post.title.substring(0, 30) + "...", href: `/blog/${post.slug}` },
            ]}
          />

          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-emerald-700 hover:text-emerald-600 mb-6 text-lg"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            返回知识库 Back to Blog
          </Link>

          <main className="max-w-4xl mx-auto">
            <article>
              {/* Article Header */}
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-6 font-serif leading-tight">
                  {post.title}
                </h1>
                
                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 text-stone-600 text-lg mb-6">
                  <span className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    5 分钟阅读
                  </span>
                </div>

                {/* Description */}
                <p className="text-xl text-stone-600 leading-relaxed">
                  {post.description}
                </p>
              </header>

              {/* Featured Image */}
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full rounded-2xl shadow-lg mb-10"
              />

              {/* Article Content */}
              <div className="prose prose-lg md:prose-xl max-w-none mx-auto
                prose-headings:font-serif prose-headings:text-emerald-900
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-stone-700 prose-p:leading-relaxed prose-p:text-lg
                prose-li:text-stone-700 prose-li:text-lg
                prose-strong:text-emerald-800
                prose-a:text-emerald-600 prose-a:hover:text-emerald-700">
                {post.content}
              </div>

              {/* Internal Links to Pain Points */}
              <RelatedPainPoints currentSlug={post.slug} />

              {/* CTA Section */}
              <div className="mt-12 p-8 md:p-10 bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-2xl text-white text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 font-serif">
                  准备好体验真正的缓解了吗？
                </h2>
                <p className="text-lg text-emerald-100 mb-6 max-w-2xl mx-auto">
                  HerbalBath没药喷雾结合了古老智慧与现代科技，为新加坡15,000+用户带来快速、深层的疼痛缓解。
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6 h-auto"
                    onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, "_blank")}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp 咨询订购
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-emerald-600 text-lg px-8 py-6 h-auto"
                  >
                    <Link href="/">
                      了解更多产品信息
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Related Articles */}
              <RelatedArticles currentSlug={post.slug} maxArticles={3} />
            </article>
          </main>

          {/* SEO Keywords (visually hidden) */}
          <div className="sr-only">
            <p>
              HerbalBath, Herbal Bath Singapore, HerbalBath SG, herbal bath sg,
              没药喷雾, 天然止痛, natural pain relief singapore, myrrh spray,
              elderly pain relief, seniors health singapore, 新加坡乐龄保健
            </p>
          </div>
        </div>

        {/* Sticky Mobile CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 md:hidden z-50">
          <div className="flex gap-3">
            <a
              href="tel:+6584261225"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 text-white py-4 rounded-xl text-lg font-medium"
            >
              <Phone className="h-5 w-5" />
              立即拨打
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
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
