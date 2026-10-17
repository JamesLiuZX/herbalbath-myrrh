import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Lora } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { jsonLd, organizationSchema, websiteSchema } from "@/app/lib/structured-data"

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
  // Google Search Console: add a "URL prefix" property for https://herbalbathsg.com,
  // choose the HTML tag method, and put the content="..." value in Vercel as
  // GOOGLE_SITE_VERIFICATION. Nothing renders until it's set.
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#1a5f4a",
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
    <html lang="zh-SG" className={`${inter.variable} ${lora.variable}`}>
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
        {/* Site-wide JSON-LD. Product markup lives on the homepage only (app/page.tsx). */}
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd([organizationSchema, websiteSchema])} />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
