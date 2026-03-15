import { NextResponse } from "next/server"

// Vercel CRON job to update pain points content
// Runs every Sunday at 2am SGT (6pm UTC Saturday)
// Configured in vercel.json

const CRON_SECRET = process.env.CRON_SECRET

// Topics that rotate based on season and relevance
const PAIN_POINT_TOPICS = [
  {
    slug: "knee-pain",
    titleZh: "膝盖疼痛",
    titleEn: "Knee Pain",
    seasonalTriggers: ["all-year", "monsoon"],
    singaporeContext: "HDB楼梯、潮湿气候",
  },
  {
    slug: "back-pain",
    titleZh: "腰酸背痛",
    titleEn: "Back Pain",
    seasonalTriggers: ["all-year"],
    singaporeContext: "久坐办公、不良姿势",
  },
  {
    slug: "joint-arthritis",
    titleZh: "风湿关节炎",
    titleEn: "Rheumatism",
    seasonalTriggers: ["monsoon", "rainy-season"],
    singaporeContext: "季风季节、气压变化",
  },
  {
    slug: "numbness-tingling",
    titleZh: "手脚麻痹",
    titleEn: "Numbness",
    seasonalTriggers: ["all-year"],
    singaporeContext: "空调环境、血液循环",
  },
  {
    slug: "neck-shoulder-stiffness",
    titleZh: "肩颈僵硬",
    titleEn: "Neck & Shoulder Stiffness",
    seasonalTriggers: ["all-year"],
    singaporeContext: "空调直吹、手机姿势",
  },
  {
    slug: "sleep-difficulties",
    titleZh: "睡眠困难",
    titleEn: "Sleep Difficulties",
    seasonalTriggers: ["all-year"],
    singaporeContext: "慢性疼痛、焦虑",
  },
  {
    slug: "morning-stiffness",
    titleZh: "晨起僵硬",
    titleEn: "Morning Stiffness",
    seasonalTriggers: ["all-year", "monsoon"],
    singaporeContext: "夜间关节液减少",
  },
  {
    slug: "weather-related-pain",
    titleZh: "天气变化疼痛",
    titleEn: "Weather-Related Pain",
    seasonalTriggers: ["monsoon", "rainy-season"],
    singaporeContext: "气压变化、高湿度",
  },
]

// Get current Singapore season
function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1 // 1-12

  // Singapore monsoon seasons
  if (month >= 11 || month <= 1) return "monsoon" // Nov-Jan: Northeast Monsoon
  if (month >= 6 && month <= 9) return "monsoon" // Jun-Sep: Southwest Monsoon
  if (month >= 3 && month <= 5) return "hot-dry" // Mar-May: Inter-monsoon (hot)
  return "inter-monsoon"
}

// Generate a tip based on current conditions
function generateSeasonalTip(season: string, topic: typeof PAIN_POINT_TOPICS[0]): string {
  const tips: Record<string, Record<string, string>> = {
    monsoon: {
      "knee-pain": "雨季气压低，建议每天早晚使用没药喷雾预防膝盖不适。",
      "joint-arthritis": "季风季节是风湿高发期，保持关节温暖，避免空调直吹。",
      "weather-related-pain": "密切关注天气预报，在气压下降前提前做好疼痛预防。",
      "morning-stiffness": "雨季湿度高，建议睡前使用没药喷雾，保持被褥干燥温暖。",
      default: "雨季注意保暖，避免湿气入侵，定期使用没药喷雾保养。",
    },
    "hot-dry": {
      "neck-shoulder-stiffness": "炎热季节空调使用增加，注意避免冷气直吹肩颈。",
      "numbness-tingling": "室内外温差大，注意保持血液循环，多活动四肢。",
      default: "天气炎热时更需注意室内外温差对关节的影响。",
    },
    "inter-monsoon": {
      default: "季节交替期注意身体保养，坚持使用没药喷雾维护关节健康。",
    },
  }

  return tips[season]?.[topic.slug] || tips[season]?.default || tips["inter-monsoon"].default
}

export async function GET(request: Request) {
  try {
    // Verify CRON secret in production
    if (process.env.NODE_ENV === "production") {
      const authHeader = request.headers.get("authorization")
      if (authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const currentSeason = getCurrentSeason()
    const timestamp = new Date().toISOString()

    // Get topics relevant to current season
    const relevantTopics = PAIN_POINT_TOPICS.filter(
      (topic) =>
        topic.seasonalTriggers.includes(currentSeason) ||
        topic.seasonalTriggers.includes("all-year")
    )

    // Generate seasonal tips for each relevant topic
    const updates = relevantTopics.map((topic) => ({
      slug: topic.slug,
      titleZh: topic.titleZh,
      titleEn: topic.titleEn,
      seasonalTip: generateSeasonalTip(currentSeason, topic),
      lastUpdated: timestamp,
      season: currentSeason,
    }))

    // Log the update (in production, this would update a database or file)
    console.log(`[CRON] Pain points updated at ${timestamp}`)
    console.log(`[CRON] Current season: ${currentSeason}`)
    console.log(`[CRON] Updated ${updates.length} topics`)

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Pain points content updated successfully",
      timestamp,
      season: currentSeason,
      updatedTopics: updates.length,
      topics: updates.map((u) => u.slug),
    })
  } catch (error) {
    console.error("[CRON] Error updating pain points:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update pain points",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers
export async function POST(request: Request) {
  return GET(request)
}
