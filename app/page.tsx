import { HomePageContent } from "./home-content"
import { ProductDetails } from "@/components/product-details"
import { jsonLd, productSchema } from "@/app/lib/structured-data"

// The homepage. The interactive parts (language switch, package picker,
// WhatsApp links) are a client component; the long product-detail column is
// rendered here on the server, once per language, and handed to it.
export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productSchema)} />
      <HomePageContent details={{ zh: <ProductDetails lang="zh" />, en: <ProductDetails lang="en" /> }} />
    </>
  )
}
