import type React from "react"
import type { Metadata } from "next"
import { Inter, Lora } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-lora" })

export const metadata: Metadata = {
  title: "HerbalBath SG - 唤醒身体自愈力 | 天然没药疗愈喷雾",
  description:
    "体验源自千年智慧的天然疗愈方案。HerbalBath没药喷雾，采用100%天然草本成分，深层舒缓关节与肌肉不适，让您重获行动的自由与喜悦。15,000+用户信赖之选。",
  keywords: "没药喷雾, 疼痛缓解, 关节疼痛, 肌肉酸痛, 天然草药, 新加坡, HerbalBath, 没药, 乳香, 自然疗法",
  openGraph: {
    title: "HerbalBath SG - 唤醒身体自愈力",
    description: "源自千年智慧的天然疗愈方案，15,000+用户信赖之选。",
    images: ["/images/product-hero.png"],
  },
  viewport: "width=device-width, initial-scale=1",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className={`${inter.variable} ${lora.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
