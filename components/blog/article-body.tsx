import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Lightbulb } from "lucide-react"
import type { ArticleBlock } from "@/app/lib/articles"
import { RETAIL } from "@/app/lib/growth-config"

/**
 * The only inline markup articles use: **bold** and [label](href). Parsed here
 * rather than rendered as HTML, so article text can never inject markup.
 */
export function inline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g
  let last = 0
  let key = 0
  for (const m of text.matchAll(pattern)) {
    if (m.index! > last) out.push(text.slice(last, m.index))
    if (m[1]) out.push(<strong key={key++}>{m[1]}</strong>)
    else if (m[3].startsWith("/")) {
      out.push(
        <Link key={key++} href={m[3]}>
          {m[2]}
        </Link>,
      )
    } else {
      out.push(
        <a key={key++} href={m[3]} target="_blank" rel="noopener noreferrer">
          {m[2]}
        </a>,
      )
    }
    last = m.index! + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function ProductCard({ text, lang }: { text: string; lang: "zh" | "en" }) {
  return (
    <aside className="not-prose my-8 flex flex-col sm:flex-row gap-5 items-center rounded-2xl border border-amber-200 bg-amber-50/70 p-5 md:p-6">
      <Image
        src="/images/product-cutout.webp"
        alt={lang === "zh" ? "HerbalBath 没药喷雾" : "HerbalBath Myrrh Spray"}
        width={96}
        height={203}
        className="h-36 w-auto flex-none"
      />
      <div className="space-y-3 text-center sm:text-left">
        <p className="text-lg leading-relaxed text-stone-800">{inline(text)}</p>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <span className="text-xl font-bold text-stone-900">
            {RETAIL.currency}
            {RETAIL.singlePrice}
          </span>
          <Link
            href="/pay?b=bundle"
            className="inline-flex items-center rounded-full bg-emerald-700 px-5 py-2.5 text-base font-semibold text-white hover:bg-emerald-800"
          >
            {lang === "zh" ? "买3送1，立即购买" : "Buy 3 Get 1 Free"}
          </Link>
        </div>
      </div>
    </aside>
  )
}

export function ArticleBody({ blocks, lang }: { blocks: ArticleBlock[]; lang: "zh" | "en" }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{inline(b.text)}</p>
          case "h2":
            return <h2 key={i}>{b.text}</h2>
          case "h3":
            return <h3 key={i}>{b.text}</h3>
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((item, j) => (
                  <li key={j}>{inline(item)}</li>
                ))}
              </ul>
            )
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((item, j) => (
                  <li key={j}>{inline(item)}</li>
                ))}
              </ol>
            )
          case "tip":
            return (
              <aside key={i} className="not-prose my-8 rounded-2xl border-l-4 border-emerald-600 bg-emerald-50 p-5 md:p-6">
                <p className="mb-2 flex items-center gap-2 text-lg font-bold text-emerald-900">
                  <Lightbulb className="h-5 w-5" aria-hidden="true" />
                  {b.title || (lang === "zh" ? "小贴士" : "Tip")}
                </p>
                <p className="text-lg leading-relaxed text-stone-800">{inline(b.text)}</p>
              </aside>
            )
          case "product":
            return <ProductCard key={i} text={b.text} lang={lang} />
          case "table":
            return (
              <div key={i} className="not-prose my-8 overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full min-w-[520px] text-left text-base">
                  <thead className="bg-stone-100 text-stone-800">
                    <tr>
                      {b.head.map((h, j) => (
                        <th key={j} className="px-4 py-3 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, j) => (
                      <tr key={j} className="border-t border-stone-200">
                        {row.map((cell, k) => (
                          <td key={k} className={`px-4 py-3 ${k === 0 ? "font-medium text-stone-800" : "text-stone-700"}`}>
                            {inline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          default:
            return null
        }
      })}
    </>
  )
}
