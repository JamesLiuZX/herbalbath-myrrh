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
        url: "/images/og-image.jpg",
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
    images: ["/images/og-image.jpg"],
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
    // The zh/en toggle is a client-side state switch on a single URL, not two
    // distinct crawlable pages — hreflang requires each entry to point at its
    // own unique URL, so claiming zh-SG and en-SG both resolve to BASE_URL is
    // invalid and Google ignores it. Left unset until (if ever) English gets
    // its own route; see the audit notes for the tradeoffs of adding one.
  },
  // TODO: Verify this domain in Google Search Console (search.google.com/search-console),
  // then add the verification code here, e.g.:
  // verification: { google: "abc123..." },
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
  telephone: "+65 8426 1225",
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
    "https://wa.me/6584261225",
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
    price: "39",
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
  // Mirrors the testimonial already published in the on-page copy
  // (see product_cta/benefits section) — structured data should describe
  // real, existing content, not invented quotes.
  review: {
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
    author: {
      "@type": "Person",
      name: "陈女士 (Mdm. Tan)",
    },
    reviewBody:
      "用了三周，僵硬的肩膀松了很多，抬手很轻松。那种热感真的很神奇，比虎标万金油强太多了！ (After three weeks, my stiff shoulder loosened so much. The heat sensation is amazing - much stronger than Tiger Balm!)",
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

// Ad platform pixels are opt-in via env vars so the site never ships a broken
// or empty pixel call. Set these in Vercel (Project Settings > Environment
// Variables) once you have real IDs from Meta Events Manager / TikTok Ads
// Manager:
//   NEXT_PUBLIC_META_PIXEL_ID=1234567890
//   NEXT_PUBLIC_TIKTOK_PIXEL_ID=ABCDEFG
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
const tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className={`${inter.variable} ${lora.variable}`}>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8XF0GB41LM" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8XF0GB41LM');
            `,
          }}
        />
        {/* Meta (Facebook) Pixel - only loads once NEXT_PUBLIC_META_PIXEL_ID is set */}
        {metaPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${metaPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
        {/* TikTok Pixel - only loads once NEXT_PUBLIC_TIKTOK_PIXEL_ID is set */}
        {tiktokPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function (w, d, t) {
                  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                  ttq.load('${tiktokPixelId}');
                  ttq.page();
                }(window, document, 'ttq');
              `,
            }}
          />
        )}
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
