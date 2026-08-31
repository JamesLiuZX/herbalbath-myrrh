import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://herbalbathsg.com'
  
  return {
    rules: [
      // One group for every crawler. A named group (e.g. Googlebot) would
      // OVERRIDE this one entirely for that bot — a bare "Googlebot: allow /"
      // group previously let Google crawl /api/ and /internal/ because
      // robots.txt groups don't inherit from *.
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/', '/internal/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
