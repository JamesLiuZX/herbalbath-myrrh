import { Suspense } from "react"
import TikTokLandingContent from "./TikTokLandingContent"

export default function TikTokLanding() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <TikTokLandingContent />
    </Suspense>
  )
}
