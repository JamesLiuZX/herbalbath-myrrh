"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Play, ExternalLink, Grid3X3, List } from "lucide-react"
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
  const [viewMode, setViewMode] = useState<"wall" | "grid">("wall")

  const allItems = [...screenshots, ...videos]

  const featuredItems = allItems.slice(0, 4) // Large featured testimonials
  const regularItems = allItems.slice(4, 10) // Medium sized testimonials
  const compactItems = allItems.slice(10) // Small testimonials

  if (viewMode === "grid") {
    return (
      <div className="space-y-6">
        {/* View Mode Toggle */}
        <div className="flex justify-center gap-2">
          <Button
            variant={viewMode === "wall" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("wall")}
            className="h-8"
          >
            <Grid3X3 className="w-4 h-4 mr-1" />
            Wall View
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-8"
          >
            <List className="w-4 h-4 mr-1" />
            Grid View
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allItems.map((item, index) => (
            <TestimonialCard
              key={`grid-${index}`}
              item={item}
              index={index}
              isVideo={item.includes("video") || videos.includes(item)}
              videoPlaceholder={videoPlaceholder}
              onImageClick={setSelectedImage}
              size="regular"
            />
          ))}
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

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex justify-center gap-2">
        <Button
          variant={viewMode === "wall" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("wall")}
          className="h-8"
        >
          <Grid3X3 className="w-4 h-4 mr-1" />
          Wall View
        </Button>
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("grid")}
          className="h-8"
        >
          <List className="w-4 h-4 mr-1" />
          Grid View
        </Button>
      </div>

      <div className="space-y-8">
        {/* Featured Section - Large testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredItems.map((item, index) => (
            <TestimonialCard
              key={`featured-${index}`}
              item={item}
              index={index}
              isVideo={item.includes("video") || videos.includes(item)}
              videoPlaceholder={videoPlaceholder}
              onImageClick={setSelectedImage}
              size="large"
            />
          ))}
        </div>

        <div className="flex items-center justify-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="px-4 text-sm text-gray-500 font-medium">更多真实见证</div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Regular Section - Medium testimonials */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {regularItems.map((item, index) => (
            <TestimonialCard
              key={`regular-${index}`}
              item={item}
              index={index}
              isVideo={item.includes("video") || videos.includes(item)}
              videoPlaceholder={videoPlaceholder}
              onImageClick={setSelectedImage}
              size="regular"
            />
          ))}
        </div>

        {/* Compact Section - Small testimonials */}
        {compactItems.length > 0 && (
          <>
            <div className="flex items-center justify-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              <div className="px-4 text-xs text-gray-400 font-medium">精选见证</div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {compactItems.map((item, index) => (
                <TestimonialCard
                  key={`compact-${index}`}
                  item={item}
                  index={index}
                  isVideo={item.includes("video") || videos.includes(item)}
                  videoPlaceholder={videoPlaceholder}
                  onImageClick={setSelectedImage}
                  size="compact"
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* View All Button */}
      {showViewAllButton && (
        <div className="text-center pt-8">
          <Button
            variant="outline"
            size="lg"
            className="bg-white/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
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
  size = "regular",
}: {
  item: string
  index: number
  isVideo: boolean
  videoPlaceholder: any
  onImageClick: (image: string) => void
  size?: "large" | "regular" | "compact"
}) {
  const sizeClasses = {
    large: "w-full group cursor-pointer",
    regular: "w-full group cursor-pointer",
    compact: "w-full group cursor-pointer",
  }

  const cardClasses = {
    large:
      "overflow-hidden h-full transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 group-hover:scale-[1.02]",
    regular:
      "overflow-hidden h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:scale-105",
    compact:
      "overflow-hidden h-full transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5 group-hover:scale-110",
  }

  const aspectRatios = {
    large: "aspect-[4/5]",
    regular: "aspect-[9/16]",
    compact: "aspect-square",
  }

  if (isVideo) {
    return (
      <div className={sizeClasses[size]}>
        <Card className={`border-dashed border-2 border-red-200 bg-red-50/50 ${cardClasses[size]}`}>
          <CardContent className="p-0 h-full">
            <div
              className={`bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center relative h-full ${aspectRatios[size]}`}
            >
              <div className="text-center text-red-700">
                <div
                  className={`bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg ${
                    size === "large" ? "w-16 h-16" : size === "regular" ? "w-12 h-12" : "w-8 h-8"
                  }`}
                >
                  <Play
                    className={`text-red-600 ml-1 ${
                      size === "large" ? "w-8 h-8" : size === "regular" ? "w-6 h-6" : "w-4 h-4"
                    }`}
                  />
                </div>
                <p
                  className={`font-semibold px-4 ${
                    size === "large" ? "text-base" : size === "regular" ? "text-sm" : "text-xs"
                  }`}
                >
                  {size === "compact" ? "视频" : videoPlaceholder.title}
                </p>
              </div>
              <div
                className={`absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded font-bold ${
                  size === "compact" ? "text-xs" : "text-xs"
                }`}
              >
                {size === "compact" ? "即将" : videoPlaceholder.comingSoon}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={sizeClasses[size]} onClick={() => onImageClick(item)}>
      <Card className={cardClasses[size]}>
        <CardContent className="p-0">
          <img
            src={item || "/placeholder.svg?height=400&width=300&query=customer testimonial screenshot"}
            alt={`Testimonial ${index + 1}`}
            className={`w-full h-full object-cover ${aspectRatios[size]}`}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 pointer-events-none" />
        </CardContent>
      </Card>
    </div>
  )
}
