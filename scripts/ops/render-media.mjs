#!/usr/bin/env node
// Makes the creative queue (ops/creative/queue) with Kino, running inside this
// process: no server, no browser. KINO_DIR is a checkout of
// https://github.com/JamesLiuZX/kino, by default a clone next to this repo.
//   KINO_DIR=../kino node scripts/ops/render-media.mjs [--commit]
//
// Without a GPU, camera-move videos and ads built only from the real product
// photo still work (ffmpeg). With RUNPOD_ENDPOINT_ID and RUNPOD_API_KEY, product
// scenes (Kino Edit on the packaging photo) and generated pictures work too.
// Ads are scripted by Claude when ANTHROPIC_API_KEY is set. Finished files go to
// public/social/, pictures are attached to the posts that asked for them, and
// everything is sent to James on Telegram.

import { mkdtempSync, copyFileSync, existsSync, readFileSync, rmSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { Changes } from "./lib/changes.mjs"
import { STATE_FALLBACK, loadConfig, pauseReason } from "./lib/config.mjs"
import { ROOT } from "./lib/paths.mjs"
import { Telegram } from "./lib/telegram.mjs"
import { Vault, capped } from "./lib/vault.mjs"
import { ACTIVITY_FALLBACK } from "./tools/cmo.mjs"
import { MEDIA_INDEX, QUEUE_DIR, queuedBriefs } from "./tools/creative.mjs"
import { POSTS, POSTS_CSV, postsCsv } from "./tools/social.mjs"

const PER_RUN = 6
const TIMEOUT_MS = 25 * 60 * 1000
const NEEDS_GPU = new Set(["product-scene", "image-scene"])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** The new packaging becomes Kino's HerbalBath product photo for this run. */
function useNewPackaging(kinoDir) {
  const brandDir = path.join(kinoDir, "brands", "herbalbath")
  if (!existsSync(brandDir)) return
  copyFileSync(path.join(ROOT, "public/images/product-pack-square.jpg"), path.join(brandDir, "product.jpg"))
  copyFileSync(path.join(ROOT, "public/images/product-pack.webp"), path.join(brandDir, "product-cutout.webp"))
}

async function waitFor(check) {
  const start = Date.now()
  while (Date.now() - start < TIMEOUT_MS) {
    const done = check()
    if (done) return done
    await sleep(3000)
  }
  throw new Error("Timed out after 25 minutes.")
}

async function makeOne(brief, { kino, packAssetId, gpu }) {
  const { jobs, library, studio } = kino
  const finishedJob = (id) => () => {
    const job = jobs.get(id)
    if (!job || ["queued", "running"].includes(job.status)) return null
    if (job.status !== "done") throw new Error(job.error ?? `The job ${job.status}.`)
    return library.pathOf(library.get(job.outputs[0]))
  }
  if (brief.kind === "product-scene") {
    const prompt = `${brief.prompt}. Keep the HerbalBath box and bottle exactly as they are in the photo: same shape, colours, gold cap and every word on the labels. Photorealistic, natural light, no added text.`
    const [job] = jobs.enqueue({ appId: "edit", values: { image: packAssetId, prompt } })
    return waitFor(finishedJob(job.id))
  }
  if (brief.kind === "image-scene") {
    const [job] = jobs.enqueue({ appId: "image-fast", values: { prompt: `${brief.prompt}, photorealistic, natural light, no text`, aspect: brief.aspect } })
    return waitFor(finishedJob(job.id))
  }
  if (brief.kind === "product-video") {
    const [job] = jobs.enqueue({ appId: "video-instant", values: { image: packAssetId, camera: "push-in", aspect: brief.aspect === "1:1" ? "1:1" : brief.aspect === "16:9" ? "16:9" : "9:16", duration: 5 } })
    return waitFor(finishedJob(job.id))
  }
  // An ad: Kino scripts it (Claude, or rules without a key), checks it against the
  // brand's ad rules, makes the shots and renders captions and the end card.
  const { briefs } = await studio.draft({
    brandId: "herbalbath",
    platform: brief.platform ?? "reels",
    language: brief.language ?? "zh",
    angles: [brief.angle ?? "ritual"],
    notes: `${brief.prompt}${gpu ? "" : " Use only product-photo shots."} Describe using the product without saying spray, roll or drops.`,
    productAssetId: packAssetId,
  })
  const draft = briefs[0]
  if (!draft) throw new Error("Kino couldn't write a script for this angle.")
  if (!gpu) draft.shots = draft.shots.map((s) => ({ ...s, source: "product-photo" }))
  const ad = await studio.create({ brandId: "herbalbath", brief: draft, engine: gpu ? "pro" : "instant", productAssetId: packAssetId })
  const blocking = ad.issues.filter((i) => i.severity === "block")
  if (blocking.length) throw new Error(`The script broke ad rules: ${blocking.map((i) => i.message ?? i.text ?? i.rule).join("; ")}`)
  studio.make(ad.id)
  return waitFor(() => {
    const now = studio.get(ad.id)
    if (now.status === "failed") throw new Error(now.error ?? "The ad failed.")
    if (now.status !== "done" || !now.outputAssetId) return null
    return library.pathOf(library.get(now.outputAssetId))
  })
}

async function main() {
  const commit = process.argv.includes("--commit")
  const config = loadConfig()
  const vault = new Vault()
  const paused = pauseReason({ config, state: vault.available ? vault.read("state", STATE_FALLBACK) : STATE_FALLBACK, agent: "creative" })
  if (paused) return console.log(`Media: skipped, ${paused}.`)

  const gpu = !!(process.env.RUNPOD_ENDPOINT_ID && process.env.RUNPOD_API_KEY)
  const todo = queuedBriefs()
    .filter((b) => b.status === "queued" || (gpu && b.status === "waiting-gpu"))
    .slice(0, PER_RUN)
  if (!todo.length) return console.log("Media: nothing queued.")

  const kinoDir = path.resolve(process.env.KINO_DIR ?? path.join(ROOT, "..", "kino"))
  if (!existsSync(path.join(kinoDir, "src", "server.mjs"))) throw new Error(`Kino isn't at ${kinoDir}; clone https://github.com/JamesLiuZX/kino there or set KINO_DIR.`)
  useNewPackaging(kinoDir)
  const dataDir = mkdtempSync(path.join(os.tmpdir(), "kino-"))
  const { createStudio } = await import(path.join(kinoDir, "src", "server.mjs"))
  const kino = createStudio({ dataDir, env: { ...process.env, KINO_PROVIDER: gpu ? "runpod" : "mock" } })
  const pack = await kino.library.add({ path: path.join(ROOT, "public/images/product-pack-square.jpg"), filename: "herbalbath-pack.jpg", mime: "image/jpeg", source: "upload" })

  const changes = new Changes({ vault })
  const tg = new Telegram()
  const setBrief = (brief, patch) => changes.json(`${QUEUE_DIR}/${brief.id}.json`, brief, (b) => ({ ...b, ...patch }))
  let made = 0
  let failed = 0
  let waiting = 0

  for (const brief of todo) {
    if (NEEDS_GPU.has(brief.kind) && !gpu) {
      setBrief(brief, { status: "waiting-gpu", note: "Needs RunPod (RUNPOD_ENDPOINT_ID, RUNPOD_API_KEY)." })
      waiting++
      continue
    }
    try {
      const file = await makeOne(brief, { kino, packAssetId: pack.id, gpu })
      const ext = path.extname(file) || ".png"
      const rel = `public/social/${brief.id}${ext}`
      changes.file(rel, readFileSync(file))
      const url = `/social/${brief.id}${ext}`
      const isImage = /\.(png|jpe?g|webp)$/i.test(ext)
      if (brief.forPost && isImage) {
        changes.json(POSTS, { posts: [] }, (doc) => {
          const post = doc.posts.find((p) => p.id === brief.forPost)
          if (post && !post.image && !post.link) post.image = url
          return doc
        })
        changes.text(POSTS_CSV, () => postsCsv(changes.readJson(POSTS, { posts: [] }).posts))
      }
      changes.json(MEDIA_INDEX, { media: [] }, (doc) => {
        doc.media = capped([...(doc.media ?? []), { id: brief.id, kind: brief.kind, file: url, prompt: brief.prompt, forPost: brief.forPost ?? null, madeAt: new Date().toISOString(), gpu }], 500)
        return doc
      })
      setBrief(brief, { status: "done", output: url, madeAt: new Date().toISOString() })
      await tg.sendFile(file, `${brief.kind}${brief.forPost ? ` for ${brief.forPost}` : ""}: ${brief.prompt.slice(0, 200)}`).catch(() => {})
      made++
    } catch (e) {
      setBrief(brief, { status: "failed", error: String(e.message).slice(0, 500), failedAt: new Date().toISOString() })
      failed++
    }
  }

  if (vault.available) {
    changes.private("activity", ACTIVITY_FALLBACK, (v) => {
      v.events = capped([...v.events, { at: new Date().toISOString(), agent: "media", status: "done", summary: `Made ${made}, failed ${failed}, waiting for GPU ${waiting}.` }], 500)
    })
  }
  console.log(`Media: made ${made}, failed ${failed}, waiting for GPU ${waiting}.`)
  if (commit && changes.count()) await changes.commitToMain(`autopilot(media): ${made} made${failed ? `, ${failed} failed` : ""}`)
  rmSync(dataDir, { recursive: true, force: true })
  process.exit(0) // Kino's job runner keeps timers alive.
}

main().catch((e) => {
  console.error(`render-media: ${e.message}`)
  process.exit(1)
})
