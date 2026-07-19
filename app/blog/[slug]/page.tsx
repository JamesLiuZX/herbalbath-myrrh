import type { Metadata } from "next"
import { posts } from "@/app/lib/blog-data"
import BlogPostClientPage from "./BlogPostClientPage"

const BASE_URL = "https://herbalbathsg.com"

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Every blog post previously inherited the homepage's generic title/description
// (this file had no generateMetadata, and BlogPostClientPage can't export one
// since it's a client component) — so Search Console saw duplicate titles
// across every article. This gives each post its own title, description,
// canonical URL and OG image, using the data already authored per-post in
// blog-data.tsx.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return { title: "Page Not Found | HerbalBath SG" }
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${BASE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: `${BASE_URL}${post.image}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`${BASE_URL}${post.image}`],
    },
  }
}

// Next.js 15 passes `params` as a Promise to dynamic route pages. This was
// previously left un-awaited and forwarded as-is into the client component,
// which read `params.slug` as `undefined` and called notFound() on every
// request — i.e. every /blog/[slug] URL 404'd in production regardless of
// slug. Awaiting it here (matching the pattern already used correctly in
// app/pain-points/[slug]/page.tsx) resolves the real slug before rendering.
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  return <BlogPostClientPage params={resolvedParams} />
}
