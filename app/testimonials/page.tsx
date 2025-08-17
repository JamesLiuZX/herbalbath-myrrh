"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Play, MessageCircle, Search, Filter, Star, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useReferral } from "@/app/hooks/useReferral"
import { structuredTestimonials, videoTestimonials, categoryLabels } from "@/app/lib/testimonial-data"

export default function TestimonialsPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  const whatsappNumber = "+6594606058"
  const baseWhatsappMessage = "Hi! I saw all the amazing testimonials. I want to try the Myrrh Spray too!"
  const { getWhatsAppLink } = useReferral(baseWhatsappMessage)

  const filteredImageTestimonials = useMemo(() => {
    return structuredTestimonials.filter((testimonial) => {
      const matchesSearch =
        testimonial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || testimonial.category === selectedCategory
      const matchesFeatured = !showFeaturedOnly || testimonial.featured

      return matchesSearch && matchesCategory && matchesFeatured
    })
  }, [searchTerm, selectedCategory, showFeaturedOnly])

  const filteredVideoTestimonials = useMemo(() => {
    return videoTestimonials.filter((testimonial) => {
      const matchesSearch =
        testimonial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || testimonial.category === selectedCategory
      const matchesFeatured = !showFeaturedOnly || testimonial.featured

      return matchesSearch && matchesCategory && matchesFeatured
    })
  }, [searchTerm, selectedCategory, showFeaturedOnly])

  const totalTestimonials = structuredTestimonials.length + videoTestimonials.length
  const verifiedCount = [...structuredTestimonials, ...videoTestimonials].filter((t) => t.verified).length

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
          <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="text-3xl font-bold text-green-600 mb-2">15,000+</div>
            <div className="text-sm text-gray-600">满意客户</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-sm text-gray-600">复购率</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50">
            <div className="text-3xl font-bold text-orange-600 mb-2">10秒</div>
            <div className="text-sm text-gray-600">见效时间</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="text-3xl font-bold text-purple-600 mb-2">4.9/5</div>
            <div className="text-sm text-gray-600">客户评分</div>
          </Card>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索见证内容、客户姓名..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="选择类别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有类别</SelectItem>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showFeaturedOnly ? "default" : "outline"}
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className="w-full sm:w-auto"
            >
              <Star className="w-4 h-4 mr-2" />
              精选见证
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>共 {totalTestimonials} 个见证</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              {verifiedCount} 个已验证
            </span>
            {(searchTerm || selectedCategory !== "all" || showFeaturedOnly) && (
              <>
                <span>•</span>
                <span>显示 {filteredImageTestimonials.length + filteredVideoTestimonials.length} 个结果</span>
              </>
            )}
          </div>
        </div>

        {/* Video Testimonials Section */}
        {filteredVideoTestimonials.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">视频见证</h2>
                <p className="text-gray-600">客户亲自分享使用效果</p>
              </div>
              <Badge variant="secondary" className="bg-red-100 text-red-800 px-3 py-1">
                {filteredVideoTestimonials.length} 个视频
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideoTestimonials.map((testimonial) => (
                <Dialog key={testimonial.id}>
                  <DialogTrigger asChild>
                    <Card className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0 relative">
                        <div className="aspect-[9/16] bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                          <div className="text-center p-4">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-8 h-8 text-red-600 ml-1" />
                            </div>
                            <p className="font-semibold text-gray-800 mb-2">{testimonial.title}</p>
                            {testimonial.customerName && (
                              <p className="text-sm text-gray-600 mb-1">{testimonial.customerName}</p>
                            )}
                            <p className="text-xs text-gray-500">点击观看</p>
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                          视频
                        </div>
                        {testimonial.featured && (
                          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            精选
                          </div>
                        )}
                        {testimonial.verified && (
                          <div className="absolute bottom-3 right-3 bg-green-500 text-white p-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="p-0 max-w-md bg-transparent border-0 shadow-none">
                    <div className="bg-black rounded-lg overflow-hidden">
                      <video controls className="w-full h-auto" poster="/video-testimonial-thumbnail.png">
                        <source src={testimonial.src} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </section>
        )}

        {/* Photo Testimonials Section */}
        {filteredImageTestimonials.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">图片见证</h2>
                <p className="text-gray-600">WhatsApp 聊天记录和客户反馈</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                {filteredImageTestimonials.length} 张图片
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredImageTestimonials.map((testimonial) => (
                <Dialog key={testimonial.id}>
                  <DialogTrigger asChild>
                    <Card className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 relative">
                      <CardContent className="p-0">
                        <img
                          src={testimonial.src || `/placeholder.svg?height=400&width=300&query=${testimonial.title}`}
                          alt={testimonial.title}
                          className="w-full h-full object-cover aspect-[9/16] group-hover:scale-110 transition-transform duration-300"
                        />
                        {testimonial.featured && (
                          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            精选
                          </div>
                        )}
                        {testimonial.verified && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <p className="text-white text-sm font-medium">{testimonial.title}</p>
                          {testimonial.customerName && (
                            <p className="text-white/80 text-xs">{testimonial.customerName}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="p-0 max-w-md bg-transparent border-0 shadow-none">
                    <div className="bg-white rounded-lg overflow-hidden">
                      <img
                        src={testimonial.src || `/placeholder.svg?height=600&width=400&query=${testimonial.title}`}
                        alt={testimonial.title}
                        className="w-full h-auto"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{testimonial.title}</h3>
                        {testimonial.description && <p className="text-gray-600 mb-2">{testimonial.description}</p>}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          {testimonial.customerName && (
                            <span>
                              {testimonial.customerName}
                              {testimonial.age && `, ${testimonial.age}岁`}
                            </span>
                          )}
                          {testimonial.verified && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              已验证
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </section>
        )}

        {/* No Results Message */}
        {filteredImageTestimonials.length === 0 && filteredVideoTestimonials.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">没有找到匹配的见证</h3>
            <p className="text-gray-500 mb-4">尝试调整搜索条件或选择不同的类别</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setShowFeaturedOnly(false)
              }}
            >
              清除筛选条件
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">看到这么多真实见证，您还在犹豫吗？</h3>
            <p className="text-lg mb-8 opacity-90">加入15,000+满意客户，体验没药的神奇力量！</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-6"
                onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
              >
                <MessageCircle className="w-6 h-6 mr-2" />
                立即体验 - WhatsApp咨询
              </Button>
              <div className="text-sm opacity-75">💰 $38 (原价$58) | 🚚 免费送货 | 📞 买3送1</div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  )
}
