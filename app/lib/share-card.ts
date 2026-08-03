// Renders the forwardable WhatsApp card as a PNG, client-side.
//
// Why canvas in the browser rather than a server-generated OG image:
//
//  1. Fonts. Satori/ImageResponse needs a CJK font binary shipped or fetched
//     at runtime, and CJK fonts are multi-megabyte. The phone already has
//     PingFang SC or Noto Sans CJK installed — using the device's own font
//     is free, instant, and renders correctly.
//  2. Delivery. The captain doesn't need a URL, they need an IMAGE IN THEIR
//     GALLERY that they can forward. navigator.share({ files }) puts the PNG
//     directly into the WhatsApp share sheet — one tap, pick a group, sent.
//     A server-rendered image would require long-press → save → switch app →
//     attach, which is exactly the friction that killed the copy-paste link.
//
// The card carries a code rather than a URL for the same reason: it survives
// being forwarded, screenshotted, and re-photographed. Attribution has to be
// readable by a human, because in this demographic a human is the transport.

export interface ShareCardOptions {
  captainName: string
  captainCode: string
  whatsappDisplay: string
  site: string
  price: string
  bundleLine: string
  /** Optional PayNow QR at public/images/paynow-qr.png. Omitted if absent. */
  payNowQrSrc?: string
  productImageSrc: string
}

const WIDTH = 1080
const HEIGHT = 1350

// Chinese first — this card is going into Mandarin-speaking WhatsApp groups.
const CJK_STACK = '"PingFang SC", "Noto Sans SC", "Microsoft YaHei", "Heiti SC", sans-serif'

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    // Resolve null rather than reject: a missing PayNow QR or product photo
    // should degrade the card, never fail the whole export.
    img.onerror = () => resolve(null)
    img.src = src
  })
}

function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  font: string,
  color: string,
) {
  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = "center"
  ctx.fillText(text, WIDTH / 2, y)
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  // roundRect is in every browser that also supports navigator.share with
  // files, but the manual path keeps this working on older Android WebViews.
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r)
  } else {
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }
}

export async function renderShareCard(opts: ShareCardOptions): Promise<Blob | null> {
  const canvas = document.createElement("canvas")
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  // Warm cream background — reads as apothecary/TCM rather than pharma, and
  // survives WhatsApp's aggressive JPEG recompression better than a gradient.
  ctx.fillStyle = "#FBF6EC"
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.fillStyle = "#B91C1C"
  ctx.fillRect(0, 0, WIDTH, 16)

  drawCenteredText(ctx, "草药浴 HerbalBath", 104, `600 42px ${CJK_STACK}`, "#B91C1C")

  // Headline. Deliberately a comfort claim ("舒缓" = soothe), not a treatment
  // claim — this image will be forwarded far beyond any context you control,
  // so it must stand on its own without tripping HSA advertising rules.
  drawCenteredText(ctx, "膝盖痛 · 肩颈酸 · 腰背僵硬", 190, `700 54px ${CJK_STACK}`, "#1F2937")
  drawCenteredText(ctx, "没药 + 乳香 天然草本喷雾", 262, `500 42px ${CJK_STACK}`, "#4B5563")

  const product = await loadImage(opts.productImageSrc)
  if (product) {
    const maxH = 420
    const scale = Math.min(maxH / product.height, 520 / product.width)
    const w = product.width * scale
    const h = product.height * scale
    ctx.drawImage(product, (WIDTH - w) / 2, 300, w, h)
  }

  drawCenteredText(ctx, opts.price, 810, `700 88px ${CJK_STACK}`, "#B91C1C")
  drawCenteredText(ctx, opts.bundleLine, 866, `500 36px ${CJK_STACK}`, "#4B5563")

  // Contact block. The WhatsApp number is the largest non-price element on
  // the card because it is the only call to action that works here — there
  // is no checkout, the order closes in chat.
  roundedRect(ctx, 90, 916, WIDTH - 180, 150, 28)
  ctx.fillStyle = "#059669"
  ctx.fill()
  drawCenteredText(ctx, "WhatsApp 订购", 968, `500 34px ${CJK_STACK}`, "#D1FAE5")
  drawCenteredText(ctx, opts.whatsappDisplay, 1032, `700 68px ${CJK_STACK}`, "#FFFFFF")

  // Attribution block — the whole reason this card is personalised.
  roundedRect(ctx, 90, 1090, WIDTH - 180, 132, 28)
  ctx.fillStyle = "#FEF3C7"
  ctx.fill()
  ctx.strokeStyle = "#F59E0B"
  ctx.lineWidth = 3
  ctx.stroke()
  drawCenteredText(ctx, "订购时请讲介绍码", 1136, `500 32px ${CJK_STACK}`, "#92400E")
  drawCenteredText(
    ctx,
    `${opts.captainCode}（${opts.captainName}）`,
    1196,
    `700 52px ${CJK_STACK}`,
    "#92400E",
  )

  const qr = opts.payNowQrSrc ? await loadImage(opts.payNowQrSrc) : null
  if (qr) {
    const qrSize = 150
    ctx.fillStyle = "#FFFFFF"
    roundedRect(ctx, WIDTH - 90 - qrSize - 20, 1240, qrSize + 20, qrSize + 20, 16)
    ctx.fill()
    ctx.drawImage(qr, WIDTH - 90 - qrSize - 10, 1250, qrSize, qrSize)
    ctx.font = `500 26px ${CJK_STACK}`
    ctx.fillStyle = "#4B5563"
    ctx.textAlign = "left"
    ctx.fillText("PayNow 付款", 110, 1330)
  }

  ctx.font = `500 30px ${CJK_STACK}`
  ctx.fillStyle = "#6B7280"
  ctx.textAlign = qr ? "left" : "center"
  ctx.fillText(opts.site, qr ? 110 : WIDTH / 2, qr ? 1290 : 1300)

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"))
}

/**
 * Hands the PNG to the OS share sheet so the captain can drop it straight
 * into a WhatsApp group. Falls back to a download on desktop, where the
 * Web Share API either doesn't exist or can't take files.
 */
export async function shareOrDownloadCard(
  blob: Blob,
  filename: string,
  shareText: string,
): Promise<"shared" | "downloaded"> {
  const file = new File([blob], filename, { type: "image/png" })

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({ files: [file], text: shareText })
      return "shared"
    } catch (error) {
      // AbortError just means they backed out of the share sheet — falling
      // through to a download here would drop a surprise file in their
      // gallery, so treat a cancel as a completed (no-op) share.
      if (error instanceof DOMException && error.name === "AbortError") {
        return "shared"
      }
    }
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return "downloaded"
}
