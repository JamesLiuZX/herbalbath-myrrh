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
import { CARD_PAYMENT_LINKS, CONTACT } from "@/app/lib/growth-config"
import { shareOrDownloadCard } from "@/app/lib/share-card"
import { recordOrder } from "@/app/actions/orders"
import { usePromotion } from "@/app/hooks/usePromotion"
import { buildCodMessage, buildPaidMessage, MAX_QTY, type OrderDetails } from "@/app/lib/orders"
import { findPackage, type PromoSnapshot } from "@/app/lib/promotions"
import { PROMOTIONS } from "@/app/lib/promotions-data"

type Lang = "zh" | "en"

const REF_STORAGE_KEY = "hb-pay-ref"
const DETAILS_STORAGE_KEY = "hb-pay-details"
const EMPTY_DETAILS: Required<OrderDetails> = { name: "", phone: "", address: "", giftNote: "" }

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
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
    paidNote: "我们核对款项后安排全岛送货（包邮）。",
    detailsTitle: "先填好送货资料（可不填）",
    detailsHint: "填了就会自动写进 WhatsApp 讯息，不用再打字。",
    name: "姓名",
    phone: "联系电话",
    address: "送货地址",
    giftNote: "贺卡留言（送礼用）",
    privacy: "以上资料只会写进您的 WhatsApp 讯息，用来处理和配送这张订单。",
    otherTitle: "其他方式",
    card: "信用卡 / Apple Pay 付款",
    cod: "WhatsApp 下单 · 货到付款",
    call: "打电话订购",
    trust: ["新加坡全岛包邮", "新加坡注册公司", "WhatsApp 真人客服"],
    cardHints: ["打开银行 App →「扫码付款」", "从相册选这张图片即可付款"] as [string, string],
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
    paidNote: "We check the payment, then deliver island-wide. Delivery is included.",
    detailsTitle: "Delivery details (optional)",
    detailsHint: "Fill these in and they go straight into your WhatsApp message.",
    name: "Name",
    phone: "Phone",
    address: "Delivery address",
    giftNote: "Card message (for a gift)",
    privacy: "These details go only into your WhatsApp message, to process and deliver this order.",
    otherTitle: "Other ways to pay",
    card: "Pay by card / Apple Pay",
    cod: "Order on WhatsApp · Cash on delivery",
    call: "Call to order",
    trust: ["Island-wide delivery included", "Singapore-registered company", "Real people on WhatsApp"],
    cardHints: ["Open your bank app → Scan & Pay", "then pick this image from your photos"] as [string, string],
  },
} as const

const money = (n: number) => `S$${n.toFixed(2)}`

function trackPixel(event: string, value: number) {
  window.fbq?.("track", event, { value, currency: "SGD" })
  window.ttq?.track(event, { value, currency: "SGD" })
}

