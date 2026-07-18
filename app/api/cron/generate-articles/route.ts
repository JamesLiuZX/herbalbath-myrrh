import { NextResponse } from "next/server"
import { generateArticleDrafts } from "@/app/lib/rag"

// Vercel CRON job — SEO content pipeline.
// Runs monthly (see vercel.json). Retrieves grounding facts from our existing
// pain-points-data.ts research for topics that don't have a dedicated blog
// article yet, and returns structured drafts ready for a writer (human or
// LLM) to turn into finished bilingual articles in app/lib/blog-data.tsx.
//
// This intentionally does NOT auto-publish: Vercel's serverless filesystem is
// ephemeral, so a cron job can't durably write to the git-tracked content
// files. It surfaces drafts (and logs them) so a human/editor loop can pick
// them up — see the response `nextStep` field.

const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: Request) {
  try {
    if (process.env.NODE_ENV === "production") {
      const authHeader = request.headers.get("authorization")
      if (authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const drafts = generateArticleDrafts(4)
    const timestamp = new Date().toISOString()

    console.log(`[CRON] generate-articles run at ${timestamp}`)
    console.log(`[CRON] Found ${drafts.length} content gap(s) grounded in existing pain-point research:`)
    for (const draft of drafts) {
      console.log(`  - /blog/${draft.slug} (grounded in: ${draft.sourceSlugs.join(", ")})`)
    }

    return NextResponse.json({
      success: true,
      timestamp,
      draftsGenerated: drafts.length,
      drafts,
      nextStep:
        drafts.length > 0
          ? "Review these drafts and add finished bilingual articles to app/lib/blog-data.tsx with matching slugs."
          : "No open content gaps found — all known slugs referenced by pain-points-data.ts already have articles.",
    })
  } catch (error) {
    console.error("[CRON] Error generating articles:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate article drafts",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  return GET(request)
}
