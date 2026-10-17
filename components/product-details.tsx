import Image from "next/image"
import Link from "next/link"
import { CONTACT, RETAIL } from "@/app/lib/growth-config"

// The homepage's long product-detail column, read top to bottom the way a
// Shopee or Taobao listing is: the listing's own explainer images, with real
// text panels between them so the page has words a search engine (and a screen
// reader) can read.
//
// A server component: the homepage passes both languages in as props, so none
// of this ships as client JavaScript.
//
// The images are James's Shopee listing images. The infographic is cut into
// panels (public/images/details/formula, climate, family); its middle panel,
// with the sprain, rheumatism and "detox" claims and the old 58 ml bottle, is
// left out on purpose. Text written here sticks to the approved claims in
// ops/knowledge/product.md.

type Lang = "zh" | "en"

const IMG = "/images/details"

const copy = {
  zh: {
    heading: "产品详情",
    hint: "往下滑，看看这瓶草本油",
    alt: {
      comfort: "草本沐没药草本能量油 55ml 包装盒与瓶身，新加坡品牌",
      formula: "没药草本能量油：多达15味中草药 · 高浓缩 · 协同配方",
      climate: "东南亚湿热气候，热感强烈的没药草本能量油",
      lifestyle: "没药草本能量油、包装盒与没药原料",
      family: "一瓶在手，全家受用 · 新加坡市场热销",
      pack: "草本沐没药草本能量油 55ml，白底产品图",
    },
    story: {
      eyebrow: "没药 · 乳香",
      title: "流传两千年的温热香料",
      body: [
        "没药和乳香，都是从树皮里慢慢渗出的天然树脂。两千年前，它们和黄金一起，被当作最珍贵的礼物；在传统中医里，没药与乳香也常常搭配使用。",
        "草本沐把这份传统，和多达15味中草药放在一起，做成一瓶方便每天使用的草本油。",
      ],
      stats: [
        { prefix: "多达", value: "15", unit: "味", label: "中草药" },
        { prefix: "", value: "10", unit: "秒", label: "感受温热" },
        { prefix: "", value: "3–4", unit: "个月", label: "一瓶可用" },
      ],
    },
    usage: {
      eyebrow: "使用方法",
      title: "每天两次，简单三步",
      steps: [
        { title: "涂抹", desc: "涂在肩颈、腰背或膝盖。" },
        { title: "按压", desc: "用手掌轻轻按压约10秒，感受温热。" },
        { title: "坚持", desc: "每天2次，一瓶可用3–4个月。" },
      ],
      note: "仅供外用。请避开眼睛、伤口和破损皮肤；孕妇或有健康问题的人士，使用前请先咨询医生。",
    },
    moments: {
      eyebrow: "日常时刻",
      title: "适合这些时候",
      items: [
        { text: "伏案工作一整天之后的肩颈", href: "/pain-points/neck-shoulder-stiffness" },
        { text: "站了一整天的腰背和脚跟", href: "/pain-points/back-pain" },
        { text: "散步、运动之后的膝盖", href: "/pain-points/knee-pain" },
        { text: "送给爸妈和长辈的一份心意", href: "#product-cta" },
      ],
      more: "按部位阅读更多",
    },
    specs: {
      eyebrow: "规格参数",
      title: "产品信息",
      rows: [
        ["品名", "没药草本能量油 Myrrh Herbal Energy Oil"],
        ["品牌", "草本沐 HerbalBath（新加坡品牌）"],
        ["容量", "55ml"],
        ["成分", "没药、乳香等，多达15味中草药"],
        ["用法", "外用，涂抹后用手掌按压约10秒"],
        ["用量", "每天2次，一瓶可用3–4个月"],
        ["售价", `S$${RETAIL.singlePrice} 一瓶 · 买3送1（${RETAIL.bundleBottles}瓶 S$${RETAIL.bundlePrice}）`],
        ["配送", "新加坡全岛免费送货"],
      ],
    },
    promise: {
      eyebrow: "购买保障",
      title: "放心买",
      items: [
        { title: "30天不满意，全额退款", desc: "30天内联系我们，就能申请退款。" },
        { title: "全岛免费送货", desc: "新加坡任何地址，一瓶也免运费。" },
        { title: "PayNow 扫码付款", desc: "金额和备注自动填好，扫一下就行。" },
        { title: "真人客服", desc: `WhatsApp 或电话 ${CONTACT.whatsappDisplay}，中文英文都可以。` },
      ],
      choose: "选择套餐",
      pay: "PayNow 立即订购",
    },
  },
  en: {
    heading: "Product details",
    hint: "Scroll down to see what's in the bottle",
    alt: {
      comfort: "HerbalBath Myrrh Herbal Energy Oil, 55ml, box and bottle, a Singapore brand",
      formula: "Myrrh Herbal Energy Oil: up to 15 Chinese herbs, high concentration, synergistic formula",
      climate: "Made for Southeast Asia's humid climate, with a strong heat sensation",
      lifestyle: "Myrrh Herbal Energy Oil with its box and raw myrrh resin",
      family: "One bottle for the whole family; a hot seller in Singapore",
      pack: "HerbalBath Myrrh Herbal Energy Oil, 55ml, on white",
    },
    story: {
      eyebrow: "Myrrh · Frankincense",
      title: "Two thousand years of warmth",
      body: [
        "Myrrh and frankincense are resins that seep slowly from the bark of desert trees. Two thousand years ago they were given alongside gold as the most precious of gifts, and traditional Chinese medicine has long paired the two.",
        "HerbalBath brings that tradition together with up to 15 Chinese herbs, in an oil made for everyday use.",
      ],
      stats: [
        { prefix: "up to", value: "15", unit: "", label: "Chinese herbs" },
        { prefix: "", value: "10", unit: "s", label: "to feel the warmth" },
        { prefix: "", value: "3–4", unit: "mo", label: "from one bottle" },
      ],
    },
    usage: {
      eyebrow: "How to use",
      title: "Twice a day, three simple steps",
      steps: [
        { title: "Apply", desc: "to the shoulders, back or knees." },
        { title: "Press", desc: "gently with your palm for about 10 seconds, and feel the warmth." },
        { title: "Keep at it", desc: "twice a day. One bottle lasts 3–4 months." },
      ],
      note: "For external use only. Keep away from the eyes, cuts and broken skin. If you are pregnant or have a health condition, ask your doctor first.",
    },
    moments: {
      eyebrow: "Everyday moments",
      title: "Made for times like these",
      items: [
        { text: "Shoulders and neck after a long day at the desk", href: "/pain-points/neck-shoulder-stiffness" },
        { text: "Back and heels after a day on your feet", href: "/pain-points/back-pain" },
        { text: "Knees after a walk or a game", href: "/pain-points/knee-pain" },
        { text: "A thoughtful gift for parents and grandparents", href: "#product-cta" },
      ],
      more: "Read more by area",
    },
    specs: {
      eyebrow: "Specifications",
      title: "Product information",
      rows: [
        ["Name", "Myrrh Herbal Energy Oil 没药草本能量油"],
        ["Brand", "HerbalBath 草本沐 (a Singapore brand)"],
        ["Size", "55ml"],
        ["Ingredients", "Myrrh, frankincense and up to 15 Chinese herbs"],
        ["How to use", "External use. Apply, then press with your palm for about 10 seconds"],
        ["How long it lasts", "Twice a day, one bottle lasts 3–4 months"],
        ["Price", `S$${RETAIL.singlePrice} a bottle · Buy 3 get 1 free (${RETAIL.bundleBottles} for S$${RETAIL.bundlePrice})`],
        ["Delivery", "Free, anywhere in Singapore"],
      ],
    },
    promise: {
      eyebrow: "Our promise",
      title: "Buy with confidence",
      items: [
        { title: "30-day money-back guarantee", desc: "Not for you? Contact us within 30 days for a full refund." },
        { title: "Free delivery island-wide", desc: "Any address in Singapore, even for one bottle." },
        { title: "Pay by PayNow", desc: "Scan the QR; the amount and reference are filled in." },
        { title: "Real people", desc: `WhatsApp or call ${CONTACT.whatsappDisplay}, in English or Chinese.` },
      ],
      choose: "Choose a package",
      pay: "Order now · PayNow",
    },
  },
} as const