export function PayClient({ initialPromo }: { initialPromo: PromoSnapshot }) {
  // Packages and prices: content/promotions.json, resolved on the server and once more here.
  const promo = usePromotion(initialPromo)
  const [lang, setLang] = useState<Lang>("zh")
  const [pkg, setPkg] = useState<string>(initialPromo.defaultId)
  const [details, setDetails] = useState(EMPTY_DETAILS)
  const [gift, setGift] = useState(false)
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
    if (b) setPkg(b)
    if (params.get("gift") === "1") setGift(true)
    // iOS can reload the tab after a trip to the bank app; what was typed must survive it.
    try {
      const saved = sessionStorage.getItem(DETAILS_STORAGE_KEY)
      if (saved) setDetails({ ...EMPTY_DETAILS, ...JSON.parse(saved) })
    } catch {
      // Private browsing or a full store: the fields simply start empty.
    }
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
  // An id that isn't on offer today (an old link, a campaign that ended) falls back to the default package.
  const choice = findPackage(promo, pkg)
  const total = choice.price * qty
  const totalText = money(total)
  const pkgLabel = choice.label[lang]

  const payload = useMemo(
    () => (reference ? buildPayNowPayload({ amount: total, reference }) : null),
    [reference, total],
  )

  useEffect(() => {
    if (reference) trackPixel("InitiateCheckout", total)
    // Fire once per visit, not on every package change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference])

  const orderLine = { reference: reference ?? "", packageLabel: pkgLabel, qty, amountText: totalText, campaignId: promo.campaign?.id ?? null }
  const paid = useReferral(buildPaidMessage(lang, orderLine, details))
  const cod = useReferral(buildCodMessage(lang, orderLine, details))

  // The hosted card links charge the standing price, so they are hidden when a campaign changes this package's price.
  const standing = PROMOTIONS.evergreen.packages.find((p) => p.id === choice.id)
  const cardLink = standing?.price === choice.price ? ((CARD_PAYMENT_LINKS as Record<string, string>)[choice.id] ?? "") : ""
  const cardHref = cardLink && reference ? `${cardLink}?client_reference_id=${reference}` : ""

  const setDetail = (field: keyof OrderDetails, value: string) => {
    setDetails((current) => {
      const next = { ...current, [field]: value }
      try {
        sessionStorage.setItem(DETAILS_STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Nothing to do: the fields still work for this visit.
      }
      return next
    })
  }

  // Everything in here is synchronous and in this order. Safari blocks a
  // window.open that follows an await, and WhatsApp opening is the one thing
  // that must never fail.
  const handlePaid = () => {
    if (!reference) return
    const flag = `hb-paid-${reference}`
    let first = true
    try {
      first = !sessionStorage.getItem(flag)
      sessionStorage.setItem(flag, "1")
    } catch {
      // Without storage a double tap may fire the events twice; the server keeps one order per reference anyway.
    }
    if (first) {
      void recordOrder({ reference, packageId: choice.id, qty, lang, captainCode: paid.refId }).catch(() => {})
      // The customer says they paid; nothing here has confirmed the money arrived.
      window.fbq?.("track", "Purchase", { value: total, currency: "SGD", payment_status: "self_reported" })
      window.ttq?.track("CompletePayment", { value: total, currency: "SGD", payment_status: "self_reported" })
      window.gtag?.("event", "purchase_self_reported", { value: total, currency: "SGD", transaction_id: reference })
    }
    window.open(paid.getWhatsAppLink(CONTACT.whatsappNumber), "_blank")
  }

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
            src="/images/product-pack.webp"
            alt="HerbalBath 没药草本能量油"
            width={738}
            height={1186}
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
          <div className={`mt-4 grid gap-3 ${promo.packages.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {promo.packages.map((p) => {
              const id = p.id
              const selected = choice.id === id
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
                  {id === promo.defaultId && (
                    <span className="absolute -top-3 right-4 rounded-full bg-brand-700 px-3 py-1 text-sm font-bold text-white">
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
                    {p.label[lang]}
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
          {/* Optional, and never in the way: an empty form sends the same message as before. */}
          <div className="mt-4 rounded-2xl bg-stone-50 p-4">
            <h3 className="text-lg font-semibold">{t.detailsTitle}</h3>
            <p className="mt-1 text-base text-stone-600">{t.detailsHint}</p>
            <div className="mt-3 grid gap-3">
              {(gift ? (["name", "phone", "address", "giftNote"] as const) : (["name", "phone", "address"] as const)).map((field) => (
                <label key={field} className="block text-base font-medium text-stone-800">
                  {t[field]}
                  <input
                    type={field === "phone" ? "tel" : "text"}
                    autoComplete={field === "name" ? "name" : field === "phone" ? "tel" : field === "address" ? "street-address" : "off"}
                    value={details[field]}
                    onChange={(e) => setDetail(field, e.target.value)}
                    maxLength={field === "address" || field === "giftNote" ? 200 : 60}
                    className="mt-1 h-14 w-full rounded-xl border-2 border-stone-300 bg-white px-4 text-lg font-normal text-stone-900 focus:border-emerald-700 focus:outline-none"
                  />
                </label>
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-500">{t.privacy}</p>
          </div>
          <button
            type="button"
            onClick={handlePaid}
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
      <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-700 text-lg font-bold text-white">{n}</span>
      {text}
    </h2>
  )
}
