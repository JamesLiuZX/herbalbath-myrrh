// Single source of truth for every number the growth channels depend on.
//
// Pricing was previously duplicated across page.tsx, bundle-selector.tsx and
// faq-section.tsx, which is how the S$39 / S$117 figures drifted apart once
// already. New channels (captain kit, trade/wholesale, reorder nudges) all
// read from here so there is exactly one place to change a price.
//
// ⚠️ REVIEW BEFORE LAUNCH: the wholesale ladder below is a proposed starting
// structure, not a confirmed one. Confirm your landed cost per unit and your
// own margin floor before sending these numbers to a single clinic owner —
// once a trade price is quoted it is very hard to walk back.

export const CONTACT = {
  /** Digits only, in wa.me format (no +, no spaces). */
  whatsappNumber: "6584261225",
  /** Human-readable, for print and voice. */
  whatsappDisplay: "8426 1225",
  phone: "+6584261225",
  site: "https://herbalbathsg.com",
} as const

export const RETAIL = {
  currency: "S$",
  singlePrice: 39,
  originalPrice: 49,
  /** Buy 3 get 1 free — 4 bottles for the price of 3. */
  bundleBottles: 4,
  bundlePrice: 117,
  get bundlePerBottle() {
    return +(this.bundlePrice / this.bundleBottles).toFixed(2)
  },
} as const

/** A bottle is marketed as lasting 3–4 months of twice-daily use. */
export const USAGE = {
  bottleLastsDaysMin: 90,
  bottleLastsDaysMax: 120,
  /** Nudge before they run dry, not after — a lapsed user is far harder to win back. */
  reorderNudgeDay: 75,
  /** Second and final nudge. Beyond this we stop; more becomes spam. */
  reorderFollowUpDay: 105,
} as const

export interface WholesaleTier {
  id: string
  nameZh: string
  nameEn: string
  /** Minimum units per order. A carton is assumed to be 12 units. */
  minUnits: number
  unitPrice: number
  /** Percent off retail RRP, derived — never hand-write this. */
  get discountPct(): number
  perksZh: string[]
  perksEn: string[]
}

function tier(
  id: string,
  nameZh: string,
  nameEn: string,
  minUnits: number,
  unitPrice: number,
  perksZh: string[],
  perksEn: string[],
): WholesaleTier {
  return {
    id,
    nameZh,
    nameEn,
    minUnits,
    unitPrice,
    get discountPct() {
      return Math.round((1 - unitPrice / RETAIL.singlePrice) * 100)
    },
    perksZh,
    perksEn,
  }
}

// Outright purchase, not consignment. Consignment means you carry the stock
// risk AND a reconciliation task per outlet per month, forever — that is the
// opposite of low-ops. Outright at a deeper discount buys the same shelf.
export const WHOLESALE_TIERS: WholesaleTier[] = [
  tier(
    "starter",
    "试单价",
    "Starter",
    12,
    21.45,
    ["免费赠送 6 支试用装", "柜台展示架 1 个", "中文产品说明卡"],
    ["6 free tester units", "1 counter display stand", "Chinese product cards"],
  ),
  tier(
    "growth",
    "常规批发价",
    "Growth",
    36,
    19.5,
    ["免费赠送 12 支试用装", "柜台展示架 2 个", "中文产品说明卡", "免费送货"],
    ["12 free tester units", "2 counter display stands", "Chinese product cards", "Free delivery"],
  ),
  tier(
    "chain",
    "连锁/多店价",
    "Chain",
    72,
    17.55,
    ["免费赠送 24 支试用装", "各店展示架", "员工产品培训（线上）", "免费送货", "专属客户经理"],
    [
      "24 free tester units",
      "Display stand per outlet",
      "Online staff product training",
      "Free delivery",
      "Named account contact",
    ],
  ),
]

/** A carton is the natural ordering unit for a clinic or medical hall. */
export const UNITS_PER_CARTON = 12

/**
 * Kill threshold for a trade door. Below this, the outlet is costing you more
 * in restock trips and attention than it returns — replace it rather than
 * nurture it. Stated here so it stays a rule, not a feeling.
 */
export const MIN_UNITS_PER_DOOR_PER_MONTH = 8

export const CAPTAIN = {
  /** Flat commission on retail value of attributed orders. */
  commissionPct: 20,
  /**
   * Single tier only, paid strictly on product sold. Paying anyone for
   * recruiting other recruiters would put this in scope of Singapore's
   * Multi-Level Marketing and Pyramid Selling (Prohibition) Act. Keep it
   * one level deep and tied to actual sales and it stays a normal
   * commission arrangement.
   */
  tiers: 1,
  payoutMethod: "PayNow",
  payoutDayOfMonth: 5,
} as const
