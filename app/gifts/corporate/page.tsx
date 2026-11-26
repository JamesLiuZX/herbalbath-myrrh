import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Mail, MessageCircle } from "lucide-react"
import { CONTACT } from "@/app/lib/growth-config"
import { CORPORATE_EMAIL, CORPORATE_GIFTS } from "@/app/lib/corporate-gifts"

export const metadata: Metadata = {
  title: "企业与团体送礼 Corporate Gifting | 草本沐 HerbalBath",
  description: "为长辈准备一份新加坡品牌的礼物：HerbalBath 没药草本能量油，红金礼盒包装。按数量报价，新加坡全岛包邮。Corporate and group gifting, quote on request.",
  alternates: { canonical: "/gifts/corporate" },
}

// Sized for the same readers as the rest of the site: 18px body text and tap
// targets of 56px or more. Chinese first, then English, on one page, so a
// link shared in a company chat works for everyone without a language switch.
function Section({ lang }: { lang: "zh" | "en" }) {
  const t = CORPORATE_GIFTS[lang]
  const wa = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(t.whatsappText)}`
  return (
    <section lang={lang === "zh" ? "zh-Hans" : "en"} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-10 mb-8">
      {lang === "zh" ? (
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t.title}</h1>
      ) : (
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t.title}</h2>
      )}
      <p className="text-lg md:text-xl text-gray-700 mt-4 leading-relaxed">{t.lead}</p>

      <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.productHeading}</h3>
      <ul className="mt-3 space-y-2 text-lg text-gray-800 list-disc pl-6">
        {t.product.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.stepsHeading}</h3>
      <ol className="mt-3 space-y-2 text-lg text-gray-800 list-decimal pl-6">
        {t.steps.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ol>

      <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.askHeading}</h3>
      <p className="text-lg text-gray-800 mt-3 leading-relaxed">{t.ask}</p>
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <a href={wa} className="inline-flex items-center justify-center gap-2 min-h-[56px] px-6 rounded-xl bg-green-600 text-white text-lg font-semibold hover:bg-green-700">
          <MessageCircle className="w-6 h-6" />
          {t.whatsapp} · {CONTACT.whatsappDisplay}
        </a>
        <a href={`mailto:${CORPORATE_EMAIL}`} className="inline-flex items-center justify-center gap-2 min-h-[56px] px-6 rounded-xl border-2 border-red-700 text-red-700 text-lg font-semibold hover:bg-red-50">
          <Mail className="w-6 h-6" />
          {t.email}
        </a>
      </div>
    </section>
  )
}

export default function CorporateGiftsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-red-700">
            草本沐 HerbalBath
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto mb-8">
          <Image src="/images/product-pack-square.jpg" alt="HerbalBath Myrrh Herbal Energy Oil 没药草本能量油: red-and-gold box and bottle" width={1200} height={1200} className="w-full max-w-sm mx-auto rounded-2xl" priority />
        </div>
        <Section lang="zh" />
        <Section lang="en" />
      </main>
    </div>
  )
}
