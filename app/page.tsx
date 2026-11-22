import { HomePageContent } from "./home-content"
import { ProductDetails } from "@/components/product-details"
import { resolvePromotions } from "@/app/lib/promotions"
import { PROMOTIONS } from "@/app/lib/promotions-data"
import { buildProductSchema, jsonLd } from "@/app/lib/structured-data"

// Prices and the running campaign come from content/promotions.json. The page
// is prerendered, so it is re-rendered at most every ten minutes to pick up a
// campaign that starts or ends at midnight; the client corrects the last gap.
export const revalidate = 600

// The homepage. The interactive parts (language switch, package picker,
// WhatsApp links) are a client component; the long product-detail column is
// rendered here on the server, once per language, and handed to it.
export default function HomePage() {
  const promo = resolvePromotions(PROMOTIONS, Date.now())
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(buildProductSchema(promo))} />
      <HomePageContent initialPromo={promo} details={{ zh: <ProductDetails lang="zh" />, en: <ProductDetails lang="en" /> }} />
    </>
  )
}
