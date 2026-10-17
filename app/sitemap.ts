import { MetadataRoute } from 'next'
import { allPosts } from './lib/all-posts'
import { painPointsData } from './lib/pain-points-data'

const BASE_URL = 'https://herbalbathsg.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const list = allPosts()
  // The blog index changes when a post is published, so it shares the newest post's date.
  const newestPost = list[0]?.date

  // No lastModified on pages without a real date: stamping every build as
  // "modified now" teaches Google to ignore lastmod for the whole site.
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/blog`, ...(newestPost ? { lastModified: newestPost } : {}), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/testimonials`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/partner`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/pain-points`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'yearly', priority: 0.5 },
  ]

  // Blog posts: hand-written and data articles alike.
  const blogPosts: MetadataRoute.Sitemap = list.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Pain points pages (dynamic content)
  const painPointPages: MetadataRoute.Sitemap = painPointsData.map((painPoint) => ({
    url: `${BASE_URL}/pain-points/${painPoint.slug}`,
    ...(painPoint.lastUpdated ? { lastModified: painPoint.lastUpdated } : {}),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // Ad-campaign landing pages (/landing/facebook, /landing/tiktok) are
  // intentionally excluded here and marked noindex in their own metadata —
  // they're near-duplicates of the homepage built for paid traffic, and
  // listing near-duplicate content in the sitemap only dilutes ranking
  // signals that should consolidate on the homepage.

  return [...staticPages, ...blogPosts, ...painPointPages]
}
