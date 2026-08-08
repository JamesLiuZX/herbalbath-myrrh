import type { Metadata } from "next"
import Link from "next/link"
import { InternalNav } from "@/components/internal/internal-nav"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Internal",
  robots: { index: false, follow: false },
}

export default function InternalHubPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <InternalNav active="/internal" />

      <main className="container mx-auto px-4 max-w-5xl py-10">
        <h1 className="text-2xl font-bold text-gray-900">Internal</h1>
        <p className="text-gray-600 mt-1">Working docs — not for customers or trade partners.</p>

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <Link href="/internal/roadmap">
            <Card className="h-full hover:border-red-300 hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-lg">Growth roadmap</CardTitle>
                <CardDescription>Multi-channel plan, phased against the Q3/Q4 calendar</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                Reorder engine, referral captains, practitioner doors, trade channel, community and
                gifting seasons — prioritized, with what's already built vs. still manual.
              </CardContent>
            </Card>
          </Link>

          <Link href="/internal/hsa-certifications">
            <Card className="h-full hover:border-red-300 hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-lg">HSA certifications</CardTitle>
                <CardDescription>Every licence/registration this product may need, and why</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                Classification tool, the three possible regulatory tracks, documents required for
                each, and the advertising permit question — with sources.
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Snapshot — as of 8 Aug 2026
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-900">15–20/day</div>
                <div className="text-sm text-gray-500 mt-1">
                  Current sales run-rate. "15,000 customers" is a lifetime estimate, not a live
                  active base — see roadmap for what this changes.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-900">~200–300</div>
                <div className="text-sm text-gray-500 mt-1">
                  Known, contactable WhatsApp numbers. No CRM — reorders come in as individual
                  inbound chats/calls.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-900">18 Oct</div>
                <div className="text-sm text-gray-500 mt-1">
                  重阳节 / Seniors' Day — the single best day of the year for this product. Goodie-bag
                  commitments happen 4–8 weeks earlier.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Team tools</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/kit" className="rounded-md border bg-white px-4 py-2 hover:border-red-300">
              /kit — captain referral kit
            </Link>
            <Link href="/trade" className="rounded-md border bg-white px-4 py-2 hover:border-red-300">
              /trade — wholesale ladder
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Those two are noindex but not password-gated — don't post their links anywhere public.
          </p>
        </div>

        <div className="mt-10 text-xs text-gray-400 border-t pt-4">
          Deeper technical detail lives in <code className="bg-gray-100 px-1 rounded">STRATEGY.md</code> and{" "}
          <code className="bg-gray-100 px-1 rounded">GROWTH.md</code> in the repo — this section is the
          living, corrected, decision-ready view.
        </div>
      </main>
    </div>
  )
}
