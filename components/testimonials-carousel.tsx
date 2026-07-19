"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Play, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export interface VideoTestimonial {
  youtubeId: string
  title: string
}

interface TestimonialsCarouselProps {
  screenshots: string[]
  videos?: VideoTestimonial[]
  videoPlaceholder: {
    title: string
    comingSoon: string
  }
  showViewAllButton?: boolean
}

type GridItem = { type: "image"; src: string } | { type: "video"; video: VideoTestimonial }

export function TestimonialsCarousel({
  screenshots,
  videos = [],
  videoPlaceholder,
  showViewAllButton = true,
}: TestimonialsCarouselProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<VideoTestimonial | null>(null)

  // Videos first — they're the highest-engagement testimonial format we have,
  // so lead with them rather than burying real customer videos behind screenshots.
  const allItems: GridItem[] = [
    ...videos.map((video) => ({ type: "video" as const, video })),
    ...screenshots.map((src) => ({ type: "image" as const, src })),
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {allItems.map((item, index) =>
          item.type === "video" ? (
            <VideoCard
              key={`video-${item.video.youtubeId}`}
              video={item.video}
              videoPlaceholder={videoPlaceholder}
              onPlay={setSelectedVideo}
            />
          ) : (
            <TestimonialCard
              key={`image-${index}`}
              src={item.src}
              index={index}
              onImageClick={setSelectedImage}
              priority={index < 6}
            />
          ),
        )}
      </div>

      {/* View All Button */}
      {showViewAllButton && (
        <div className="text-center pt-4 sm:pt-6">
          <Button
            variant="outline"
            size="lg"
            className="bg-white/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-sm sm:text-base px-4 sm:px-6 h-10 sm:h-12"
            onClick={() => window.open("/testimonials", "_blank")}
          >
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="hidden xs:inline">查看全部见证 ({screenshots.length}+ 张图片 + 视频)</span>
            <span className="xs:hidden">查看全部见证</span>
          </Button>
        </div>
      )}

      {/* Image Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="p-0 max-w-[90vw] sm:max-w-md bg-transparent border-0 shadow-none">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Testimonial"
              width={600}
              height={800}
              className="w-full h-auto rounded-lg"
              quality={90}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Video Dialog */}
      {selectedVideo && (
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="p-0 max-w-sm bg-black border-0 shadow-none overflow-hidden">
            <div className="aspect-[9/16] w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function VideoCard({
  video,
  videoPlaceholder,
  onPlay,
}: {
  video: VideoTestimonial
  videoPlaceholder: { title: string; comingSoon: string }
  onPlay: (video: VideoTestimonial) => void
}) {
  return (
    <div className="w-full group cursor-pointer" onClick={() => onPlay(video)}>
      <Card className="overflow-hidden h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:scale-105">
        <CardContent className="p-0 h-full">
          <div className="relative h-full aspect-[9/16]">
            {/* Real YouTube thumbnail — served from YouTube's CDN at zero cost
                to our bandwidth, and signals there's an actual playable video
                instead of the old static "coming soon" placeholder. */}
            <Image
              src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt={video.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/95 rounded-full flex items-center justify-center shadow-lg">
                <Play className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 ml-0.5" />
              </div>
            </div>
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-bold">
              视频
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TestimonialCard({
  src,
  index,
  onImageClick,
  priority = false,
}: {
  src: string
  index: number
  onImageClick: (image: string) => void
  priority?: boolean
}) {
  return (
    <div className="w-full group cursor-pointer" onClick={() => onImageClick(src)}>
      <Card className="overflow-hidden h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:scale-105">
        <CardContent className="p-0 relative">
          <Image
            src={src || "/placeholder.svg?height=400&width=300&query=customer testimonial screenshot"}
            alt={`真实客户 HerbalBath 没药喷雾使用反馈 ${index + 1}`}
            width={300}
            height={533}
            className="w-full h-full object-cover aspect-[9/16]"
            loading={priority ? undefined : "lazy"}
            priority={priority}
            quality={75}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 pointer-events-none" />
        </CardContent>
      </Card>
    </div>
  )
}
