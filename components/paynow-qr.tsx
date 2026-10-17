"use client"

import { useMemo } from "react"
import { encode } from "uqr"
import { CJK_STACK } from "@/app/lib/share-card"

// Error correction M is what bank apps expect for PayNow; the 4-module quiet
// zone is the QR spec minimum and matters when the code is photographed off a
// screen. boostEcc stays off so the same payload always draws the same code.
function qrMatrix(payload: string): boolean[][] {
  return encode(payload, { ecc: "M", boostEcc: false, border: 4 }).data
}

/** One path of run-length rectangles: crisp at any size and far lighter than one rect per module. */
function matrixToPath(data: boolean[][]): string {
  let d = ""
  data.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      if (!row[x]) {
        x++
        continue
      }
      const start = x
      while (x < row.length && row[x]) x++
      d += `M${start} ${y}h${x - start}v1H${start}z`
    }
  })
  return d
}

interface PayNowQrProps {
  payload: string
  label: string
  className?: string
}

export function PayNowQr({ payload, label, className }: PayNowQrProps) {
  const { size, path } = useMemo(() => {
    const data = qrMatrix(payload)
    return { size: data.length, path: matrixToPath(data) }
  }, [payload])

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
      className={className}
    >
      <rect width={size} height={size} fill="#FFFFFF" />
      <path d={path} fill="#111111" />
    </svg>
  )
}

interface PayNowCardOptions {
  payload: string
  amountText: string
  reference: string
  payee: string
  /** Two short lines under the QR, already in the visitor's language. */
  hints: [string, string]
}

/**
 * The image a visitor saves to their gallery and then opens from their bank
 * app's "scan from photo". It has to stand on its own days later, so payee,
 * amount and reference are printed beside the code, not just encoded in it.
 */
export async function renderPayNowCard(opts: PayNowCardOptions): Promise<Blob | null> {
  const W = 1080
  const H = 1500
  const canvas = document.createElement("canvas")
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  ctx.fillStyle = "#FBF4E8"
  ctx.fillRect(0, 0, W, H)

  ctx.textAlign = "center"
  ctx.fillStyle = "#7F351E"
  ctx.font = `700 56px ${CJK_STACK}`
  ctx.fillText("HerbalBath · PayNow", W / 2, 110)

  const data = qrMatrix(opts.payload)
  const qrSize = 860
  const cell = qrSize / data.length
  const qx = (W - qrSize) / 2
  const qy = 160
  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(qx - 10, qy - 10, qrSize + 20, qrSize + 20)
  ctx.fillStyle = "#111111"
  data.forEach((row, y) =>
    row.forEach((dark, x) => {
      // Round up a hair so adjacent modules overlap instead of leaving hairlines.
      if (dark) ctx.fillRect(qx + x * cell, qy + y * cell, Math.ceil(cell), Math.ceil(cell))
    }),
  )

  ctx.fillStyle = "#1C1917"
  ctx.font = `700 84px ${CJK_STACK}`
  ctx.fillText(opts.amountText, W / 2, 1150)
  ctx.font = `600 46px ui-monospace, Menlo, monospace`
  ctx.fillText(opts.reference, W / 2, 1222)
  ctx.font = `500 36px ${CJK_STACK}`
  ctx.fillStyle = "#57534E"
  ctx.fillText(opts.payee, W / 2, 1290)
  ctx.fillText(opts.hints[0], W / 2, 1370)
  ctx.fillText(opts.hints[1], W / 2, 1420)

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"))
}
