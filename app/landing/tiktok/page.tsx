import type { Metadata } from "next"
import { Suspense } from "react"
import TikTokLandingContent from "./TikTokLandingContent"

// Ad-traffic landing page: near-duplicate of the homepage copy, tuned for a
// specific campaign. Indexing it just makes it compete with the homepage for
// the same queries in Google, so it's excluded from search entirely.
export const metadata: Metadata = {
  title: "天然没药疗愈喷雾",
  robots: { index: false, follow: false },
}

export default function TikTokLanding() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <TikTokLandingContent />
    </Suspense>
  )
}
