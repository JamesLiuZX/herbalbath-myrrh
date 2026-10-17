import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { MessageCircle, Phone, ArrowLeft, Clock, User, Calendar, BookOpen } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { RelatedArticles, RelatedPainPoints } from "@/components/related-articles"
import { PostCover } from "@/components/blog/post-cover"
import { CONTACT } from "@/app/lib/growth-config"

const BASE_URL = "https://herbalbathsg.com"

export interface PostView {
  slug: string
  title: string
  description: string
  author: string
  date: string
  updated?: string
  lang: "zh" | "en"
  image: string | null
  imageAlt?: string
  readMinutes: number | null
  content: ReactNode
  faq?: { q: string; a: string }[]
  sources?: { title: string; url: string }[]
  related?: string[]
  disclaimer?: string
  /** Data articles get the claims-checked call to action; hand-written posts keep theirs. */
  cta: "legacy" | "checked"
}

const COPY = {
  zh: {
    home: "首页 Home",
    blog: "健康知识库 Blog",
    back: "返回知识库 Back to Blog",
    minutes: (n: number) => `${n} 分钟阅读`,
    faq: "常见问题",
    sources: "参考资料",
    updated: "更新于",
    ctaTitle: "想试试没药的温热？",
    ctaText: "HerbalBath 没药喷雾：10秒感受温热，一瓶可用3-4个月。现在买3送1，免费送货。",
    ctaPay: "PayNow 立即购买",
    ctaWhatsApp: "WhatsApp 咨询",
    call: "立即拨打",
    message: (title: string) => `你好！我刚读了你们的文章《${title}》，想了解没药喷雾。`,
  },
  en: {
    home: "首页 Home",
    blog: "健康知识库 Blog",
    back: "Back to Blog",
    minutes: (n: number) => `${n} min read`,
    faq: "Frequently asked questions",
    sources: "Sources",
    updated: "Updated",
    ctaTitle: "Curious about the warmth of myrrh?",
    ctaText: "HerbalBath Myrrh Spray: warmth in 10 seconds, and one bottle lasts 3-4 months. Buy 3 Get 1 Free, with free delivery.",
    ctaPay: "Pay with PayNow",
    ctaWhatsApp: "Ask on WhatsApp",
    call: "Call us",
    message: (title: string) => `Hi! I just read "${title}" on your blog and I'd like to know more about the Myrrh Spray.`,
  },
}

