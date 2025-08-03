import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { posts } from "@/app/lib/blog-data"

export default function BlogPage() {
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

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">健康知识库</h1>
          <p className="text-xl md:text-2xl text-gray-600 mt-4">学习如何更好地管理疼痛，拥抱健康生活。</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} legacyBehavior>
              <a className="block group">
                <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <CardHeader>
                    <Badge className="mb-2">{post.author}</Badge>
                    <CardTitle className="text-xl md:text-2xl group-hover:text-red-600 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{post.description}</p>
                    <p className="text-sm text-gray-500 mt-4">{post.date}</p>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
