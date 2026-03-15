import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Lora } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-lora" })

const BASE_URL = "https://herbalbathsg.com"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "HerbalBath SG - 天然没药疗愈喷雾 | Herbal Bath Singapore | Natural Pain Relief",
    template: "%s | HerbalBath SG",
  },
  description:
    "HerbalBath Singapore - 体验源自千年智慧的天然疗愈方案。没药喷雾采用100%天然草本成分，深层舒缓关节与肌肉疼痛。Singapore's trusted herbal pain relief spray for seniors 55+. Natural myrrh & frankincense formula. 15,000+ satisfied customers.",
  keywords: [
    // Primary target keywords
    "herbalbath",
    "herbal bath",
    "herbalbath singapore",
    "herbalbath sg",
    "herbal bath singapore",
    "herbal bath sg",
    // Chinese keywords
    "没药喷雾",
    "天然止痛",
    "关节疼痛",
    "肌肉酸痛",
    "新加坡草药",
    "乐龄保健",
    // English long-tail
    "myrrh spray singapore",
    "natural pain relief singapore",
    "herbal pain relief elderly",
    "joint pain relief singapore seniors",
    "muscle pain natural remedy",
    "frankincense myrrh spray",
  ],
  authors: [{ name: "HerbalBath SG" }],
  creator: "HerbalBath SG",
  publisher: "HerbalBath SG",
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "zh_SG",
    alternateLocale: "en_SG",
    url: BASE_URL,
    siteName: "HerbalBath SG",
    title: "HerbalBath SG - 天然没药疗愈喷雾 | Natural Herbal Pain Relief Singapore",
    description:
      "新加坡15,000+用户信赖。天然没药乳香配方，10秒见效。Singapore's #1 natural pain relief for seniors.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "HerbalBath SG - Natural Herbal Pain Relief",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HerbalBath SG - Natural Herbal Pain Relief",
    description: "Singapore's trusted natural pain relief. 15,000+ satisfied customers.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "zh-SG": BASE_URL,
      "en-SG": BASE_URL,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#1a5f4a",
}

// JSON-LD Structured Data
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE_URL}/#organization`,
  name: "HerbalBath SG",
  alternateName: ["HerbalBath Singapore", "Herbal Bath SG", "Herbal Bath Singapore"],
  description:
    "Singapore's trusted natural herbal pain relief spray. Specializing in myrrh and frankincense-based products for seniors.",
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo.png`,
  image: `${BASE_URL}/images/product-hero.png`,
  telephone: "+65 8893 0ستقم", // Replace with actual number
  email: "hello@herbalbathsg.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "SG",
    addressRegion: "Singapore",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 1.3521,
    longitude: 103.8198,
  },
  areaServed: {
    "@type": "Country",
    name: "Singapore",
  },
  priceRange: "$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  sameAs: [
    "https://www.facebook.com/herbalbathsg",
    "https://www.tiktok.com/@herbalbathsg",
    "https://wa.me/6588930XXX", // Replace with actual WhatsApp
  ],
}

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "HerbalBath Myrrh Spray 没药喷雾",
  description:
    "100% natural myrrh and frankincense spray for joint and muscle pain relief. Works in 10 seconds.",
  image: `${BASE_URL}/images/product-hero.png`,
  brand: {
    "@type": "Brand",
    name: "HerbalBath",
  },
  offers: {
    "@type": "Offer",
    url: BASE_URL,
    priceCurrency: "SGD",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: {
      "@type": "Organization",
      name: "HerbalBath SG",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "15000",
    bestRating: "5",
    worstRating: "1",
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HerbalBath SG",
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo.png`,
  description: "Singapore's trusted natural herbal pain relief brand since 2016.",
  foundingDate: "2016",
  areaServed: "Singapore",
  slogan: "唤醒身体自愈力 - Awaken Your Body's Natural Healing Power",
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HerbalBath SG",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/blog?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className={`${inter.variable} ${lora.variable}`}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
