// content/promotions.json for scripts: what is running now, and whether the
// file is safe to ship. The structure and price guards are the site's own
// (app/lib/promotions.ts); the wording guards are the content rules.

import { resolvePromotions, validatePromotions, sgDate } from "../../app/lib/promotions.ts"
import { claimProblems, loadPromotions, loadRules } from "./lib.mjs"

const hasWord = (text, word, en) => (en ? new RegExp(`(^|[^a-z])${word.replace(/[.*+?^${}()|[\]\\#]/g, "\\$&")}([^a-z]|$)`, "i").test(text) : text.includes(word))

/** Promotion copy sits next to the product by definition, so effect words and promotion words are refused anywhere in it. */
export function copyProblems(text, lang, rules = loadRules()) {
  const en = lang === "en"
  const lower = text.toLowerCase()
  const errors = claimProblems([text], lang, rules)
  for (const w of rules.effectWords[lang]) if (hasWord(lower, w.toLowerCase(), en)) errors.push(`“${w}” promises an effect: ${text.slice(0, 60)}`)
  for (const w of rules.promoTerms?.[lang] ?? []) if (hasWord(lower, w.toLowerCase(), en)) errors.push(`“${w}” is promotion wording HSA bans for medicated oils: ${text.slice(0, 60)}`)
  return [...new Set(errors)]
}

/** Every reason promotions.json must not ship: structure, dates, price floors, overlaps and wording. */
export function promotionProblems(data = loadPromotions(), rules = loadRules()) {
  const errors = validatePromotions(data)
  const copy = []
  for (const p of data.evergreen?.packages ?? []) copy.push([`evergreen "${p.id}"`, p.label])
  for (const c of data.campaigns ?? []) {
    copy.push([`campaign "${c.id}" banner`, c.banner])
    for (const p of c.packages ?? []) copy.push([`campaign "${c.id}" package "${p.id}"`, p.label])
  }
  for (const [at, text] of copy) {
    for (const lang of ["zh", "en"]) {
      if (typeof text?.[lang] !== "string") continue
      for (const problem of copyProblems(text[lang], lang, rules)) errors.push(`${at} (${lang}): ${problem}`)
    }
  }
  return errors
}

/** What is on offer at `now`: the packages, the active campaign (or null) and today's Singapore date. */
export function activePromotion(now = Date.now(), data = loadPromotions()) {
  return { today: sgDate(now), ...resolvePromotions(data, now) }
}

/** Campaigns that start within `days`, soonest first, for the operator's calendar shift. */
export function upcomingCampaigns(now = Date.now(), days = 28, data = loadPromotions()) {
  const today = sgDate(now)
  const limit = sgDate(now + days * 86_400_000)
  return (data.campaigns ?? []).filter((c) => c.end >= today && c.start <= limit).sort((a, b) => a.start.localeCompare(b.start))
}
