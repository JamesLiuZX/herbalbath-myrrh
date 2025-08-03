"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Play } from "lucide-react"

interface TestimonialsGalleryProps {
  screenshots: string[]
  videoPlaceholder: {
    title: string
    comingSoon: string
  }
}

export function TestimonialsGallery({ screenshots, videoPlaceholder }: TestimonialsGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <>
      <div className="relative">
        <div className="flex overflow-x-auto space-x-4 md:space-x-6 pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Video Placeholders First */}
          {[1, 2].map((i) => (
            <div key={`video-${i}`} className="flex-shrink-0 w-48 md:w-64 group">
              <Card className="overflow-hidden h-full border-dashed border-2">
                <CardContent className="p-0 h-full">
                  <div className="aspect-[9/16] bg-secondary/80 flex items-center justify-center relative h-full">
                    <div className="text-center text-secondary-foreground/60">
                      <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto mb-3">
                        <Play className="w-6 h-6 text-secondary-foreground/60 ml-1" />
                      </div>
                      <p className="font-semibold px-4">{videoPlaceholder.title}</p>
                    </div>
                    <div className="absolute top-3 right-3 bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                      {videoPlaceholder.comingSoon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Screenshot Testimonials */}
          {screenshots.map((src, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div className="flex-shrink-0 w-48 md:w-64 group cursor-pointer">
                  <Card className="overflow-hidden h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                    <CardContent className="p-0">
                      <img
                        src={src || "/placeholder.svg"}
                        alt={`Testimonial ${index + 1}`}
                        className="w-full h-full object-cover aspect-[9/16]"
                      />
                    </CardContent>
                  </Card>
                </div>
              </DialogTrigger>
              <DialogContent className="p-0 max-w-md bg-transparent border-0 shadow-none">
                <img
                  src={src || "/placeholder.svg"}
                  alt={`Testimonial ${index + 1}`}
                  className="w-full h-auto rounded-lg"
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </>
  )
}
