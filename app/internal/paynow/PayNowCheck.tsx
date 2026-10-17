"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { PayNowQr } from "@/components/paynow-qr"
import { buildPayNowPayload, parseTlv, payloadHasValidCrc, type TlvField } from "@/app/lib/paynow"

const FIELD_NAMES: Record<string, string> = {
  "00": "Format",
  "01": "Initiation (11 static, 12 one-off)",
  "26": "PayNow merchant account",
  "52": "Merchant category",
  "53": "Currency (702 = SGD)",
  "54": "Amount",
  "58": "Country",
  "59": "Merchant name",
  "60": "City",
  "61": "Postal code",
  "62": "Additional data",
  "63": "CRC",
}

const SUBFIELD_NAMES: Record<string, Record<string, string>> = {
  "26": { "00": "Scheme", "01": "Proxy type", "02": "Proxy (Aspire VPA)", "03": "Amount editable" },
  "62": { "01": "Reference" },
}

export function PayNowCheck() {
  const [amount, setAmount] = useState("0.10")
  const [reference, setReference] = useState("TEST")

  const result = useMemo(() => {
    try {
      const payload = buildPayNowPayload({ amount: Number(amount), reference })
      return { payload, fields: parseTlv(payload), error: null }
    } catch (error) {
      return { payload: null, fields: [] as TlvField[], error: (error as Error).message }
    }
  }, [amount, reference])

  return (
    <div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr]">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Amount (S$)
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            className="mt-1 w-full rounded-md border px-3 py-2 text-base"
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Reference
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 font-mono text-base uppercase"
          />
        </label>
        <div className="rounded-xl border bg-white p-3">
          {result.payload ? (
            <PayNowQr payload={result.payload} label="Test PayNow QR" className="h-auto w-full" />
          ) : (
            <p className="p-6 text-sm text-red-600">{result.error}</p>
          )}
        </div>
        <Link href="/pay" className="block text-sm text-red-700 hover:underline">
          Open the customer page →
        </Link>
      </div>

      <div className="min-w-0">
        <h2 className="font-semibold text-gray-900">What the QR says</h2>
        {result.payload && (
          <p className="mt-1 text-sm">
            CRC{" "}
            {payloadHasValidCrc(result.payload) ? (
              <span className="font-medium text-green-700">valid</span>
            ) : (
              <span className="font-medium text-red-700">invalid</span>
            )}
          </p>
        )}
        <table className="mt-3 w-full text-sm">
          <tbody>
            {result.fields.map((f) => (
              <FieldRows key={f.id} field={f} />
            ))}
          </tbody>
        </table>
        {result.payload && (
          <pre className="mt-4 overflow-x-auto rounded-md bg-gray-900 p-3 text-xs text-gray-100">{result.payload}</pre>
        )}
      </div>
    </div>
  )
}

function FieldRows({ field }: { field: TlvField }) {
  return (
    <>
      <tr className="border-t">
        <td className="py-1.5 pr-3 font-mono text-gray-500">{field.id}</td>
        <td className="py-1.5 pr-3 text-gray-700">{FIELD_NAMES[field.id] ?? "Unknown"}</td>
        <td className="py-1.5 font-mono break-all">{field.children ? "" : field.value}</td>
      </tr>
      {field.children?.map((c) => (
        <tr key={`${field.id}.${c.id}`}>
          <td className="py-1 pr-3 pl-4 font-mono text-gray-400">
            {field.id}.{c.id}
          </td>
          <td className="py-1 pr-3 text-gray-600">{SUBFIELD_NAMES[field.id]?.[c.id] ?? "Unknown"}</td>
          <td className="py-1 font-mono break-all">{c.value}</td>
        </tr>
      ))}
    </>
  )
}
