import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  /** Off when the page writes its own BreadcrumbList (blog posts use full titles there). */
  schema?: boolean
}

export function Breadcrumbs({ items, schema = true }: BreadcrumbsProps) {
  // Generate BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `https://herbalbathsg.com${item.href}`,
    })),
  }

  return (
    <>
      {/* JSON-LD for breadcrumbs */}
      {schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      ) : null}

      {/* Visual breadcrumbs */}
      <nav aria-label="Breadcrumb" className="py-4">
        <ol className="flex flex-wrap items-center gap-2 text-base">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-stone-400 flex-shrink-0" aria-hidden="true" />
              )}
              {index === 0 && (
                <Home className="h-4 w-4 text-stone-500 flex-shrink-0" aria-hidden="true" />
              )}
              {index === items.length - 1 ? (
                <span className="text-stone-600 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-emerald-700 hover:text-emerald-600 hover:underline transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
