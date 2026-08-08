import Link from "next/link"

const links = [
  { href: "/internal", label: "Overview" },
  { href: "/internal/roadmap", label: "Growth roadmap" },
  { href: "/internal/hsa-certifications", label: "HSA certifications" },
]

export function InternalNav({ active }: { active: string }) {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <Link href="/internal" className="text-lg font-bold text-red-700">
            草药浴 HerbalBath <span className="font-normal text-gray-400">/ internal</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  active === link.href
                    ? "bg-red-50 text-red-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <form method="POST" action="/api/internal/logout">
              <button type="submit" className="rounded-md px-3 py-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                Log out
              </button>
            </form>
          </nav>
        </div>
      </div>
    </header>
  )
}
