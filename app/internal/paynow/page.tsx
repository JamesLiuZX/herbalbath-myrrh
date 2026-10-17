import type { Metadata } from "next"
import { InternalNav } from "@/components/internal/internal-nav"
import { PayNowCheck } from "./PayNowCheck"

export const metadata: Metadata = {
  title: "PayNow check",
  robots: { index: false, follow: false },
}

export default function InternalPayNowPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <InternalNav active="/internal/paynow" />
      <main className="container mx-auto px-4 max-w-5xl py-10">
        <h1 className="text-2xl font-bold text-gray-900">PayNow check</h1>
        <p className="text-gray-600 mt-1 max-w-2xl">
          Scan a small test amount from your own banking app before sending customers to /pay. You should see payee
          HERBALBATH PTE. LTD., the amount already filled and not editable, and the reference. Then check the reference
          shows on the Aspire transaction.
        </p>
        <PayNowCheck />
      </main>
    </div>
  )
}
