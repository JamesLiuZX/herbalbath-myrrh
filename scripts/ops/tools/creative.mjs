// Pictures and video. The creative agent writes briefs into ops/creative/queue;
// the media executor (render-media.mjs) makes them with Kino: product-true
// edits of the real packaging photo and generated scenes on RunPod, and
// camera-move videos and captioned ads with ffmpeg, which need no GPU.

import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { claimProblems, loadRules } from "../../content/lib.mjs"
import { addDays, ROOT } from "../lib/paths.mjs"
import { obj, str } from "./common.mjs"
import { POSTS } from "./social.mjs"

export const QUEUE_DIR = "ops/creative/queue"
// Kino's ad angles, minus "howto": how the new bottle is applied is unconfirmed (product.md).
export const AD_ANGLES = ["ritual", "gift", "tradition", "offer", "community"]
export const MEDIA_INDEX = "ops/creative/media.json"

export const KINDS = {
  "product-scene": "The real box and bottle placed into a new scene (Kino Edit on the packaging photo). Needs the GPU.",
  "image-scene": "A picture without the product: festivals, families, places (Kino Image). Needs the GPU.",
  "product-video": "A 4–6 second camera move over the packaging photo or a finished product-scene image (no GPU).",
  ad: "A captioned 9:16 ad for Reels or TikTok from an angle (Kino Ad Studio): scripted by Claude, checked against the ad rules, rendered with ffmpeg. Without the GPU every shot uses the real product photo.",
}

export function queuedBriefs() {
  const dir = path.join(ROOT, QUEUE_DIR)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(path.join(dir, f), "utf8")))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export function creativeTools(ctx) {
  const rules = loadRules()
  return [
    {
      name: "list_media",
      description: "The creative queue (what's waiting, being made, done or failed) and the finished media library, newest first.",
      input_schema: obj({}, []),
      run: () => ({
        gpu: ctx.gpu,
        queue: queuedBriefs().map(({ id, kind, status, forPost, createdAt, error }) => ({ id, kind, status, forPost: forPost ?? null, createdAt, error: error ?? null })),
        library: (ctx.changes.readJson(MEDIA_INDEX, { media: [] }).media ?? []).slice(-40).reverse(),
      }),
    },
    {
      name: "posts_needing_images",
      description: "Facebook posts in the next 21 days that have an imagePrompt but no picture yet, and whether a brief is already queued for them.",
      input_schema: obj({}, []),
      run: () => {
        const to = addDays(ctx.today.date, 21)
        const queued = new Set(queuedBriefs().map((b) => b.forPost).filter(Boolean))
        return ctx.changes
          .readJson(POSTS, { posts: [] })
          .posts.filter((p) => !p.image && !p.link && p.imagePrompt && p.publishAt.slice(0, 10) >= ctx.today.date && p.publishAt.slice(0, 10) <= to)
          .map((p) => ({ id: p.id, publishAt: p.publishAt, lang: p.lang, pillar: p.pillar, imagePrompt: p.imagePrompt, queued: queued.has(p.id) }))
      },
    },
    {
      name: "queue_media",
      description: `Queue a picture or video for the media executor. Kinds: ${Object.entries(KINDS)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" ")} For product scenes, describe the setting and light, and say the box and bottle stay exactly as they are. Never ask for a different bottle or label.`,
      input_schema: obj(
        {
          kind: { type: "string", enum: Object.keys(KINDS) },
          prompt: str("What to make. For ads: the angle and the moment (e.g. a daughter's CNY gift for her mother)."),
          aspect: { type: "string", enum: ["1:1", "4:5", "9:16", "16:9"], description: "Default 1:1 for posts, 9:16 for ads and videos" },
          forPost: str("Optional: the Facebook post id this picture is for; it's attached to the post when done"),
          language: { type: "string", enum: ["zh", "en"], description: "Ads: caption language" },
          angle: { type: "string", enum: AD_ANGLES, description: "Ads: ritual (the warm moment at the end of a day), gift (adult children buying for parents), tradition (myrrh and frankincense), offer (price, bundle, delivery, guarantee), community (everyday Singapore homes)" },
          platform: { type: "string", enum: ["tiktok", "reels"], description: "Ads: where it will run" },
        },
        ["kind", "prompt"],
      ),
      run: (input) => {
        const problems = []
        const recent = queuedBriefs().filter((b) => b.createdAt.slice(0, 10) >= addDays(ctx.today.date, -6)).length
        const made = ctx.run.stats.mediaQueued ?? 0
        if (recent + made >= ctx.config.limits.mediaJobsPerWeek) problems.push(`the weekly media limit (${ctx.config.limits.mediaJobsPerWeek}) is reached`)
        if (input.prompt.length < 15) problems.push("describe it in at least a sentence")
        problems.push(...claimProblems([input.prompt], input.language ?? "en", rules).filter((p) => p.startsWith("banned")))
        if (input.forPost) {
          const post = ctx.changes.readJson(POSTS, { posts: [] }).posts.find((p) => p.id === input.forPost)
          if (!post) problems.push(`there is no post ${input.forPost}`)
          else if (post.image) problems.push(`${input.forPost} already has a picture`)
          if (queuedBriefs().some((b) => b.forPost === input.forPost && b.status !== "failed")) problems.push(`a brief for ${input.forPost} is already queued`)
        }
        if (input.kind === "ad" && (!input.language || !input.angle)) problems.push("ads need a language and an angle")
        if (problems.length) throw new Error(`Not queued:\n- ${problems.join("\n- ")}`)
        const id = `${ctx.today.date}-${input.kind}-${Math.random().toString(36).slice(2, 7)}`
        const brief = {
          id,
          kind: input.kind,
          prompt: input.prompt.trim(),
          aspect: input.aspect ?? (["ad", "product-video"].includes(input.kind) ? "9:16" : "1:1"),
          ...(input.forPost ? { forPost: input.forPost } : {}),
          ...(input.language ? { language: input.language } : {}),
          ...(input.platform ? { platform: input.platform } : {}),
          ...(input.angle ? { angle: input.angle } : {}),
          status: "queued",
          createdAt: new Date().toISOString(),
          by: ctx.agent,
        }
        ctx.changes.json(`${QUEUE_DIR}/${id}.json`, brief, () => brief)
        ctx.run.stats.mediaQueued = made + 1
        return { queued: id, needsGpu: ["product-scene", "image-scene"].includes(input.kind), gpuAvailable: ctx.gpu }
      },
    },
  ]
}
