"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Share2, Heart, MessageCircle } from "lucide-react"
import { posts } from "@/app/lib/blog-data"

interface BlogPostClientPageProps {
  slug: string
}

export default function BlogPostClientPage({ slug }: BlogPostClientPageProps) {
  const [liked, setLiked] = useState(false)
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">文章未找到</h1>
          <p className="text-gray-600 mb-8">抱歉，您要查找的文章不存在。</p>
          <Button asChild>
            <a href="/blog">返回博客</a>
          </Button>
        </div>
      </div>
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log("分享失败:", err)
      }
    } else {
      // 备用方案：复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
      alert("链接已复制到剪贴板！")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-red-700">
            草药浴 HerbalBath
          </a>
          <nav className="flex items-center space-x-4">
            <a href="/#solution" className="text-gray-600 hover:text-red-600">
              产品
            </a>
            <a href="/partner" className="text-gray-600 hover:text-red-600">
              成为伙伴
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <a href="/blog" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            返回博客
          </a>
        </Button>

        <article>
          <div className="mb-8">
            <div className="aspect-video overflow-hidden rounded-lg mb-6">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <Badge>{post.author}</Badge>
              <span className="text-sm text-gray-500">{post.date}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>

            <p className="text-xl text-gray-600 mb-6">{post.description}</p>

            <div className="flex items-center gap-4 mb-8">
              <Button
                variant={liked ? "default" : "outline"}
                size="sm"
                onClick={() => setLiked(!liked)}
                className="flex items-center gap-2"
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                {liked ? "已点赞" : "点赞"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2 bg-transparent"
              >
                <Share2 className="w-4 h-4" />
                分享
              </Button>

              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <MessageCircle className="w-4 h-4" />
                评论
              </Button>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">{post.content}</div>
        </article>

        <div className="mt-12 pt-8 border-t">
          <Card>
            <CardHeader>
              <CardTitle>关于作者</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-lg">{post.author.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{post.author}</h3>
                  <p className="text-gray-600">
                    专注于传统中医养生和现代健康管理的结合，致力于为大家提供实用的健康建议。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button asChild size="lg">
            <a href="/#solution">体验草药浴产品</a>
          </Button>
        </div>
      </main>
    </div>
  )
}
