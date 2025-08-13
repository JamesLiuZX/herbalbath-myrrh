import { Suspense } from "react"
import FacebookLandingContent from "./FacebookLandingContent"

export default function FacebookLanding() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <FacebookLandingContent />
    </Suspense>
  )
}
