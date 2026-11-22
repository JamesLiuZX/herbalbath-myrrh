// Prices and dated promotions, resolved for a given instant from
// content/promotions.json. No imports, so Node's test runner and the scripts
// in scripts/ can load this file directly (the way they load paynow.ts).
//
// Two rules are built in, because getting either wrong costs real money or
// breaks the law:
//  - A window is whole Singapore days. It is computed from UTC arithmetic,
//    never from the server's or the visitor's timezone.
//  - Discounts and multi-pack offers on a medicated oil need an HSA
//    sales-promotion permit. Anything that is one (a "price" campaign, a
//    package marked requiresPermit, the struck-through list price) is shown
//    only while a permit is recorded and in date.

export type Lang = "zh" | "en"

export interface PromoPackage {
  id: string
  bottles: number
  price: number
  label: Record<Lang, string>
  default?: boolean
  requiresPermit?: boolean
}

export interface Campaign {
  id: string
  kind: "content-only" | "price"
  /** Singapore dates, inclusive: "2026-12-15". */
  start: string
  end: string
  banner: Record<Lang, string>
  /** Where the banner links, when the campaign has its own page. */
  href?: string
  /** A real delivery cut-off, shown as "order by". Never a made-up deadline. */
  lastOrderDate?: string
  /** Price campaigns only: packages to add, or to override by id. */
  packages?: PromoPackage[]
}

export interface PromotionsData {
  permit: { number: string; validUntil: string }
  floorPerBottle: number
  maxDiscountPct: number
  evergreen: { listPrice?: number; packages: PromoPackage[] }
  campaigns: Campaign[]
}

export interface PromoSnapshot {
  packages: PromoPackage[]
  defaultId: string
  /** The single-bottle price everything else is compared against. */
  singlePrice: number
  /** The "was" price, only while a permit allows showing a discount. */
  listPrice: number | null
  campaign: Campaign | null
  permitValid: boolean
}

const DAY_MS = 86_400_000
const SG_OFFSET_MS = 8 * 3_600_000
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/

/** The instant a Singapore calendar day starts, or NaN for an impossible date. */
export function sgDayStartMs(date: string): number {
  const m = DATE.exec(date ?? "")
  if (!m) return NaN
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const utc = Date.UTC(y, mo - 1, d)
  const back = new Date(utc)
  // Date.UTC rolls 31 Feb over into March; refuse those.
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return NaN
  return utc - SG_OFFSET_MS
}

/** Today's date in Singapore, "YYYY-MM-DD". */
export function sgDate(nowMs: number): string {
  return new Date(nowMs + SG_OFFSET_MS).toISOString().slice(0, 10)
}

const inWindow = (start: string, end: string, nowMs: number) => nowMs >= sgDayStartMs(start) && nowMs < sgDayStartMs(end) + DAY_MS

export function permitValid(data: PromotionsData, nowMs: number): boolean {
  const { number, validUntil } = data.permit ?? { number: "", validUntil: "" }
  if (!number || !validUntil) return false
  const end = sgDayStartMs(validUntil)
  return Number.isFinite(end) && nowMs < end + DAY_MS
}

export const perBottle = (pkg: Pick<PromoPackage, "price" | "bottles">) => pkg.price / pkg.bottles

/** "S$39" or "S$29.25": no trailing zeros on whole dollars, as the site has always shown them. */
export const formatPrice = (n: number) => `S$${Number.isInteger(n) ? n : n.toFixed(2)}`

export function resolvePromotions(data: PromotionsData, nowMs: number): PromoSnapshot {
  const allowed = permitValid(data, nowMs)
  const campaign = data.campaigns.find((c) => inWindow(c.start, c.end, nowMs) && (c.kind === "content-only" || allowed)) ?? null

  const packages = data.evergreen.packages.filter((p) => allowed || !p.requiresPermit).map((p) => ({ ...p }))
  if (campaign?.kind === "price") {
    for (const p of campaign.packages ?? []) {
      const at = packages.findIndex((q) => q.id === p.id)
      if (at >= 0) packages[at] = { ...packages[at], ...p }
      else packages.push({ ...p })
    }
  }

  const single = packages.find((p) => p.bottles === 1) ?? packages[0]
  return {
    packages,
    defaultId: (packages.find((p) => p.default) ?? packages[packages.length - 1]).id,
    singlePrice: single.price,
    listPrice: allowed && data.evergreen.listPrice ? data.evergreen.listPrice : null,
    campaign,
    permitValid: allowed,
  }
}

/** The package for an id from a link (?b=bundle), or the default when it isn't on offer now. */
export function findPackage(snapshot: PromoSnapshot, id: string | null | undefined): PromoPackage {
  return snapshot.packages.find((p) => p.id === id) ?? snapshot.packages.find((p) => p.id === snapshot.defaultId) ?? snapshot.packages[0]
}