/** A full-width image in the column, sized from its real dimensions. */
function Panel({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes="(min-width: 640px) 600px, 100vw"
      className="block h-auto w-full"
    />
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-sm font-semibold tracking-[0.2em] text-copper-600">
      <span aria-hidden="true" className="h-px w-8 bg-copper-500" />
      {children}
    </p>
  )
}

export function ProductDetails({ lang }: { lang: Lang }) {
  const t = copy[lang]

  return (
    <section id="details" aria-labelledby="details-heading" className="bg-cream py-8 sm:py-14">
      <div className="mx-auto mb-5 max-w-[600px] px-4 text-center sm:mb-7">
        <h2 id="details-heading" className="font-serif text-3xl font-bold text-brand-800 sm:text-4xl">
          {t.heading}
        </h2>
        <p className="mt-2 text-base text-stone-600">{t.hint} ↓</p>
      </div>

      <div className="mx-auto max-w-[600px] overflow-hidden bg-white shadow-[0_1px_0_rgba(43,26,18,0.06),0_18px_50px_-24px_rgba(43,26,18,0.35)] sm:rounded-3xl">
        <Panel src={`${IMG}/comfort.webp`} alt={t.alt.comfort} width={823} height={1097} />
        <Panel src={`${IMG}/formula.webp`} alt={t.alt.formula} width={589} height={419} />
        <Panel src={`${IMG}/climate.webp`} alt={t.alt.climate} width={589} height={269} />

        {/* The tradition, in words */}
        <div className="px-6 py-10 sm:px-10 sm:py-12">
          <Eyebrow>{t.story.eyebrow}</Eyebrow>
          <h3 className="mt-3 font-serif text-2xl font-bold leading-snug text-stone-900 sm:text-3xl">
            {t.story.title}
          </h3>
          {t.story.body.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-base leading-relaxed text-stone-700">
              {paragraph}
            </p>
          ))}
          <dl className="mt-8 grid grid-cols-3 divide-x divide-brand-100 border-y border-brand-100">
            {t.story.stats.map((stat) => (
              <div key={stat.label} className="px-2 py-5 text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="whitespace-nowrap text-brand-700">
                    {stat.prefix && <span className="mr-1 text-sm font-semibold">{stat.prefix}</span>}
                    <span className="font-serif text-3xl font-bold sm:text-5xl">{stat.value}</span>
                    <span className="ml-0.5 text-base font-semibold">{stat.unit}</span>
                  </span>
                  <span aria-hidden="true" className="mt-1 block text-sm text-stone-600">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Panel src="/images/product-lifestyle.webp" alt={t.alt.lifestyle} width={547} height={730} />

        {/* How to use */}
        <div id="usage" className="scroll-mt-20 bg-[#FBF4E8] px-6 py-10 sm:px-10 sm:py-12">
          <Eyebrow>{t.usage.eyebrow}</Eyebrow>
          <h3 className="mt-3 font-serif text-2xl font-bold leading-snug text-stone-900 sm:text-3xl">
            {t.usage.title}
          </h3>
          <ol className="mt-7 space-y-6">
            {t.usage.steps.map((step, index) => (
              <li key={step.title} className="flex gap-5">
                <span aria-hidden="true" className="w-8 shrink-0 font-serif text-4xl font-bold leading-none text-copper-500">
                  {index + 1}
                </span>
                <p className="text-lg leading-relaxed text-stone-800">
                  <span className="font-bold text-brand-800">{step.title}</span>
                  {lang === "zh" ? "：" : " "}
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-8 border-t border-brand-200/70 pt-5 text-sm leading-relaxed text-stone-600">{t.usage.note}</p>
        </div>

        {/* When people reach for it */}
        <div className="px-6 py-10 sm:px-10 sm:py-12">
          <Eyebrow>{t.moments.eyebrow}</Eyebrow>
          <h3 className="mt-3 font-serif text-2xl font-bold leading-snug text-stone-900 sm:text-3xl">
            {t.moments.title}
          </h3>
          <ul className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
            {t.moments.items.map((item) => (
              <li key={item.text}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-4 py-4 text-lg text-stone-800 transition-colors hover:text-brand-700"
                >
                  <span className="border-l-4 border-copper-500 pl-4">{item.text}</span>
                  <span aria-hidden="true" className="text-copper-500 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-base">
            <Link href="/pain-points" className="font-semibold text-brand-700 underline-offset-4 hover:underline">
              {t.moments.more} →
            </Link>
          </p>
        </div>

        <Panel src={`${IMG}/family.webp`} alt={t.alt.family} width={589} height={228} />
        <Panel src={`${IMG}/pack-white.webp`} alt={t.alt.pack} width={900} height={1201} />

        {/* Specifications */}
        <div id="specs" className="scroll-mt-20 px-6 pb-10 pt-2 sm:px-10 sm:pb-12">
          <Eyebrow>{t.specs.eyebrow}</Eyebrow>
          <h3 className="mt-3 font-serif text-2xl font-bold leading-snug text-stone-900 sm:text-3xl">
            {t.specs.title}
          </h3>
          <table className="mt-6 w-full border-collapse text-left text-base">
            <tbody>
              {t.specs.rows.map(([label, value]) => (
                <tr key={label} className="border-b border-stone-200 last:border-b-0">
                  <th scope="row" className="w-[32%] py-3 pr-4 align-top font-semibold text-stone-500">
                    {label}
                  </th>
                  <td className="py-3 text-stone-900">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Promise and the way to buy */}
        <div className="bg-brand-800 px-6 py-10 text-cream sm:px-10 sm:py-12">
          <p className="flex items-center gap-3 text-sm font-semibold tracking-[0.2em] text-copper-400">
            <span aria-hidden="true" className="h-px w-8 bg-copper-400" />
            {t.promise.eyebrow}
          </p>
          <h3 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">{t.promise.title}</h3>
          <dl className="mt-7 grid gap-x-6 gap-y-6 sm:grid-cols-2">
            {t.promise.items.map((item) => (
              <div key={item.title} className="border-t border-cream/25 pt-4">
                <dt className="text-lg font-bold">{item.title}</dt>
                <dd className="mt-1 text-base leading-relaxed text-cream/80">{item.desc}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#product-cta"
              className="inline-flex h-14 flex-1 items-center justify-center rounded-2xl bg-cream px-6 text-lg font-bold text-brand-800 transition-colors hover:bg-white"
            >
              {t.promise.choose}
            </a>
            <Link
              href="/pay?b=bundle"
              className="inline-flex h-14 flex-1 items-center justify-center rounded-2xl border-2 border-cream/70 px-6 text-lg font-bold text-cream transition-colors hover:bg-cream/10"
            >
              {t.promise.pay}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
