// JSON-LD for the whole site, in one place.
//
// Google's rules that shaped this file:
// - Markup must describe what the page visibly shows. Product markup belongs on
//   the page that sells the product (the homepage), not on every blog post.
// - An online shop isn't a LocalBusiness: that type is for a physical place,
//   and it invites checks against a real address and opening hours.
// - Structured data must not claim features the site doesn't have (the old
//   WebSite SearchAction pointed at a blog search that doesn't exist).
import { CONTACT, RETAIL, SOCIAL_PROFILES } from "./growth-config"

const BASE_URL = CONTACT.site

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "HerbalBath SG",
  alternateName: ["HerbalBath Singapore", "Herbal Bath SG", "Herbal Bath Singapore"],
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo.png`,
  image: `${BASE_URL}/images/product-hero.png`,
  description: "Singapore's trusted natural herbal pain relief brand since 2016.",
  foundingDate: "2016",
  slogan: "唤醒身体自愈力 - Awaken Your Body's Natural Healing Power",
  email: "hello@herbalbathsg.com",
  address: { "@type": "PostalAddress", addressCountry: "SG" },
  areaServed: { "@type": "Country", name: "Singapore" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: CONTACT.phone,
    contactType: "customer service",
    areaServed: "SG",
    availableLanguage: ["zh", "en"],
  },
  ...(SOCIAL_PROFILES.length ? { sameAs: [...SOCIAL_PROFILES] } : {}),
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "HerbalBath SG",
  alternateName: "HerbalBath Singapore",
  url: BASE_URL,
  inLanguage: ["zh-SG", "en-SG"],
  publisher: { "@id": `${BASE_URL}/#organization` },
}

export const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "HerbalBath Myrrh Spray 没药喷雾",
  description: "100% natural myrrh and frankincense spray for joint and muscle pain relief. Works in 10 seconds.",
  image: `${BASE_URL}/images/product-hero.png`,
  brand: { "@type": "Brand", name: "HerbalBath" },
  offers: {
    "@type": "Offer",
    url: `${BASE_URL}/pay`,
    price: String(RETAIL.singlePrice),
    priceCurrency: "SGD",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": `${BASE_URL}/#organization` },
  },
  // ⚠️ Decision for James (SEO.md, decision 1): Google requires a rating to
  // summarise reviews that visitors can read on this page. "15000" is the
  // customer count, not a count of published reviews, so this block can earn a
  // manual action for spammy structured data. Either set reviewCount to the
  // number of reviews actually shown, or delete aggregateRating.
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "15000",
    bestRating: "5",
    worstRating: "1",
  },
  // Mirrors the testimonial already published in the on-page copy
  // (see product_cta/benefits section) — structured data should describe
  // real, existing content, not invented quotes.
  review: {
    "@type": "Review",
    reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    author: { "@type": "Person", name: "陈女士 (Mdm. Tan)" },
    reviewBody:
      "用了三周，僵硬的肩膀松了很多，抬手很轻松。那种热感真的很神奇，比虎标万金油强太多了！ (After three weeks, my stiff shoulder loosened so much. The heat sensation is amazing - much stronger than Tiger Balm!)",
  },
}

/** Renders one or more JSON-LD objects. `<` is escaped so text can't close the script tag. */
export function jsonLd(data: object): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") }
}
