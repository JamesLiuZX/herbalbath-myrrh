import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Internal Access",
  robots: { index: false, follow: false },
}

export default async function InternalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>
}) {
  const params = await searchParams
  const from = params.from && params.from.startsWith("/internal") ? params.from : "/internal"
  const hasError = params.error === "1"

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Internal Access</h1>
        <p className="text-sm text-gray-500 mb-6">草药浴 HerbalBath — team only.</p>
        <form method="POST" action="/api/internal/login" className="space-y-4">
          <input type="hidden" name="from" value={from} />
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
            />
          </div>
          {hasError && <p className="text-sm text-red-600">Wrong password. Try again.</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-red-700 text-white text-sm font-medium py-2 hover:bg-red-800 transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}
