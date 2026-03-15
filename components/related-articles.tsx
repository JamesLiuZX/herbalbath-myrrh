import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { posts, type Post } from "@/app/lib/blog-data"

interface RelatedArticlesProps {
  currentSlug: string
  maxArticles?: number
}

// Map of related slugs for better internal linking
const relatedPostsMap: Record<string, string[]> = {
  "knee-pain-relief-singapore": [
    "gentle-exercises-for-seniors",
    "anti-inflammatory-diet-guide",
    "tcm-vs-western-pain-relief",
  ],
  "myrrh-frankincense-miracle-herbs": [
    "tcm-vs-western-pain-relief",
    "anti-inflammatory-diet-guide",
    "knee-pain-relief-singapore",
  ],
  "anti-inflammatory-diet-guide": [
    "myrrh-frankincense-miracle-herbs",
    "improve-blood-circulation-naturally",
    "knee-pain-relief-singapore",
  ],
  "improve-blood-circulation-naturally": [
    "gentle-exercises-for-seniors",
    "anti-inflammatory-diet-guide",
    "better-sleep-with-chronic-pain",
  ],
  "office-neck-shoulder-pain": [
    "improve-blood-circulation-naturally",
    "better-sleep-with-chronic-pain",
    "gentle-exercises-for-seniors",
  ],
  "tcm-vs-western-pain-relief": [
    "myrrh-frankincense-miracle-herbs",
    "knee-pain-relief-singapore",
    "anti-inflammatory-diet-guide",
  ],
  "better-sleep-with-chronic-pain": [
    "improve-blood-circulation-naturally",
    "gentle-exercises-for-seniors",
    "anti-inflammatory-diet-guide",
  ],
  "gentle-exercises-for-seniors": [
    "knee-pain-relief-singapore",
    "improve-blood-circulation-naturally",
    "better-sleep-with-chronic-pain",
  ],
}

function getRelatedPosts(currentSlug: string, maxArticles: number): Post[] {
  const relatedSlugs = relatedPostsMap[currentSlug] || []
  
  // Get posts by related slugs
  const relatedPosts = relatedSlugs
    .map(slug => posts.find(p => p.slug === slug))
    .filter((p): p is Post => p !== undefined)
    .slice(0, maxArticles)
  
  // If not enough related posts, fill with other random posts
  if (relatedPosts.length < maxArticles) {
    const otherPosts = posts
      .filter(p => p.slug !== currentSlug && !relatedSlugs.includes(p.slug))
      .slice(0, maxArticles - relatedPosts.length)
    relatedPosts.push(...otherPosts)
  }
  
  return relatedPosts.slice(0, maxArticles)
}

export function RelatedArticles({ currentSlug, maxArticles = 3 }: RelatedArticlesProps) {
  const relatedPosts = getRelatedPosts(currentSlug, maxArticles)
  
  if (relatedPosts.length === 0) return null

  return (
    <section className="mt-12 md:mt-16 py-8 border-t border-stone-200">
      <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-6 font-serif">
        相关文章
        <span className="block text-lg font-normal text-stone-600 mt-1">
          Related Articles
        </span>
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="h-full hover:shadow-lg hover:border-emerald-300 transition-all duration-300 cursor-pointer group">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-emerald-800 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-600 text-base line-clamp-2 mb-3">
                  {post.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">{post.date}</span>
                  <span className="flex items-center text-emerald-600 font-medium group-hover:text-emerald-500">
                    阅读更多
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {/* View all link */}
      <div className="text-center mt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-600 font-medium text-lg transition-colors"
        >
          查看全部文章 View All Articles
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  )
}

// Pain points related component for cross-linking
export function RelatedPainPoints({ currentSlug }: { currentSlug: string }) {
  const painPointLinks = [
    { slug: "knee-pain", label: "膝盖疼痛 Knee Pain" },
    { slug: "back-pain", label: "腰酸背痛 Back Pain" },
    { slug: "joint-arthritis", label: "风湿关节炎 Arthritis" },
    { slug: "neck-shoulder-stiffness", label: "肩颈僵硬 Neck Stiffness" },
  ]
  
  // Filter out current page if viewing a pain point page
  const links = painPointLinks.filter(pp => pp.slug !== currentSlug).slice(0, 3)
  
  return (
    <div className="bg-emerald-50 rounded-xl p-6 mt-8">
      <h3 className="font-bold text-emerald-800 text-lg mb-4">
        了解更多疼痛问题
        <span className="block text-sm font-normal text-stone-600">
          Explore more pain points
        </span>
      </h3>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={link.slug}
            href={`/pain-points/${link.slug}`}
            className="px-4 py-2 bg-white border border-emerald-200 rounded-full text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-colors text-base"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/pain-points"
          className="px-4 py-2 bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition-colors text-base"
        >
          查看全部 →
        </Link>
      </div>
    </div>
  )
}
