import type { Metadata } from "next"
import Link from "next/link"
import { InternalNav } from "@/components/internal/internal-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChecklistItem } from "@/components/internal/checklist-item"

export const metadata: Metadata = {
  title: "Growth Roadmap",
  robots: { index: false, follow: false },
}

function StatusBadge({ status }: { status: "built" | "manual" | "not-started" }) {
  const map = {
    built: { label: "Built, not live", className: "bg-emerald-100 text-emerald-800" },
    manual: { label: "Manual / ongoing", className: "bg-amber-100 text-amber-800" },
    "not-started": { label: "Not started", className: "bg-gray-100 text-gray-600" },
  } as const
  const s = map[status]
  return (
    <Badge variant="secondary" className={s.className}>
      {s.label}
    </Badge>
  )
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <InternalNav active="/internal/roadmap" />

      <main className="container mx-auto px-4 max-w-3xl py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Growth roadmap</h1>
        <p className="text-gray-600 mt-2 leading-relaxed">
          Multi-channel growth plan, corrected against real numbers and phased against the Q3/Q4 2026
          calendar. Deeper technical detail (env vars, WhatsApp template copy, outreach scripts) stays in{" "}
          <code className="bg-gray-100 px-1 rounded">GROWTH.md</code> and{" "}
          <code className="bg-gray-100 px-1 rounded">STRATEGY.md</code> in the repo — this page is the
          current, decision-ready view.
        </p>

        {/* What changed */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-gray-900">What changed since the last pass</h2>
          <p className="text-sm text-gray-500 mt-1">Answered 8 Aug 2026, replaces the two open questions in STRATEGY.md Part 5.</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardContent className="p-5">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Was assumed</div>
                <p className="text-gray-700 mt-1 text-sm">A static base of 15,000 active customers to reactivate.</p>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-4">
                  Actually
                </div>
                <p className="text-gray-900 mt-1 font-medium">~15–20 sales/day, ongoing.</p>
                <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                  "15,000" is a lifetime estimate, not a live pool sitting dormant. There's no large
                  reactivation blast available — the flow is real and steady (~450–600/month), but it's
                  arriving through marketplace channels and not being captured or retained systematically.
                  That makes retention infrastructure and channel diversification the actual priority, not
                  a one-off reactivation campaign.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Was assumed</div>
                <p className="text-gray-700 mt-1 text-sm">15,000 contactable phone numbers to import.</p>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-4">
                  Actually
                </div>
                <p className="text-gray-900 mt-1 font-medium">~200–300 known WhatsApp numbers, no CRM.</p>
                <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                  Reorders currently come in as individual inbound WhatsApp chats/calls — nothing is
                  logged anywhere. That's genuinely good news for a first move: 200–300 is a small enough
                  list to import in an afternoon, and nudging all of them costs about{" "}
                  <strong>S$6</strong> at WhatsApp utility rates (see below). The real fix is making
                  capture automatic going forward, not the size of today's list.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* The automation point */}
        <section className="mt-8">
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900">
                The "automated script" you're describing is already built
              </h3>
              <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                A reorder nudge engine exists in this repo (<code className="bg-white px-1 rounded">app/lib/reorder.ts</code>,{" "}
                <code className="bg-white px-1 rounded">app/api/cron/reorder-nudges/route.ts</code>) —
                daily cron, WhatsApp Cloud API, per-customer due-dates scaled to how many bottles they
                bought. It just isn't live yet. Turning it on for your actual 200–300 numbers is three
                steps, not a new build:
              </p>
              <ul className="space-y-3 mt-3">
                <ChecklistItem id="reorder-1">
                  Connect Upstash Redis (Vercel Marketplace) — this is the only storage the growth features
                  need.
                </ChecklistItem>
                <ChecklistItem id="reorder-2">
                  Enter the 200–300 known numbers (phone, name, last purchase date, bottles, language) —
                  approximate dates are fine, don't let perfect data hold this up.
                </ChecklistItem>
                <ChecklistItem id="reorder-3">
                  Create the WhatsApp template in WhatsApp Manager as <strong>utility</strong>, not
                  marketing (a transaction follow-up, not an offer) — this is what keeps it at ~S$0.02/msg
                  instead of ~S$0.09/msg. Run the cron once with no WhatsApp token set first — it dry-runs
                  and shows you the selection without sending anything.
                </ChecklistItem>
              </ul>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                Then make capture a habit, not a one-time import: log every future inbound reorder the same
                way (a few seconds per chat), and check whether Shopee/Carousell/TikTok Shop order exports
                expose a buyer contact number you can bulk-add — that's a second potential source of
                numbers beyond the ones who've WhatsApped you directly.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Growth channels */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-gray-900">Growth channels, by priority</h2>
          <p className="text-gray-600 mt-1 text-sm">
            Ordered by cost/effort vs. what it returns. The economics forcing this order: a bottle lasts
            3–4 months, so one customer is worth ~S$90–110/year — too little to support broad paid
            acquisition. Growth has to come from repeat purchase and channels that cost nothing per
            customer.
          </p>

          <div className="space-y-4 mt-5">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">1. WhatsApp reorder nudges</h3>
                  <StatusBadge status="built" />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Highest ROI available. ~S$6 to nudge the current 200–300 contacts once connected. See
                  callout above.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">2. Referral captains (/kit)</h3>
                  <StatusBadge status="built" />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Zero CAC — a 5-character code plus a forwardable WhatsApp card, 20% single-tier commission.
                  Recruit the first 10 from repeat buyers you already know personally through the 200–300,
                  not strangers. A broader "who referred you" broadcast becomes viable once the contact
                  base grows past this initial group.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">3. Chinese-language SEO</h3>
                  <StatusBadge status="manual" />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  The RAG content pipeline already exists and generates English/bilingual articles. 膝盖痛
                  新加坡, 关节痛怎么办, and similar long-tail Chinese queries have almost no serious
                  competition. Same pipeline, repoint the topic list — near-zero marginal cost.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">4. Practitioner / trade doors (/trade)</h3>
                  <StatusBadge status="built" />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Wholesale ladder and lead capture exist; zero doors signed yet. TCM clinics, medical
                  halls, tuina and reflexology — the practitioner has hands on the exact body part, and the
                  product demos instantly (perceptible heat in seconds). Pre-researched target list in{" "}
                  <code className="bg-gray-100 px-1 rounded">app/lib/outreach-targets.ts</code>. Start with
                  ~20 doors; kill anything clearing under 8 units/month.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">5. Medical equipment rental shops</h3>
                  <StatusBadge status="not-started" />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Sits at the highest-intent moment in the market: hospital discharge after a fall, hip or
                  knee replacement, when a caregiver is buying everything at once with no price
                  sensitivity. Small owner-operated shops, want add-on margin, essentially uncontested.
                  Home care agencies and home-visit physio providers are the same play.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">6. Community &amp; festival sponsorship</h3>
                  <StatusBadge status="not-started" />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Clan associations, temples, church senior fellowships, Active Ageing Centres — goodie bags
                  and sponsored talks timed to 中秋 and 重阳. Gated on the 20–30ml 随身装 SKU existing (see
                  calendar below — this is the one with a hard deadline).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">7. 孝心礼盒 gift box → adult children</h3>
                  <StatusBadge status="not-started" />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  S$88 gift box (two bottles + travel size + card), priced up to the adult child rather than
                  down to the senior. Targeted Xiaohongshu/Facebook aimed at the daughter/son — KOC posts,
                  not broad prospecting — timed for CNY gifting decisions, which start in December.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">8. Press (8world, then Shin Min)</h3>
                  <StatusBadge status="not-started" />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  The clipping is the asset, not the reach — becomes laminated collateral for clinic visits
                  and gets forwarded in aunty WhatsApp groups. Pitch the founder story, not the product.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Compliance runs alongside all of this, not before it — see{" "}
            <Link href="/internal/hsa-certifications" className="text-red-700 hover:underline">
              HSA certifications
            </Link>
            . Framed as a moat: most shophouse competitors have no listing and no dossier, and would be
            caught flat-footed if HSA's move toward mandatory frameworks reaches this category.
          </div>
        </section>

        {/* Calendar */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-gray-900">Q3/Q4 calendar</h2>
          <p className="text-gray-600 mt-1 text-sm leading-relaxed">
            Three dates this all sequences around. Lunar dates — worth confirming against a Singapore
            almanac before committing spend.
          </p>

          <div className="mt-4 space-y-3">
            <Card className="border-red-300">
              <CardContent className="p-4 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-semibold text-gray-900">~17 Aug 2026 — order deadline</div>
                  <p className="text-sm text-gray-600 mt-1">
                    The 20–30ml 随身装 has an 8–12 week lead time and gates the whole 重阳 goodie-bag plan
                    below. If it hasn't been ordered yet, this is the most time-critical item on this page.
                  </p>
                </div>
                <Badge className="bg-red-700">Urgent</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="font-semibold text-gray-900">25 Sep 2026 — 中秋节 Mid-Autumn</div>
                <p className="text-sm text-gray-600 mt-1">
                  Clan associations, CCs and temples run events with gift bags.
                </p>
              </CardContent>
            </Card>
            <Card className="border-red-300 bg-red-50/40">
              <CardContent className="p-4">
                <div className="font-semibold text-gray-900">18 Oct 2026 — 重阳节 / Seniors' Day (Sunday)</div>
                <p className="text-sm text-gray-600 mt-1">
                  The single best day of the year for this product. Every clan association, temple, CC and
                  AAC runs a 敬老 event. Goodie-bag sponsorships get committed 4–8 weeks ahead — pitch in
                  early September.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="font-semibold text-gray-900">Early Dec 2026 — 孝心礼盒 launch</div>
                <p className="text-sm text-gray-600 mt-1">
                  CNY gifting decisions start in December for a February new year — the gift box needs to
                  exist before then, not during.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="font-semibold text-gray-900">6 Feb 2027 — 农历新年 CNY</div>
                <p className="text-sm text-gray-600 mt-1">Peak gifting window closes here.</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-5 text-sm text-gray-600 leading-relaxed">
            <strong>Gate before scaling practitioner doors past the first ~20:</strong> at least 10 doors
            clearing 8 units/month, and a measurable reorder rate from the WhatsApp nudges. If neither is
            true by mid-October, the problem is the offer, not the door count — fix that before multiplying
            outreach.
          </div>
        </section>

        {/* Known gaps in what's live */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-gray-900">Known gaps between this plan and the live site</h2>
          <Card className="mt-3">
            <CardContent className="p-5">
              <ul className="space-y-3">
                <ChecklistItem id="gap-claims">
                  Live copy still carries claims flagged for removal — "无副作用"/no side effects, "深层
                  治愈"/deep healing, "远超化学药物" — across 6 files. These were cleaned up on a branch but
                  never shipped to the live site. Worth prioritizing given the HSA advertisement-permit
                  question above.
                </ChecklistItem>
                <ChecklistItem id="gap-bundle">
                  The 买3送1 bundle still ships all 4 bottles at once rather than the prepaid-quarterly
                  reframe (same price, 4 delivery touchpoints instead of 1) — copy-only change, not yet
                  applied to the live homepage.
                </ChecklistItem>
                <ChecklistItem id="gap-infra">
                  Reorder engine, captain kit, and trade channel exist in the repo but aren't deployed —
                  need Redis connected and this branch merged before any of channel 1–4 above can go live.
                </ChecklistItem>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* What not to do */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-gray-900">What not to do</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 list-disc list-inside">
            <li>No broad paid social prospecting to 55+ — the arithmetic at S$39 AOV doesn't work and doesn't compound.</li>
            <li>No pharmacy chains until practitioner-door velocity data exists to negotiate with.</li>
            <li>No app, no marketplace, no custom checkout — the only software worth building is reorder, attribution, and restock, and those already exist.</li>
            <li>No rebrand — eight years of equity outweighs the awkward "herbal bath" name for a spray.</li>
          </ul>
        </section>

        <div className="mt-10 flex items-center justify-between border-t pt-6 text-sm">
          <Link href="/internal" className="text-gray-500 hover:underline">
            ← Overview
          </Link>
          <Link href="/internal/hsa-certifications" className="text-red-700 hover:underline">
            HSA certifications →
          </Link>
        </div>
      </main>
    </div>
  )
}
