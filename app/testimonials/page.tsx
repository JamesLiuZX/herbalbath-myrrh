"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Play, MessageCircle, Star, Users, Clock, Award, Filter, Grid3X3, List } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useReferral } from "@/app/hooks/useReferral"
import { testimonialImages } from "@/app/lib/testimonial-data"

const videoTestimonials = [
  {
    id: "video-1",
    title: "客户见证合集 (第一集)",
    description: "真实客户分享使用效果",
    duration: "Shorts",
    youtubeId: "", // Add your YouTube Shorts ID here
  },
  {
    id: "video-2",
    title: "客户见证合集 (第二集)",
    description: "更多客户真实体验",
    duration: "Shorts",
    youtubeId: "", // Add your YouTube Shorts ID here
  },
]

const photoCategories = [
  { id: "all", name: "全部见证", count: testimonialImages.length },
  { id: "whatsapp", name: "WhatsApp聊天", count: Math.floor(testimonialImages.length * 0.6) },
  { id: "before-after", name: "前后对比", count: Math.floor(testimonialImages.length * 0.2) },
  { id: "reviews", name: "客户评价", count: Math.floor(testimonialImages.length * 0.2) },
]

function TestimonialsPageContent() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry")

  const whatsappNumber = "+6594606058"
  const baseWhatsappMessage = "Hi! I saw all the amazing testimonials. I want to try the Myrrh Spray too!"
  const { getWhatsAppLink } = useReferral(baseWhatsappMessage)

  const getFilteredTestimonials = () => {
    if (activeCategory === "all") return testimonialImages
    const categorySize = Math.floor(testimonialImages.length / 3)
    switch (activeCategory) {
      case "whatsapp":
        return testimonialImages.slice(0, categorySize * 2)
      case "before-after":
        return testimonialImages.slice(categorySize * 2, categorySize * 2 + categorySize)
      case "reviews":
        return testimonialImages.slice(categorySize * 2 + categorySize)
      default:
        return testimonialImages
    }
  }

  const filteredTestimonials = getFilteredTestimonials()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="hover:bg-secondary">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">真实客户见证</h1>
                <p className="text-sm text-gray-600">15,000+ 用户的神奇体验</p>
              </div>
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp咨询
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-green-600 mr-2" />
              <div className="text-3xl font-bold text-green-600">15,000+</div>
            </div>
            <div className="text-sm text-gray-600">满意客户</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-6 h-6 text-blue-600 mr-2" />
              <div className="text-3xl font-bold text-blue-600">98%</div>
            </div>
            <div className="text-sm text-gray-600">复购率</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-orange-600 mr-2" />
              <div className="text-3xl font-bold text-orange-600">10秒</div>
            </div>
            <div className="text-sm text-gray-600">见效时间</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-6 h-6 text-purple-600 mr-2" />
              <div className="text-3xl font-bold text-purple-600">4.9/5</div>
            </div>
            <div className="text-sm text-gray-600">客户评分</div>
          </Card>
        </div>

        {/* Video Testimonials Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">视频见证</h2>
              <p className="text-gray-600">客户亲自分享使用效果</p>
            </div>
            <Badge variant="secondary" className="bg-red-100 text-red-800 px-3 py-1">
              2 个视频
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
            {videoTestimonials.map((video) => (
              <Dialog key={video.id}>
                <DialogTrigger asChild>
                  <Card className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto">
                    <CardContent className="p-0 relative">
                      {/* YouTube Shorts vertical aspect ratio 9:16 */}
                      <div className="aspect-[9/16] w-full sm:w-[280px] relative overflow-hidden rounded-lg">
                        {/* Better placeholder with product-themed gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-red-100">
                          {/* Decorative elements */}
                          <div className="absolute top-6 left-6 w-20 h-20 bg-amber-200/50 rounded-full blur-xl" />
                          <div className="absolute bottom-12 right-4 w-28 h-28 bg-red-200/40 rounded-full blur-2xl" />
                          <div className="absolute top-1/3 right-8 w-16 h-16 bg-orange-200/60 rounded-full blur-lg" />

                          {/* Subtle pattern overlay */}
                          <div
                            className="absolute inset-0 opacity-10"
                            style={{
                              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)`,
                              backgroundSize: "24px 24px",
                            }}
                          />
                        </div>

                        {/* Content overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                          {/* Play button */}
                          <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform mb-6 backdrop-blur-sm">
                            <Play className="w-10 h-10 text-red-600 ml-1" />
                          </div>

                          {/* Video info */}
                          <h3 className="font-bold text-gray-800 text-lg mb-2 text-center">{video.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 text-center">{video.description}</p>
                          <Badge variant="outline" className="bg-white/80 text-xs">
                            {video.duration}
                          </Badge>
                        </div>

                        {/* Featured badge */}
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          精选视频
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="p-0 max-w-sm bg-transparent border-0 shadow-none">
                  <div className="bg-black rounded-lg overflow-hidden">
                    {/* YouTube Shorts vertical aspect ratio for dialog */}
                    <div className="aspect-[9/16] w-full">
                      {video.youtubeId ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${video.youtubeId}`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                          <p className="text-center p-4">
                            视频即将上线
                            <br />
                            Video coming soon
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </section>

        {/* Photo Testimonials Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">图片见证</h2>
              <p className="text-gray-600">WhatsApp 聊天记录和客户反馈</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-lg p-1 bg-background">
                <Button
                  variant={viewMode === "masonry" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("masonry")}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="w-4 h-4 mr-1" />
                  瀑布流
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4 mr-1" />
                  网格
                </Button>
              </div>

              <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                {filteredTestimonials.length} 张图片
              </Badge>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {photoCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className="h-8"
              >
                <Filter className="w-3 h-3 mr-1" />
                {category.name} ({category.count})
              </Button>
            ))}
          </div>

          {/* Photo Grid */}
          <div
            className={
              viewMode === "masonry"
                ? "columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4"
                : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            }
          >
            {filteredTestimonials.map((image, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Card
                    className={`overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${viewMode === "masonry" ? "break-inside-avoid mb-4" : ""}`}
                  >
                    <CardContent className="p-0">
                      <img
                        src={image || `/placeholder.svg?height=400&width=300&query=customer testimonial ${index + 1}`}
                        alt={`Testimonial ${index + 1}`}
                        className={`w-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                          viewMode === "masonry" ? "h-auto" : "aspect-[9/16] h-full"
                        }`}
                        loading="lazy"
                      />
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="p-0 max-w-md bg-transparent border-0 shadow-none">
                  <img
                    src={image || `/placeholder.svg?height=600&width=400&query=customer testimonial ${index + 1}`}
                    alt={`Testimonial ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {/* Load More Button */}
          {filteredTestimonials.length > 20 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                加载更多见证 ({filteredTestimonials.length - 20}+ 张)
              </Button>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 md:p-12 border-0">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">看到这么多真实见证，您还在犹豫吗？</h3>
              <p className="text-lg mb-8 opacity-90">加入15,000+满意客户，体验没药的神奇力量！</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-lg"
                  onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
                >
                  <MessageCircle className="w-6 h-6 mr-2" />
                  立即体验 - WhatsApp咨询
                </Button>
                <div className="flex flex-col sm:flex-row gap-2 text-sm opacity-90">
                  <span>💰 $38 (原价$58)</span>
                  <span>🚚 免费送货</span>
                  <span>📞 买3送1</span>
                </div>
              </div>
              <div className="mt-6 text-sm opacity-75">⭐ 30天不满意，全额退款保证</div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  )
}

export default function TestimonialsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      }
    >
      <TestimonialsPageContent />
    </Suspense>
  )
}
