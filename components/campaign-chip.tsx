import Link from "next/link"
import { CalendarDays } from "lucide-react"
import type { Campaign, Lang } from "@/app/lib/promotions"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** "2027-02-03" as 2月3日 / 3 Feb, read straight from the string so no timezone can shift it. */
function shortDate(date: string, lang: Lang) {
  const [, month, day] = date.split("-").map(Number)
  return lang === "zh" ? `${month}月${day}日` : `${day} ${MONTHS[month - 1]}`
}

// The campaign running today (content/promotions.json), with its real last
// order date when it has one. With no campaign it renders nothing: the old
// "N days left this month" countdown was a deadline that did not exist.
export function CampaignChip({ language, campaign }: { language: Lang; campaign: Campaign | null }) {
  if (!campaign) return null
  const chip = (
    <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-800 border border-brand-200 rounded-full px-3 py-1 text-sm sm:text-base font-medium">
      <CalendarDays className="w-4 h-4 flex-shrink-0" />
      <span>
        {campaign.banner[language]}
        {campaign.lastOrderDate &&
          (language === "zh" ? ` · ${shortDate(campaign.lastOrderDate, "zh")}前下单` : ` · order by ${shortDate(campaign.lastOrderDate, "en")}`)}
      </span>
    </span>
  )
  return campaign.href ? <Link href={campaign.href}>{chip}</Link> : chip
}
