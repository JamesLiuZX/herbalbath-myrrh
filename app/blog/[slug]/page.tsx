import { posts } from "@/app/lib/blog-data"
import BlogPostClientPage from "./BlogPostClientPage"

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }))
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
