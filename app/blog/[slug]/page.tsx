import { posts } from "@/app/lib/blog-data"
import BlogPostClientPage from "./BlogPostClientPage"

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostClientPage params={params} />
}
