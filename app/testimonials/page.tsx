import type { Metadata } from "next"
import TestimonialsPageClient from "./TestimonialsPageClient"

// Previously this whole route was a "use client" file, so it had no way to
// export unique metadata and silently inherited the homepage's title/
// description — Search Console would see this as a duplicate. Splitting the
// interactive UI into TestimonialsPageClient keeps the client behavior
// identical while letting this server file own its own SEO metadata.
export const metadata: Metadata = {
  title: "真实客户见证 | Customer Testimonials",
  description:
    "15,000+新加坡用户的真实使用见证，WhatsApp聊天记录、客户评价与视频分享。See real testimonials, WhatsApp chat screenshots, and video reviews from 15,000+ satisfied HerbalBath customers in Singapore.",
  alternates: {
    canonical: "https://herbalbathsg.com/testimonials",
  },
  openGraph: {
    title: "真实客户见证 - HerbalBath SG",
    description: "15,000+新加坡用户的真实使用见证",
    type: "website",
  },
}

export default function TestimonialsPage() {
  return <TestimonialsPageClient />
}
