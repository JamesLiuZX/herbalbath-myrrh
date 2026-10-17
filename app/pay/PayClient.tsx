"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CreditCard,
  Download,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react"
import { PayNowQr, renderPayNowCard } from "@/components/paynow-qr"
import { useReferral } from "@/app/hooks/useReferral"
import { buildPayNowPayload, newOrderReference, PAYNOW_MERCHANT } from "@/app/lib/paynow"
import { CARD_PAYMENT_LINKS, CONTACT, RETAIL } from "@/app/lib/growth-config"
import { shareOrDownloadCard } from "@/app/lib/share-card"

type Lang = "zh" | "en"
type PackageId = "single" | "bundle"

const MAX_QTY = 10
const REF_STORAGE_KEY = "hb-pay-ref"

const PACKAGES: Record<PackageId, { price: number; bottles: number; zh: string; en: string }> = {
  single: { price: RETAIL.singlePrice, bottles: 1, zh: "单瓶", en: "1 bottle" },
  bundle: {
    price: RETAIL.bundlePrice,
    bottles: RETAIL.bundleBottles,
    zh: `买3送1（${RETAIL.bundleBottles}瓶）`,
    en: `Buy 3 Get 1 (${RETAIL.bundleBottles} bottles)`,
  },
}

const COPY = {
  zh: {
    back: "返回首页",
    title: "PayNow 付款",
    subtitle: "金额和参考号已经帮您填好，扫码就能付。",
    step1: "选择套餐",
    popular: "最受欢迎",
    perBottle: (p: string) => `每瓶 ${p}`,
    qty: "数量",
    total: "合计",
    step2: "扫码付款",
    generating: "正在生成付款二维码…",
    payee: "收款方",
    amount: "金额",
    amountLocked: "已锁定",
    reference: "参考号",
    save: "保存二维码到相册",
    saving: "正在生成图片…",
    howTitle: "在手机上付款",
    how: [
      "点上面「保存二维码到相册」",
      "打开银行 App（DBS/POSB、OCBC、UOB 等），选「扫码付款 Scan & Pay」",
      "点「相册 / 照片」，选刚保存的二维码",
      "核对收款方 HERBALBATH PTE. LTD. 和金额，确认付款",
    ],
    desktop: "在电脑上？直接用手机银行 App 扫屏幕上的二维码。",
    fallbackTitle: "扫不了？用我们的通用 PayNow 二维码",
    fallbackBody: (amount: string, ref: string) =>
      `这个二维码需要您自己输入金额：请输入 ${amount}，并在备注（Reference）填写 ${ref}。`,
    step3: "付款后，WhatsApp 告诉我们",
    paidCta: "我已付款 · WhatsApp 确认",
    paidNote: "我们核对款项后安排全岛免费送货。请在 WhatsApp 里回复姓名和地址。",
    otherTitle: "其他方式",
    card: "信用卡 / Apple Pay 付款",
    cod: "WhatsApp 下单 · 货到付款",
    call: "打电话订购",
    trust: ["30天不满意全额退款", "新加坡全岛免费送货", "新加坡注册公司"],
    cardHints: ["打开银行 App →「扫码付款」", "从相册选这张图片即可付款"] as [string, string],
    paidMessage: (amount: string, pkg: string, qty: number, ref: string) =>
      `你好！我刚用 PayNow 付款了 ${amount}\n套餐：${pkg} × ${qty}\n参考号：${ref}\n\n姓名：\n送货地址：\n联系电话：`,
    codMessage: (amount: string, pkg: string, qty: number) =>
      `你好！我想订购 HerbalBath 没药喷雾，货到付款\n套餐：${pkg} × ${qty}（${amount}）\n\n姓名：\n送货地址：\n联系电话：`,
  },
  en: {
    back: "Back to home",
    title: "Pay with PayNow",
    subtitle: "The amount and reference are already filled in. Just scan and pay.",
    step1: "Choose your package",
    popular: "Most popular",
    perBottle: (p: string) => `${p} per bottle`,
    qty: "Quantity",
    total: "Total",
    step2: "Scan to pay",
    generating: "Preparing your PayNow QR…",
    payee: "Payee",
    amount: "Amount",
    amountLocked: "locked",
    reference: "Reference",
    save: "Save QR to photos",
    saving: "Preparing image…",
    howTitle: "Paying on this phone",
    how: [
      "Tap \"Save QR to photos\" above",
      "Open your bank app (DBS/POSB, OCBC, UOB…) and choose Scan & Pay",
      "Pick the saved QR from your photos",
      "Check the payee is HERBALBATH PTE. LTD. and the amount, then confirm",
    ],
    desktop: "On a computer? Scan the QR on screen with your banking app.",
    fallbackTitle: "Can't scan it? Use our standard PayNow QR",
    fallbackBody: (amount: string, ref: string) =>
      `This QR needs you to type the amount: enter ${amount} and put ${ref} as the reference.`,
    step3: "After paying, tell us on WhatsApp",
    paidCta: "I've paid · Confirm on WhatsApp",
    paidNote: "We check the payment, then deliver free island-wide. Reply with your name and address in the chat.",
    otherTitle: "Other ways to pay",
    card: "Pay by card / Apple Pay",
    cod: "Order on WhatsApp · Cash on delivery",
    call: "Call to order",
    trust: ["30-day money-back guarantee", "Free island-wide delivery", "Singapore-registered company"],
    cardHints: ["Open your bank app → Scan & Pay", "then pick this image from your photos"] as [string, string],
    paidMessage: (amount: string, pkg: string, qty: number, ref: string) =>
      `Hi! I've just paid ${amount} by PayNow\nPackage: ${pkg} × ${qty}\nReference: ${ref}\n\nName:\nDelivery address:\nPhone:`,
    codMessage: (amount: string, pkg: string, qty: number) =>
      `Hi! I'd like to order the HerbalBath Myrrh Spray, cash on delivery\nPackage: ${pkg} × ${qty} (${amount})\n\nName:\nDelivery address:\nPhone:`,
  },
} as const