function packageProblems(p: PromoPackage, at: string, data: PromotionsData, singlePrice: number): string[] {
  const errors: string[] = []
  if (!/^[a-z][a-z0-9-]{0,20}$/.test(p.id ?? "")) errors.push(`${at}: id "${p.id}" should be lower-case letters, digits and hyphens`)
  if (!Number.isInteger(p.bottles) || p.bottles < 1 || p.bottles > 24) errors.push(`${at}: bottles should be a whole number from 1 to 24`)
  if (typeof p.price !== "number" || !Number.isFinite(p.price) || p.price <= 0) {
    errors.push(`${at}: price should be a positive number`)
    return errors
  }
  // 11.7 for 117 would lock a PayNow QR at S$11.70: whole cents, and never below the floor.
  if (Math.abs(Math.round(p.price * 100) - p.price * 100) > 1e-6) errors.push(`${at}: price ${p.price} has fractions of a cent`)
  const each = perBottle(p)
  if (each < data.floorPerBottle) errors.push(`${at}: ${formatPrice(each)} a bottle is below the floor of ${formatPrice(data.floorPerBottle)}`)
  const off = (1 - each / singlePrice) * 100
  if (off > data.maxDiscountPct + 1e-9) errors.push(`${at}: ${off.toFixed(1)}% off the single price is more than the ${data.maxDiscountPct}% limit`)
  if (each > singlePrice + 1e-9) errors.push(`${at}: ${formatPrice(each)} a bottle is more than the single price`)
  for (const lang of ["zh", "en"] as const) if (!p.label?.[lang]?.trim()) errors.push(`${at}: label.${lang} is missing`)
  return errors
}

/** Structure, dates, floors and overlaps. Wording is checked in scripts/content/promotions.mjs. */
export function validatePromotions(data: PromotionsData): string[] {
  const errors: string[] = []
  if (!data || typeof data !== "object") return ["promotions.json should be an object"]
  if (!(data.floorPerBottle > 0)) errors.push("floorPerBottle should be a positive number")
  if (!(data.maxDiscountPct >= 0 && data.maxDiscountPct <= 50)) errors.push("maxDiscountPct should be between 0 and 50")
  const permit = data.permit ?? { number: "", validUntil: "" }
  if (!!permit.number !== !!permit.validUntil) errors.push("permit needs both number and validUntil, or neither")
  if (permit.validUntil && !Number.isFinite(sgDayStartMs(permit.validUntil))) errors.push(`permit.validUntil "${permit.validUntil}" isn't a real date`)

  const evergreen = data.evergreen?.packages ?? []
  const single = evergreen.find((p) => p.bottles === 1 && !p.requiresPermit)
  if (!single) return [...errors, "evergreen.packages needs a single bottle that is always on sale"]
  if (evergreen.filter((p) => p.default).length !== 1) errors.push("exactly one evergreen package should be the default")
  if (evergreen.find((p) => p.default)?.requiresPermit) errors.push("the default package can't be one that needs a permit")
  const ids = new Set<string>()
  for (const p of evergreen) {
    if (ids.has(p.id)) errors.push(`evergreen: package id "${p.id}" is used twice`)
    ids.add(p.id)
    errors.push(...packageProblems(p, `evergreen "${p.id}"`, data, single.price))
  }
  if (data.evergreen.listPrice !== undefined && !(data.evergreen.listPrice > single.price)) errors.push("evergreen.listPrice should be above the single price")

  const seen = new Set<string>()
  const windows: { id: string; from: number; to: number }[] = []
  for (const c of data.campaigns ?? []) {
    const at = `campaign "${c.id}"`
    if (!/^[a-z][a-z0-9-]{0,30}$/.test(c.id ?? "")) errors.push(`${at}: id should be lower-case letters, digits and hyphens`)
    if (seen.has(c.id)) errors.push(`${at}: id is used twice`)
    seen.add(c.id)
    if (c.kind !== "content-only" && c.kind !== "price") errors.push(`${at}: kind should be content-only or price`)
    const from = sgDayStartMs(c.start)
    const to = sgDayStartMs(c.end)
    if (!Number.isFinite(from) || !Number.isFinite(to)) errors.push(`${at}: start and end should be real dates like 2026-12-15`)
    else if (to < from) errors.push(`${at}: it ends before it starts`)
    else windows.push({ id: c.id, from, to: to + DAY_MS })
    for (const lang of ["zh", "en"] as const) if (!c.banner?.[lang]?.trim()) errors.push(`${at}: banner.${lang} is missing`)
    if (c.href !== undefined && !/^\/[a-z0-9/-]*$/.test(c.href)) errors.push(`${at}: href should be a path on this site, like /gift`)
    if (c.lastOrderDate !== undefined) {
      const last = sgDayStartMs(c.lastOrderDate)
      if (!Number.isFinite(last)) errors.push(`${at}: lastOrderDate isn't a real date`)
      else if (Number.isFinite(from) && Number.isFinite(to) && (last < from || last > to)) errors.push(`${at}: lastOrderDate is outside the campaign`)
    }
    if (c.kind === "content-only" && c.packages?.length) errors.push(`${at}: a content-only campaign can't carry packages`)
    if (c.kind === "price") {
      if (!c.packages?.length) errors.push(`${at}: a price campaign needs at least one package`)
      for (const p of c.packages ?? []) {
        // Landing and testimonial pages still print the single price; until they read this file it stays fixed.
        if (p.bottles === 1 || p.id === single.id) errors.push(`${at}: the single-bottle price can't change in a campaign`)
        errors.push(...packageProblems(p, `${at} package "${p.id}"`, data, single.price))
      }
    }
  }
  windows.sort((a, b) => a.from - b.from)
  for (let i = 1; i < windows.length; i++) {
    if (windows[i].from < windows[i - 1].to) errors.push(`campaigns "${windows[i - 1].id}" and "${windows[i].id}" overlap: only one runs at a time`)
  }
  return errors
}
