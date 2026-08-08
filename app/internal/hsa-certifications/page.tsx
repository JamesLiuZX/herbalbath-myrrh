import type { Metadata } from "next"
import Link from "next/link"
import { InternalNav } from "@/components/internal/internal-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChecklistItem } from "@/components/internal/checklist-item"

export const metadata: Metadata = {
  title: "HSA Certifications",
  robots: { index: false, follow: false },
}

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-red-700 underline decoration-red-200 underline-offset-2 hover:decoration-red-500"
    >
      {children}
    </a>
  )
}

export default function HsaCertificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <InternalNav active="/internal/hsa-certifications" />

      <main className="container mx-auto px-4 max-w-3xl py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">HSA certifications</h1>
        <p className="text-gray-600 mt-2 leading-relaxed">
          What HerbalBath (a topical myrrh/frankincense spray, applied externally, sold with pain and
          muscle-relief claims) most likely needs from Singapore's Health Sciences Authority to be fully
          compliant — and the documents each piece needs.
        </p>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed">
          <strong>Read this before acting on anything below.</strong> HSA's own site was unreachable from
          this research session (network policy blocked it), so this was compiled from indexed excerpts of
          the official pages across a dozen searches, cross-checked against each other — not from reading
          the full primary pages directly. It's a strong starting map with real citations, not a final
          answer. Confirm the classification with HSA's own tool (below) and, ideally, their free
          pre-submission consultation before you spend money on lab tests or an audit.
        </div>

        {/* Step 0 */}
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-red-700">Step 0 — do this first</Badge>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Confirm the classification</h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            Everything below forks on one question: which category does this product actually land in?
            HSA runs a free self-help tool for exactly this — a short questionnaire on the product's
            formulation, claims, and packaging that returns a classification you can print.
          </p>
          <Card className="mt-3 bg-white">
            <CardContent className="p-4">
              <Source href="https://www.hsa.gov.sg/CHP-classification-tool">
                hsa.gov.sg/CHP-classification-tool
              </Source>
              <span className="text-gray-500 text-sm">
                {" "}
                — Complementary Health Products Classification Tool. ~10 minutes, no login, gives a
                printable outcome.
              </span>
            </CardContent>
          </Card>
          <p className="text-gray-600 mt-3 leading-relaxed">
            Three outcomes are realistic for this product. Which one you land in changes the entire rest
            of this page:
          </p>

          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            <Card className="border-emerald-200">
              <CardHeader className="p-4 pb-2">
                <Badge variant="secondary" className="w-fit bg-emerald-100 text-emerald-800">
                  Lightest
                </Badge>
                <CardTitle className="text-base mt-1">Medicated Oil / Balm</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm text-gray-600">
                Likely fit by product form — a topical liniment/spray with a warming sensation claim is
                the same shape as Tiger Balm or Axe Brand Universal Oil, both of which sit here.{" "}
                <strong>Voluntary notification only, no licence.</strong> See Track A.
              </CardContent>
            </Card>
            <Card className="border-amber-200">
              <CardHeader className="p-4 pb-2">
                <Badge variant="secondary" className="w-fit bg-amber-100 text-amber-800">
                  Heaviest
                </Badge>
                <CardTitle className="text-base mt-1">Chinese Proprietary Medicine</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm text-gray-600">
                Applies if formulation, packaging or claims read as a TCM remedy rather than a topical
                liniment. <strong>Mandatory product listing + dealer's licence(s).</strong> See Track B.
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardHeader className="p-4 pb-2">
                <Badge variant="secondary" className="w-fit">
                  Trade-off
                </Badge>
                <CardTitle className="text-base mt-1">Cosmetic</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm text-gray-600">
                Lightest possible (ASEAN cosmetic notification, self-declared) — but only if{" "}
                <strong>every</strong> relief/medicinal claim is dropped. Given the brand is built on "10
                秒感受热感" and pain relief, this likely isn't the one you want. Named here as the boundary
                case, not a recommendation.
              </CardContent>
            </Card>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Sources:{" "}
            <Source href="https://www.hsa.gov.sg/other-regulations/medicated-oils-and-balms/">
              Medicated oils, balms and medicated plasters
            </Source>
            ,{" "}
            <Source href="https://www.hsa.gov.sg/chinese-proprietary-medicines/overview/">
              Regulatory overview of Chinese Proprietary Medicines
            </Source>
            ,{" "}
            <Source href="https://www.hsa.gov.sg/cosmetic-products/classification/">
              Cosmetic product classification guide
            </Source>
          </p>
        </section>

        {/* Track A */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">Track A — if Medicated Oil / Balm (MOB)</h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            Dealers may <strong>voluntarily notify</strong> HSA of medicated oils, balms and medicated
            plasters. There is no licence, no mandatory listing, and — unlike Chinese Proprietary Medicines
            — MOB is <strong>not subject to HSA approval/licensing to import, manufacture or sell</strong>.
            Notification still requires evidence the product is safe.
          </p>
          <Card className="mt-3">
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-800 mb-3">Documents for the notification</h3>
              <ul className="space-y-3">
                <ChecklistItem id="mob-acra">
                  Be a locally registered company (ACRA) — prerequisite for submitting any notification.
                </ChecklistItem>
                <ChecklistItem id="mob-heavy-metals">
                  Lab test report: toxic heavy metals within permissible limits.
                </ChecklistItem>
                <ChecklistItem id="mob-microbial">
                  Lab test report: microbial content within permissible limits.
                </ChecklistItem>
                <ChecklistItem id="mob-deg-eg">
                  DEG/EG (diethylene glycol / ethylene glycol) lab test — <em>only if</em> the formulation
                  uses glycerin, propylene glycol, or a sorbitol-type carrier. Confirm this with your
                  formulator; if the spray's base doesn't use one of these, this test likely doesn't apply.
                </ChecklistItem>
                <ChecklistItem id="mob-tse">
                  TSE (Transmissible Spongiform Encephalopathy) undertaking — <em>only if</em> any
                  ingredient is animal-derived.
                </ChecklistItem>
                <ChecklistItem id="mob-no-steroids">
                  Confirm no steroids or other medicinal ingredients are present — myrrh and frankincense
                  are fine; this rule targets undeclared pharmaceutical actives.
                </ChecklistItem>
                <ChecklistItem id="mob-label">
                  Product label in English: product name, batch number, expiry date, ingredient list.
                </ChecklistItem>
              </ul>
            </CardContent>
          </Card>
          <p className="text-xs text-gray-400 mt-3">
            Sources:{" "}
            <Source href="https://www.hsa.gov.sg/other-regulations/medicated-oils-and-balms/">
              Medicated oils, balms and medicated plasters
            </Source>
            ,{" "}
            <Source href="https://www.hsa.gov.sg/docs/default-source/hprg-tmhs/chpb-tmhs/vns_guidelines.pdf">
              Voluntary Notification guidelines (PDF)
            </Source>
            ,{" "}
            <Source href="https://www.hsa.gov.sg/docs/default-source/hprg-tmhs/tm_hm_mob-qna.pdf">
              Q&amp;A on Traditional/Homeopathic Medicines &amp; MOB (PDF)
            </Source>
          </p>
        </section>

        {/* Track B */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">
            Track B — if Chinese Proprietary Medicine (CPM)
          </h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            The heavier, worst-case-to-prepare-for track. Four separate approvals, roughly in this order.
            All applications go through HSA's <strong>PRISM</strong> e-services portal, and you must be an
            ACRA-registered company throughout.
          </p>

          <div className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-700 text-white text-xs font-bold">
                    1
                  </span>
                  <h3 className="font-semibold text-gray-800">CPM Product Listing</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3 ml-8">
                  Required before you can import, manufacture, or sell this specific product.
                  <strong> Processing: 60 working days</strong>, excluding time you spend responding to
                  HSA's clarification requests. First-time applicants: email HSA to arrange a free
                  pre-submission consultation before filing.
                </p>
                <ul className="space-y-3 ml-8">
                  <ChecklistItem id="cpm-heavy-metals">Toxic heavy metals test report.</ChecklistItem>
                  <ChecklistItem id="cpm-microbial">Microbial limits test report.</ChecklistItem>
                  <ChecklistItem id="cpm-deg-eg">
                    DEG/EG test report — if the formulation includes glycerin/propylene glycol/sorbitol.
                  </ChecklistItem>
                  <ChecklistItem id="cpm-manufacturing">Description of the manufacturing process.</ChecklistItem>
                  <ChecklistItem id="cpm-label">
                    English product label: name, batch number, expiry date, active ingredients, dosage/
                    directions.
                  </ChecklistItem>
                  <ChecklistItem id="cpm-gmp-cert">
                    GMP certificate, if the manufacturer already holds one (strengthens the application;
                    not always mandatory to submit — confirm at the pre-submission consultation).
                  </ChecklistItem>
                  <ChecklistItem id="cpm-no-controlled">
                    Confirm no Poisons Act-controlled substances and no synthetic Western drug compounds in
                    the formulation.
                  </ChecklistItem>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-700 text-white text-xs font-bold">
                    2
                  </span>
                  <h3 className="font-semibold text-gray-800">Import Licence</h3>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  Needed if importing the finished product or raw materials from overseas.{" "}
                  <strong>Prerequisite: at least in-principle Product Listing approval</strong> — apply for
                  this after step 1 is underway, not before.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-700 text-white text-xs font-bold">
                    3
                  </span>
                  <h3 className="font-semibold text-gray-800">Wholesale Dealer's Licence</h3>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  Needed once selling wholesale — i.e. exactly the TCM clinic / medical hall trade channel
                  already planned in the roadmap.{" "}
                  <strong>Requires GDP (Good Distribution Practice) compliance</strong> and a physical
                  premises audit by HSA before the licence is issued.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-700 text-white text-xs font-bold">
                    4
                  </span>
                  <h3 className="font-semibold text-gray-800">Manufacturer's Licence (only if applicable)</h3>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  Only needed if manufacturing, assembling or repacking domestically — not needed if fully
                  importing a finished, already-labelled product. GMP compliance is mandatory for
                  manufacturers either way; a formal HSA-issued GMP certificate is technically optional if
                  compliance is otherwise demonstrated, but institutional buyers (pharmacies, hospitals)
                  will functionally expect one.
                </p>
              </CardContent>
            </Card>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Sources:{" "}
            <Source href="https://www.hsa.gov.sg/chinese-proprietary-medicines/listing/apply">
              Apply for new product listing
            </Source>
            ,{" "}
            <Source href="https://file.go.gov.sg/hsa-cpm-listing-fsc-guidelines.pdf">
              Guidelines on CPM Product Listing (PDF)
            </Source>
            ,{" "}
            <Source href="https://www.hsa.gov.sg/chinese-proprietary-medicines/dealers-licence/apply">
              Apply for a CPM dealer's licence
            </Source>
            ,{" "}
            <Source href="https://www.hsa.gov.sg/chinese-proprietary-medicines/dealers-licence/overview">
              Overview of importer/wholesaler/manufacturer licences
            </Source>
            ,{" "}
            <Source href="https://www.hsa.gov.sg/chinese-proprietary-medicines/dealers-licence/gmp-gdp-standards">
              GMP and GDP standards
            </Source>
            ,{" "}
            <Source href="https://www.hsa.gov.sg/chinese-proprietary-medicines/dealers-licence/certification-of-local-manufacturers/gmp-certificate">
              GMP certificate for local manufacturers
            </Source>
          </p>
        </section>

        {/* Advertisement permit */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">Cross-cutting — the Advertisement Permit</h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            This applies on <strong>either</strong> track above, separately from product classification. A
            permit is required before publishing any consumer-facing ad or sales promotion that carries a
            medicinal claim. If the ad makes <strong>no</strong> medicinal claim, no permit is needed.
          </p>
          <Card className="mt-3">
            <CardContent className="p-5 text-sm text-gray-600 space-y-2">
              <p>
                <strong>Valid 1 year</strong>, renewable annually. The permit number must appear on the
                advertising/promotional material itself. Applied for via HSA's website.
              </p>
              <p>
                Worth a specific legal read: the claims cleanup already done sitewide removed the highest-
                risk phrases ("无副作用"/no side effects, "深层治愈"/deep healing, named-competitor
                comparisons). But phrases like "舒缓"/relief and "10秒感受热感" likely still read as
                medicinal claims (they assert a physiological effect), which would still trigger this
                permit even after the cleanup — worth confirming which side of the line the current copy
                sits on.
              </p>
              <p>
                This is also exactly why <code className="bg-gray-100 px-1 rounded">/trade</code> is
                <code className="bg-gray-100 px-1 rounded">noindex</code> and off the public nav: material
                directed exclusively at people who may lawfully sell the product in their trade doesn't
                count as a consumer advertisement, so it sits outside this requirement. Linking that page
                from the homepage would undo that.
              </p>
            </CardContent>
          </Card>
          <p className="text-xs text-gray-400 mt-3">
            Sources:{" "}
            <Source href="https://www.hsa.gov.sg/advertisements-and-promotions-of-medicinal-products">
              Advertisements and Promotions of Medicinal Products
            </Source>
            ,{" "}
            <Source href="https://www.hsa.gov.sg/docs/default-source/hprg-vcb/medical-advertisements-sales-promotion/guideadverttradmedmaterialsmar2005_1aug17.pdf">
              Guidance on Advertisements of Traditional Medicinal Materials (PDF)
            </Source>
          </p>
        </section>

        {/* Recommended sequence */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">Recommended sequence</h2>
          <Card className="mt-3">
            <CardContent className="p-5">
              <ul className="space-y-3">
                <ChecklistItem id="seq-1">
                  Run the CHP Classification Tool this week — free, ~10 minutes.
                </ChecklistItem>
                <ChecklistItem id="seq-2">
                  Commission baseline lab tests (heavy metals + microbial) now — needed on every track, so
                  this is never wasted spend.
                </ChecklistItem>
                <ChecklistItem id="seq-3">
                  Ask your formulator/manufacturer directly: does the base use glycerin/propylene glycol/
                  sorbitol (→ DEG/EG test needed)? Any animal-derived ingredient (→ TSE undertaking
                  needed)?
                </ChecklistItem>
                <ChecklistItem id="seq-4">
                  Follow Track A or Track B above based on what the tool returns.
                </ChecklistItem>
                <ChecklistItem id="seq-5">
                  If any medicinal claim survives in consumer-facing ads, file for the Advertisement Permit
                  in parallel — it doesn't block product listing/notification, so it can run alongside.
                </ChecklistItem>
                <ChecklistItem id="seq-6">
                  Confirm ACRA registration is in order before any HSA submission — it's a prerequisite for
                  all of the above.
                </ChecklistItem>
              </ul>
            </CardContent>
          </Card>
          <p className="text-gray-600 mt-4 leading-relaxed text-sm">
            Context on urgency: HSA has been signalling a move toward{" "}
            <em>mandatory</em> notification for adjacent categories — a July 2026 trade-press report
            described a proposal for mandatory health supplements notification. If that trend reaches this
            category, getting ahead of it on a voluntary basis now is a moat: most shophouse competitors
            have no listing, no dossier, and would be caught flat-footed if a mandatory framework lands.
            See the growth roadmap's framing of HSA listing as a moat, not just a compliance cost.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Source:{" "}
            <Source href="https://www.nutraingredients.com/Article/2026/07/02/singapore-regulator-proposes-mandatory-health-supplements-notification/">
              Singapore regulator proposes mandatory health supplements notification — NutraIngredients,
              2 Jul 2026
            </Source>
          </p>
        </section>

        <div className="mt-10 flex items-center justify-between border-t pt-6 text-sm">
          <Link href="/internal/roadmap" className="text-red-700 hover:underline">
            ← Growth roadmap
          </Link>
          <Link href="/internal" className="text-gray-500 hover:underline">
            Back to overview
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">Compiled 8 Aug 2026. Re-verify before filing anything.</p>
      </main>
    </div>
  )
}
