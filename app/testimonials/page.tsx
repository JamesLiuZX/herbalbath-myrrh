"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Play, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Extended testimonial data - you can add your 50+ images here
const videoTestimonials = [
  "/videos/testimonial-1.mp4",
  "/videos/testimonial-2.mp4",
  "/videos/testimonial-3.mp4",
  "/videos/testimonial-4.mp4",
  "/videos/testimonial-5.mp4",
]

const photoTestimonials = [
  "/images/testimonial-1.png",
  "/images/testimonial-2.png",
  "/images/testimonial-3.png",
  "/images/testimonial-4.png",
  "/images/testimonial-5.png",
  "/images/testimonial-6.png",
  "/images/testimonial-7.png",
  "/images/testimonial-8.png",
  "/images/testimonial-9.png",
  "/images/testimonial-10.png",
  "/images/testimonial-11.png",
  "/images/testimonial-12.png",
  // Add more testimonial images here - up to 50+
  ...Array.from({ length: 38 }, (_, i) => `/images/testimonial-${i + 13}.png`),
]

export default function TestimonialsPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const whatsappNumber = "+6594606058"
  const whatsappMessage = "Hi! I saw all the amazing testimonials. I want to try the Myrrh Spray too!"

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
              onClick={() =>
                window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, "_blank")
              }
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videoTestimonials.map((video, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Card className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0 relative">
                      <div className="aspect-[9/16] bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-red-600 ml-1" />
                          </div>
                          <p className="font-semibold text-gray-800">客户见证 #{index + 1}</p>
                          <p className="text-sm text-gray-600 mt-1">点击观看</p>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        视频
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="p-0 max-w-md bg-transparent border-0 shadow-none">
                  <div className="bg-black rounded-lg overflow-hidden">
                    <video controls className="w-full h-auto" poster="/video-testimonial-thumbnail.png">
                      <source src={video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </section>

        {/* Photo Testimonials Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">图片见证</h2>
              <p className="text-gray-600">WhatsApp 聊天记录和客户反馈</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
              {photoTestimonials.length} 张图片
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {photoTestimonials.map((image, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Card className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                    <CardContent className="p-0">
                      <img
                        src={image || `/placeholder.svg?height=400&width=300&query=customer testimonial ${index + 1}`}
                        alt={`Testimonial ${index + 1}`}
                        className="w-full h-full object-cover aspect-[9/16] group-hover:scale-110 transition-transform duration-300"
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
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">看到这么多真实见证，您还在犹豫吗？</h3>
            <p className="text-lg mb-8 opacity-90">加入15,000+满意客户，体验没药的神奇力量！</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-6"
                onClick={() =>
                  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, "_blank")
                }
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
