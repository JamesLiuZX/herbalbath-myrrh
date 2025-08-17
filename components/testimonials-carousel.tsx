"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Play, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TestimonialsCarouselProps {
  screenshots: string[]
  videos?: string[]
  videoPlaceholder: {
    title: string
    comingSoon: string
  }
  showViewAllButton?: boolean
}

export function TestimonialsCarousel({
  screenshots,
  videos = [],
  videoPlaceholder,
  showViewAllButton = true,
}: TestimonialsCarouselProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Create two rows of testimonials for the double-row effect
  const firstRowItems = [...screenshots.slice(0, 6), ...videos.slice(0, 2)]
  const secondRowItems = [...screenshots.slice(6, 12), ...videos.slice(2, 4)]

  return (
    <div className="space-y-6">
      {/* First Row - Auto-scroll left to right */}
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll-right space-x-4 w-max">
          {/* Duplicate items for seamless loop */}
          {[...firstRowItems, ...firstRowItems].map((item, index) => (
            <TestimonialCard
              key={`row1-${index}`}
              item={item}
              index={index}
              isVideo={item.includes("video") || videos.includes(item)}
              videoPlaceholder={videoPlaceholder}
              onImageClick={setSelectedImage}
            />
          ))}
        </div>
      </div>

      {/* Second Row - Auto-scroll right to left */}
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll-left space-x-4 w-max">
          {/* Duplicate items for seamless loop */}
          {[...secondRowItems, ...secondRowItems].map((item, index) => (
            <TestimonialCard
              key={`row2-${index}`}
              item={item}
              index={index}
              isVideo={item.includes("video") || videos.includes(item)}
              videoPlaceholder={videoPlaceholder}
              onImageClick={setSelectedImage}
            />
          ))}
        </div>
      </div>

      {/* View All Button */}
      {showViewAllButton && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            size="lg"
            className="bg-white/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
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
      <div className="flex-shrink-0 w-48 md:w-64 group">
        <Card className="overflow-hidden h-full border-dashed border-2 border-red-200 bg-red-50/50">
          <CardContent className="p-0 h-full">
            <div className="aspect-[9/16] bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center relative h-full">
              <div className="text-center text-red-700">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
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
    <div className="flex-shrink-0 w-48 md:w-64 group cursor-pointer" onClick={() => onImageClick(item)}>
      <Card className="overflow-hidden h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:scale-105">
        <CardContent className="p-0">
          <img
            src={item || "/placeholder.svg?height=400&width=300&query=customer testimonial screenshot"}
            alt={`Testimonial ${index + 1}`}
            className="w-full h-full object-cover aspect-[9/16]"
          />
        </CardContent>
      </Card>
    </div>
  )
}
