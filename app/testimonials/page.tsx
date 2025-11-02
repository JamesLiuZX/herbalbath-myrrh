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
    title: "陈女士的膝盖康复之路",
    description: "3周内从无法上楼到轻松爬山",
    thumbnail: "/images/video-thumb-1.png",
    duration: "2:15",
    featured: true,
  },
  {
    id: "video-2",
    title: "李先生的肩膀疼痛缓解",
    description: "办公室白领的神奇体验",
    thumbnail: "/images/video-thumb-2.png",
    duration: "1:45",
    featured: true,
  },
  {
    id: "video-3",
    title: "王阿姨的风湿改善",
    description: "雨天不再疼痛难忍",
    thumbnail: "/images/video-thumb-3.png",
    duration: "3:20",
    featured: false,
  },
  {
    id: "video-4",
    title: "张先生的运动恢复",
    description: "运动员的专业推荐",
    thumbnail: "/images/video-thumb-4.png",
    duration: "2:30",
    featured: false,
  },
  {
    id: "video-5",
    title: "林女士的关节灵活",
    description: "从僵硬到灵活的转变",
    thumbnail: "/images/video-thumb-5.png",
    duration: "1:55",
    featured: false,
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

  const whatsappNumber = "+6584261225"
  const baseWhatsappMessage = "Hi! I saw all the amazing testimonials. I want to try the Myrrh Spray too!"
  const { getWhatsAppLink } = useReferral(baseWhatsappMessage)

  const getFilteredTestimonials = () => {
    if (activeCategory === "all") return testimonialImages
    // In a real app, you'd have category metadata for each image
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
              {videoTestimonials.length} 个视频
            </Badge>
          </div>

          {/* Featured Videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {videoTestimonials
              .filter((v) => v.featured)
              .map((video, index) => (
                <Dialog key={video.id}>
                  <DialogTrigger asChild>
                    <Card className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0 relative">
                        <div className="aspect-video bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-10 h-10 text-red-600 ml-1" />
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-1">{video.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                            <Badge variant="outline" className="text-xs">
                              {video.duration}
                            </Badge>
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                          精选视频
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="p-0 max-w-2xl bg-transparent border-0 shadow-none">
                    <div className="bg-black rounded-lg overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                        <div className="text-center text-gray-800">
                          <Play className="w-16 h-16 mx-auto mb-4" />
                          <p className="text-lg font-semibold mb-2">{video.title}</p>
                          <p className="text-sm opacity-75">视频即将上线</p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
          </div>

          {/* Regular Videos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTestimonials
              .filter((v) => !v.featured)
              .map((video, index) => (
                <Dialog key={video.id}>
                  <DialogTrigger asChild>
                    <Card className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0 relative">
                        <div className="aspect-[4/3] bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-8 h-8 text-red-600 ml-1" />
                            </div>
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">{video.title}</h4>
                            <p className="text-xs text-gray-600 mb-2 px-2">{video.description}</p>
                            <Badge variant="outline" className="text-xs">
                              {video.duration}
                            </Badge>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                          视频
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="p-0 max-w-lg bg-transparent border-0 shadow-none">
                    <div className="bg-black rounded-lg overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                        <div className="text-center text-gray-800">
                          <Play className="w-12 h-12 mx-auto mb-3" />
                          <p className="font-semibold mb-1">{video.title}</p>
                          <p className="text-sm opacity-75">视频即将上线</p>
                        </div>
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
