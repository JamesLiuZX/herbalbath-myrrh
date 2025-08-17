"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Play, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TestimonialsWallProps {
  screenshots: string[]
  videos?: string[]
  videoPlaceholder: {
    title: string
    comingSoon: string
  }
  showViewAllButton?: boolean
}

export function TestimonialsWall({
  screenshots,
  videos = [],
  videoPlaceholder,
  showViewAllButton = true,
}: TestimonialsWallProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Create a mixed array of screenshots and video placeholders
  const allItems = [
    ...screenshots.slice(0, 8), // Show first 8 screenshots
    ...videos.slice(0, 2), // Add 2 video placeholders
    ...screenshots.slice(8, 12), // Add more screenshots
  ]

  return (
    <div className="space-y-8">
      {/* Testimonials Wall Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto px-4">
        {allItems.map((item, index) => {
          const isVideo = item.includes("video") || videos.includes(item)

          return (
            <TestimonialCard
              key={index}
              item={item}
              index={index}
              isVideo={isVideo}
              videoPlaceholder={videoPlaceholder}
              onImageClick={setSelectedImage}
            />
          )
        })}
      </div>

      {/* Floating Stats */}
      <div className="flex justify-center items-center gap-8 flex-wrap text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">15,000+</div>
          <div className="text-sm text-gray-600">满意客户</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">98%</div>
          <div className="text-sm text-gray-600">复购率</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">10秒</div>
          <div className="text-sm text-gray-600">见效时间</div>
        </div>
      </div>

      {/* View All Button */}
      {showViewAllButton && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            size="lg"
            className="bg-white/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 hover:scale-105"
            onClick={() => window.open("/testimonials", "_blank")}
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            查看全部见证 (50+ 图片 + 视频)
          </Button>
        </div>
      )}

      {/* Image Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="p-0 max-w-md bg-transparent border-0 shadow-none">
            <img src={selectedImage || "/placeholder.svg"} alt="Testimonial" className="w-full h-auto rounded-lg" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function TestimonialCard({
  item,
  index,
  isVideo,
  videoPlaceholder,
  onImageClick,
}: {
  item: string
  index: number
  isVideo: boolean
  videoPlaceholder: any
  onImageClick: (image: string) => void
}) {
  if (isVideo) {
    return (
      <div className="group">
        <Card className="overflow-hidden h-full border-dashed border-2 border-red-200 bg-red-50/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="p-0 h-full">
            <div className="aspect-[9/16] bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center relative h-full">
              <div className="text-center text-red-700">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-red-600 ml-1" />
                </div>
                <p className="font-semibold px-4 text-sm">{videoPlaceholder.title}</p>
              </div>
              <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                {videoPlaceholder.comingSoon}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="group cursor-pointer" onClick={() => onImageClick(item)}>
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 border border-gray-200 hover:border-primary/30">
        <CardContent className="p-0">
          <img
            src={item || "/placeholder.svg?height=400&width=300&query=customer testimonial screenshot"}
            alt={`Testimonial ${index + 1}`}
            className="w-full h-full object-cover aspect-[9/16] group-hover:brightness-110 transition-all duration-300"
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-800">
              点击查看大图
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
