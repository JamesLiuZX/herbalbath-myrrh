import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { posts } from "@/app/lib/blog-data"
import { getArticle, getArticles, readingMinutes } from "@/app/lib/articles"
import { existingImage } from "@/app/lib/all-posts"
import { ArticleBody } from "@/components/blog/article-body"
import rules from "@/content/rules.json"
import BlogPostView, { type PostView } from "./BlogPostView"

const BASE_URL = "https://herbalbathsg.com"

export async function generateStaticParams() {
  return [...posts.map((p) => ({ slug: p.slug })), ...getArticles().map((a) => ({ slug: a.slug }))]
}

/** A hand-written post from blog-data.tsx, or a data article from content/blog. */
function findPost(slug: string): PostView | null {
  const legacy = posts.find((p) => p.slug === slug)
  if (legacy) {
    return {
      slug: legacy.slug,
      title: legacy.title,
      description: legacy.description,
      author: legacy.author,
      date: legacy.date,
      lang: "zh",
      image: existingImage(legacy.image),
      readMinutes: null,
      content: legacy.content,
      cta: "legacy",
    }
  }
  const a = getArticle(slug)
  if (!a) return null
  return {
    slug: a.slug,
    title: a.title,
    description: a.description,
    author: a.author,
    date: a.date,
    updated: a.updated,
    lang: a.lang,
    image: existingImage(a.image),
    imageAlt: a.imageAlt,
    readMinutes: readingMinutes(a),
    content: <ArticleBody blocks={a.body} lang={a.lang} />,
    faq: a.faq,
    sources: a.sources,
    related: a.related,
    disclaimer: rules.disclaimer[a.lang],
    cta: "checked",
  }
}

// Each post gets its own title, description, canonical URL and social card.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) return { title: "Page Not Found | HerbalBath SG" }
  const image = `${BASE_URL}${post.image ?? "/images/og-image.jpg"}`
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      locale: post.lang === "zh" ? "zh_SG" : "en_SG",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      images: [{ url: image }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [image] },
  }
}

// Server-rendered: no article text ships as JavaScript. (The page used to be a
// client component that bundled every post's content into every post page.)
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) notFound()
  return <BlogPostView post={post} />
}
