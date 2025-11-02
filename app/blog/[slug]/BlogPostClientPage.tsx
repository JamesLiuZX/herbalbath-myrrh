"use client"

import { notFound } from "next/navigation"
import { posts } from "@/app/lib/blog-data"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export default function BlogPostClientPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  const whatsappNumber = "+6584261225"
  const whatsappMessage = encodeURIComponent(
    `Hi! I just read your blog post "${post.title}" and I'm interested in the Myrrh spray.`,
  )

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-red-700">
            草药浴 HerbalBath
          </a>
          <a href="/blog" className="text-gray-600 hover:text-red-600">
            &larr; 返回知识库
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16">
        <article className="max-w-3xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="text-gray-500">
              <span>By {post.author}</span> | <span>{post.date}</span>
            </div>
          </header>

          <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full rounded-2xl shadow-lg mb-8" />

          <div className="prose prose-lg md:prose-xl max-w-none mx-auto">{post.content}</div>
        </article>

        <div className="max-w-3xl mx-auto mt-12 md:mt-16 p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">准备好体验真正的缓解了吗？</h2>
          <p className="text-lg text-gray-700 mb-6">
            我们的没药喷雾结合了古老智慧与现代科技，为您带来快速、深层的疼痛缓解。
          </p>
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-lg"
            onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, "_blank")}
          >
            <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp 咨询订购
          </Button>
        </div>
      </main>
    </div>
  )
}