const money = (n: number) => `S$${n.toFixed(2)}`

function trackPixel(event: string, value: number) {
  window.fbq?.("track", event, { value, currency: "SGD" })
  window.ttq?.track(event, { value, currency: "SGD" })
}

export function PayClient() {
  const [lang, setLang] = useState<Lang>("zh")
  const [pkg, setPkg] = useState<PackageId>("bundle")
  const [qty, setQty] = useState(1)
  const [reference, setReference] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [fallbackOpen, setFallbackOpen] = useState(false)

  // Query params set the starting order so a link like /pay?b=single&q=2 can be
  // sent in a chat. Read once from window.location for the same reason
  // useReferral does: useSearchParams would make the page client-only.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const b = params.get("b")
    if (b === "single" || b === "bundle") setPkg(b)
    const q = Number(params.get("q"))
    if (Number.isInteger(q) && q >= 1) setQty(Math.min(q, MAX_QTY))
    if (params.get("lang") === "en") setLang("en")

    // One reference per visit: changing the package must not orphan a QR the
    // visitor may already have saved, so the reference survives a reload too.
    let ref = sessionStorage.getItem(REF_STORAGE_KEY)
    if (!ref) {
      ref = newOrderReference()
      sessionStorage.setItem(REF_STORAGE_KEY, ref)
    }
    setReference(ref)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-SG" : "en-SG"
  }, [lang])

  const t = COPY[lang]
  const choice = PACKAGES[pkg]
  const total = choice.price * qty
  const totalText = money(total)
  const pkgLabel = choice[lang]

  const payload = useMemo(
    () => (reference ? buildPayNowPayload({ amount: total, reference }) : null),
    [reference, total],
  )

  useEffect(() => {
    if (reference) trackPixel("InitiateCheckout", total)
    // Fire once per visit, not on every package change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference])

  const paid = useReferral(t.paidMessage(totalText, pkgLabel, qty, reference ?? ""))
  const cod = useReferral(t.codMessage(totalText, pkgLabel, qty))

  const cardLink = CARD_PAYMENT_LINKS[pkg]
  const cardHref = cardLink && reference ? `${cardLink}?client_reference_id=${reference}` : ""

  const handleSave = async () => {
    if (!payload || !reference) return
    setSaving(true)
    try {
      const blob = await renderPayNowCard({
        payload,
        amountText: totalText,
        reference,
        payee: PAYNOW_MERCHANT.name,
        hints: t.cardHints,
      })
      if (blob) {
        trackPixel("AddPaymentInfo", total)
        await shareOrDownloadCard(blob, `herbalbath-paynow-${reference}.png`, `HerbalBath PayNow ${totalText} ${reference}`)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FBF4E8] pb-16 text-stone-900">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#FBF4E8]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link href="/" className="inline-flex items-center gap-2 text-base font-medium text-stone-700">
            <ArrowLeft className="h-5 w-5" />
            {t.back}
          </Link>
          <div className="flex rounded-full border border-stone-300 bg-white p-1 text-sm">
            {(["zh", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-4 py-1.5 font-medium ${lang === l ? "bg-stone-900 text-white" : "text-stone-600"}`}
              >
                {l === "zh" ? "中文" : "EN"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 pt-6">
        <div className="flex items-center gap-4">
          <Image
            src="/images/product-cutout.webp"
            alt="HerbalBath 没药舒缓喷雾"
            width={709}
            height={1500}
            className="h-24 w-auto shrink-0 drop-shadow-md"
            priority
          />
          <div>
            <h1 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">{t.title}</h1>
            <p className="mt-1 text-lg leading-relaxed text-stone-700">{t.subtitle}</p>
          </div>
        </div>

        {/* 1. Package */}
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200 sm:p-6">
          <StepTitle n={1} text={t.step1} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(Object.keys(PACKAGES) as PackageId[]).map((id) => {
              const p = PACKAGES[id]
              const selected = pkg === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPkg(id)}
                  aria-pressed={selected}
                  className={`relative min-h-[88px] rounded-2xl border-2 p-4 text-left transition-colors ${
                    selected ? "border-emerald-700 bg-emerald-50" : "border-stone-200 hover:border-emerald-300"
                  }`}
                >
                  {id === "bundle" && (
                    <span className="absolute -top-3 right-4 rounded-full bg-[#7F351E] px-3 py-1 text-sm font-bold text-white">
                      {t.popular}
                    </span>
                  )}
                  <span className="flex items-center gap-2 text-lg font-semibold">
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full border-2 ${
                        selected ? "border-emerald-700 bg-emerald-700" : "border-stone-300"
                      }`}
                    >
                      {selected && <Check className="h-4 w-4 text-white" />}
                    </span>
                    {p[lang]}
                  </span>
                  <span className="mt-1 block text-2xl font-bold text-emerald-800">{money(p.price)}</span>
                  <span className="text-base text-stone-600">{t.perBottle(money(p.price / p.bottles))}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <span className="text-lg font-medium">{t.qty}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="-1"
                className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-stone-300 bg-white disabled:opacity-40"
              >
                <Minus className="h-6 w-6" />
              </button>
              <span className="w-12 text-center text-2xl font-bold tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                disabled={qty >= MAX_QTY}
                aria-label="+1"
                className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-stone-300 bg-white disabled:opacity-40"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-baseline justify-between border-t border-stone-200 pt-4">
            <span className="text-lg font-medium">{t.total}</span>
            <span className="text-3xl font-bold tabular-nums text-stone-900">{totalText}</span>
          </div>
        </section>

        {/* 2. QR */}
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200 sm:p-6">
          <StepTitle n={2} text={t.step2} />
          <div className="mt-4 flex flex-col items-center">
            <div className="w-full max-w-[300px] rounded-2xl border border-stone-200 bg-white p-2">
              {payload ? (
                <PayNowQr payload={payload} label={`PayNow ${totalText} ${reference}`} className="h-auto w-full" />
              ) : (
                <div className="grid aspect-square w-full place-items-center rounded-xl bg-stone-100 text-center text-base text-stone-500">
                  {t.generating}
                </div>
              )}
            </div>

            <dl className="mt-4 w-full max-w-sm space-y-2 text-lg">
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600">{t.payee}</dt>
                <dd className="text-right font-semibold">{PAYNOW_MERCHANT.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600">{t.amount}</dt>
                <dd className="text-right font-semibold">
                  {totalText} <span className="text-sm font-normal text-stone-500">({t.amountLocked})</span>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600">{t.reference}</dt>
                <dd className="font-mono text-xl font-bold tracking-wider">{reference ?? "…"}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={handleSave}
              disabled={!payload || saving}
              className="mt-5 inline-flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-emerald-700 text-lg font-semibold text-white active:bg-emerald-800 disabled:opacity-60"
            >
              <Download className="h-6 w-6" />
              {saving ? t.saving : t.save}
            </button>
          </div>

          <div className="mt-6 rounded-2xl bg-stone-50 p-4">
            <h3 className="text-lg font-semibold">{t.howTitle}</h3>
            <ol className="mt-2 space-y-2">
              {t.how.map((step, i) => (
                <li key={step} className="flex gap-3 text-base leading-relaxed text-stone-700">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-base text-stone-600">{t.desktop}</p>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setFallbackOpen((o) => !o)}
              aria-expanded={fallbackOpen}
              className="flex w-full items-center justify-between rounded-2xl px-1 py-2 text-left text-base font-medium text-stone-700"
            >
              {t.fallbackTitle}
              <ChevronDown className={`h-5 w-5 transition-transform ${fallbackOpen ? "rotate-180" : ""}`} />
            </button>
            {fallbackOpen && (
              <div className="mt-2 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-stone-300 p-4 text-center">
                {/* The QR Aspire issued, untouched: proof the account works even if a bank
                    app is fussy about one-off codes. */}
                <img src="/images/paynow-qr.png" alt="HerbalBath PayNow QR" width={220} height={220} className="h-[220px] w-[220px]" />
                <p className="text-base leading-relaxed text-stone-700">
                  {t.fallbackBody(totalText, reference ?? "")}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 3. Confirm */}
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200 sm:p-6">
          <StepTitle n={3} text={t.step3} />
          <button
            type="button"
            onClick={() => window.open(paid.getWhatsAppLink(CONTACT.whatsappNumber), "_blank")}
            disabled={!reference}
            className="mt-4 inline-flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-green-600 text-lg font-semibold text-white active:bg-green-700 disabled:opacity-60"
          >
            <MessageCircle className="h-6 w-6" />
            {t.paidCta}
          </button>
          <p className="mt-3 text-base leading-relaxed text-stone-600">{t.paidNote}</p>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200 sm:p-6">
          <h2 className="text-xl font-semibold">{t.otherTitle}</h2>
          <div className="mt-4 grid gap-3">
            {cardHref && (
              <a
                href={cardHref}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-stone-900 text-lg font-semibold"
              >
                <CreditCard className="h-6 w-6" />
                {t.card}
              </a>
            )}
            <button
              type="button"
              onClick={() => window.open(cod.getWhatsAppLink(CONTACT.whatsappNumber), "_blank")}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-green-600 text-lg font-semibold text-green-700"
            >
              <MessageCircle className="h-6 w-6" />
              {t.cod}
            </button>
            <a
              href={`tel:${CONTACT.phone}`}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-stone-300 text-lg font-semibold text-stone-700"
            >
              <Phone className="h-6 w-6" />
              {t.call} {CONTACT.whatsappDisplay}
            </a>
          </div>
        </section>

        <ul className="grid gap-3 pt-2 text-base text-stone-700 sm:grid-cols-3">
          {[RotateCcw, Truck, ShieldCheck].map((Icon, i) => (
            <li key={t.trust[i]} className="flex items-center gap-2">
              <Icon className="h-5 w-5 shrink-0 text-emerald-700" />
              {t.trust[i]}
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

function StepTitle({ n, text }: { n: number; text: string }) {
  return (
    <h2 className="flex items-center gap-3 text-xl font-semibold sm:text-2xl">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#7F351E] text-lg font-bold text-white">{n}</span>
      {text}
    </h2>
  )
}
