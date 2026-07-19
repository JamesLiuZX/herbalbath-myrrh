import { MetadataRoute } from 'next'
import { posts } from './lib/blog-data'
import { painPointsData } from './lib/pain-points-data'

const BASE_URL = 'https://herbalbathsg.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString()
  
  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/testimonials`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/partner`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/pain-points`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Blog posts
  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Pain points pages (dynamic content)
  const painPointPages: MetadataRoute.Sitemap = painPointsData.map((painPoint) => ({
    url: `${BASE_URL}/pain-points/${painPoint.slug}`,
    lastModified: painPoint.lastUpdated || currentDate,
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