export default function BlogPostView({ post }: { post: PostView }) {
  const t = COPY[post.lang]
  const whatsapp = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(t.message(post.title))}`
  const url = `${BASE_URL}/blog/${post.slug}`

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      inLanguage: post.lang === "zh" ? "zh-SG" : "en-SG",
      image: `${BASE_URL}${post.image ?? "/images/og-image.jpg"}`,
      author: { "@type": "Organization", name: "HerbalBath SG", url: BASE_URL },
      publisher: { "@type": "Organization", name: "HerbalBath SG", logo: { "@type": "ImageObject", url: `${BASE_URL}/images/logo.png` } },
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      ...(post.sources?.length ? { citation: post.sources.map((s) => s.url) } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "HerbalBath SG", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "健康知识库", item: `${BASE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
        <header className="bg-emerald-800 text-white py-4 sticky top-0 z-50">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <Link href="/" className="text-xl md:text-2xl font-bold font-serif">
              HerbalBath SG
            </Link>
            <div className="flex items-center gap-3 md:gap-4">
              <a href={`tel:${CONTACT.phone}`} className="hidden md:flex items-center gap-2 text-lg font-medium hover:text-emerald-200 transition-colors">
                <Phone className="h-5 w-5" />
                <span>{CONTACT.whatsappDisplay}</span>
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsappNumber}`}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-base font-medium transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            schema={false}
            items={[
              { label: t.home, href: "/" },
              { label: t.blog, href: "/blog" },
              { label: post.title.length > 30 ? `${post.title.slice(0, 30)}…` : post.title, href: `/blog/${post.slug}` },
            ]}
          />

          <Link href="/blog" className="inline-flex items-center text-emerald-700 hover:text-emerald-600 mb-6 text-lg">
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t.back}
          </Link>

          <main className="max-w-4xl mx-auto">
            <article lang={post.lang === "zh" ? "zh-SG" : "en-SG"}>
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-6 font-serif leading-tight">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-stone-600 text-lg mb-6">
                  <span className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <time dateTime={post.date}>{post.date}</time>
                    {post.updated && post.updated !== post.date ? (
                      <span className="text-stone-500">
                        · {t.updated} <time dateTime={post.updated}>{post.updated}</time>
                      </span>
                    ) : null}
                  </span>
                  {post.readMinutes ? (
                    <span className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {t.minutes(post.readMinutes)}
                    </span>
                  ) : null}
                </div>
                <p className="text-xl text-stone-600 leading-relaxed">{post.description}</p>
              </header>

              <PostCover image={post.image} title={post.title} alt={post.imageAlt} priority sizes="(min-width: 1024px) 896px, 100vw" className="rounded-2xl shadow-lg mb-10" />

              <div
                className="prose prose-lg md:prose-xl max-w-none mx-auto
                prose-headings:font-serif prose-headings:text-emerald-900
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-stone-700 prose-p:leading-relaxed prose-p:text-lg
                prose-li:text-stone-700 prose-li:text-lg
                prose-strong:text-emerald-800
                prose-a:text-emerald-700 prose-a:underline-offset-4 hover:prose-a:text-emerald-600"
              >
                {post.content}
              </div>

              {post.faq?.length ? (
                <section className="mt-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-5 font-serif">{t.faq}</h2>
                  <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
                    {post.faq.map((f) => (
                      <details key={f.q} className="group p-5 md:p-6">
                        <summary className="cursor-pointer list-none text-lg md:text-xl font-semibold text-stone-900 flex justify-between gap-4">
                          {f.q}
                          <span aria-hidden="true" className="text-emerald-700 transition-transform group-open:rotate-45">
                            +
                          </span>
                        </summary>
                        <p className="mt-3 text-lg leading-relaxed text-stone-700">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              ) : null}

              {post.sources?.length ? (
                <section className="mt-10 rounded-2xl bg-stone-100 p-5 md:p-6">
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-stone-800">
                    <BookOpen className="h-5 w-5" aria-hidden="true" />
                    {t.sources}
                  </h2>
                  <ul className="space-y-2 text-base">
                    {post.sources.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-emerald-800 underline underline-offset-4 hover:text-emerald-600">
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {post.disclaimer ? <p className="mt-8 text-base leading-relaxed text-stone-500">{post.disclaimer}</p> : null}

              <RelatedPainPoints currentSlug={post.slug} />

              {/* A light card so the bottle (itself maroon) stands out. */}
              <div className="mt-12 grid items-center gap-6 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-brand-200 sm:grid-cols-[auto_1fr] md:p-10">
                <Image
                  src="/images/product-pack.webp"
                  alt={post.lang === "zh" ? "HerbalBath 没药草本能量油" : "HerbalBath Myrrh Herbal Energy Oil"}
                  width={738}
                  height={1186}
                  sizes="112px"
                  className="mx-auto h-44 w-auto drop-shadow-xl md:h-56"
                />
                <div className="text-center sm:text-left">
                  {post.cta === "checked" ? (
                    <>
                      <h2 className="text-2xl md:text-3xl font-bold mb-3 font-serif text-brand-900">{t.ctaTitle}</h2>
                      <p className="text-lg text-stone-700 mb-6">{t.ctaText}</p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl md:text-3xl font-bold mb-3 font-serif text-brand-900">准备好体验真正的缓解了吗？</h2>
                      <p className="text-lg text-stone-700 mb-6">
                        HerbalBath没药喷雾结合了古老智慧与现代科技，为新加坡15,000+用户带来快速、深层的疼痛缓解。
                      </p>
                    </>
                  )}
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                    {post.cta === "checked" ? (
                      <Link
                        href="/pay?b=bundle"
                        className="inline-flex items-center justify-center rounded-xl bg-brand-700 text-white hover:bg-brand-800 text-lg font-semibold px-7 py-4"
                      >
                        {t.ctaPay}
                      </Link>
                    ) : null}
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center rounded-xl text-lg font-semibold px-7 py-4 ${post.cta === "checked" ? "border-2 border-green-600 text-green-700 hover:bg-green-50" : "bg-green-600 text-white hover:bg-green-700"}`}
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      {post.cta === "checked" ? t.ctaWhatsApp : "WhatsApp 咨询订购"}
                    </a>
                    {post.cta === "legacy" ? (
                      <Link href="/" className="inline-flex items-center justify-center rounded-xl border-2 border-brand-700 text-brand-700 hover:bg-brand-50 text-lg font-semibold px-7 py-4">
                        了解更多产品信息
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>

              <RelatedArticles currentSlug={post.slug} preferred={post.related} maxArticles={3} />
            </article>
          </main>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 md:hidden z-50">
          <div className="flex gap-3">
            <a href={`tel:${CONTACT.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 text-white py-4 rounded-xl text-lg font-medium">
              <Phone className="h-5 w-5" />
              {t.call}
            </a>
            <a href={whatsapp} className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-xl text-lg font-medium">
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
