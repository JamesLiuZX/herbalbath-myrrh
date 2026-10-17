// Slide decks (PowerPoint), in the brand's colours with the real product photo:
// trade pitch decks for the B2B agent, monthly reviews for the CMO. Decks are
// written to .ops/out and sent to James on Telegram; they never go into git.

import { mkdirSync } from "node:fs"
import path from "node:path"
import { ROOT, SCRATCH } from "../lib/paths.mjs"
import { obj, str } from "./common.mjs"

const MAROON = "7F351E"
const COPPER = "B87333"
const CREAM = "FBF4E8"
const INK = "2B1A12"
const IMAGES = {
  pack: { file: "public/images/product-pack.webp", ratio: 738 / 1186 },
  lifestyle: { file: "public/images/product-lifestyle.webp", ratio: 547 / 730 },
}
const FONT = "Microsoft YaHei"

export async function buildDeck({ file, title, subtitle, slides }, outDir = path.join(SCRATCH, "out")) {
  const { default: PptxGenJS } = await import("pptxgenjs")
  const pptx = new PptxGenJS()
  pptx.layout = "LAYOUT_WIDE" // 13.33 x 7.5 in
  pptx.title = title
  pptx.company = "HerbalBath"

  const cover = pptx.addSlide()
  cover.background = { color: CREAM }
  cover.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.35, h: 7.5, fill: { color: MAROON } })
  cover.addText(title, { x: 0.9, y: 2.2, w: 7.6, h: 1.6, fontFace: FONT, fontSize: 40, bold: true, color: MAROON })
  if (subtitle) cover.addText(subtitle, { x: 0.9, y: 3.8, w: 7.6, h: 1.2, fontFace: FONT, fontSize: 20, color: INK })
  cover.addText("HerbalBath 草本沐 · herbalbathsg.com", { x: 0.9, y: 6.4, w: 7.6, h: 0.5, fontFace: FONT, fontSize: 14, color: COPPER })
  cover.addImage({ path: path.join(ROOT, IMAGES.pack.file), x: 9.0, y: 0.9, h: 5.8, w: 5.8 * IMAGES.pack.ratio })

  for (const s of slides) {
    const slide = pptx.addSlide()
    slide.background = { color: "FFFFFF" }
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.12, fill: { color: MAROON } })
    slide.addText(s.title, { x: 0.6, y: 0.4, w: 12, h: 0.9, fontFace: FONT, fontSize: 28, bold: true, color: MAROON })
    const withImage = s.image && IMAGES[s.image]
    const width = withImage ? 7.8 : 12.1
    let y = 1.5
    if (s.body) {
      slide.addText(s.body, { x: 0.6, y, w: width, h: 1.2, fontFace: FONT, fontSize: 16, color: INK, valign: "top" })
      y += 1.3
    }
    if (s.bullets?.length) {
      slide.addText(
        s.bullets.map((b) => ({ text: b, options: { bullet: { indent: 18 }, breakLine: true } })),
        { x: 0.6, y, w: width, h: Math.min(5.6, 0.5 * s.bullets.length + 0.4), fontFace: FONT, fontSize: 18, color: INK, valign: "top", paraSpaceAfter: 8 },
      )
      y += Math.min(5.6, 0.5 * s.bullets.length + 0.6)
    }
    if (s.table?.head?.length && s.table.rows?.length) {
      const header = s.table.head.map((h) => ({ text: h, options: { bold: true, color: "FFFFFF", fill: { color: MAROON } } }))
      slide.addTable([header, ...s.table.rows], { x: 0.6, y, w: width, fontFace: FONT, fontSize: 14, color: INK, border: { type: "solid", pt: 0.5, color: "E5D5C5" }, autoPage: false })
    }
    if (withImage) {
      const img = IMAGES[s.image]
      slide.addImage({ path: path.join(ROOT, img.file), x: 9.0, y: 1.4, h: 5.4, w: 5.4 * img.ratio })
    }
    if (s.note) slide.addNotes(s.note)
  }

  mkdirSync(outDir, { recursive: true })
  const out = path.join(outDir, `${file.replace(/[^a-z0-9-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "deck"}.pptx`)
  await pptx.writeFile({ fileName: out })
  return out
}

export function deckTools(ctx) {
  return [
    {
      name: "make_deck",
      description:
        "Make a PowerPoint deck in HerbalBath's colours with the real product photo, and send it to James with your report. For trade pitch decks and monthly reviews. Every slide: a title, plus body text, bullets and/or a table; add image 'pack' or 'lifestyle' to show the product. Facts only from the knowledge base.",
      input_schema: obj(
        {
          file: str("File name without extension, e.g. herbalbath-trade-deck-zh"),
          title: str("Cover title"),
          subtitle: str("Cover subtitle"),
          slides: {
            type: "array",
            description: "Up to 15 slides",
            items: obj(
              {
                title: str("Slide title"),
                body: str("A short paragraph"),
                bullets: { type: "array", items: { type: "string" } },
                table: obj({ head: { type: "array", items: { type: "string" } }, rows: { type: "array", items: { type: "array", items: { type: "string" } } } }),
                image: { type: "string", enum: ["pack", "lifestyle"] },
                note: str("Speaker notes"),
              },
              ["title"],
            ),
          },
        },
        ["file", "title", "slides"],
      ),
      run: async (input) => {
        if (input.slides.length > 15) throw new Error("15 slides at most.")
        const file = await buildDeck(input)
        ctx.run.attachments.push({ file, caption: input.title })
        ctx.run.stats.decks = (ctx.run.stats.decks ?? 0) + 1
        return { made: path.basename(file), slides: input.slides.length + 1 }
      },
    },
  ]
}
