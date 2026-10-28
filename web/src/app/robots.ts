import type {MetadataRoute} from 'next'
import {isIndexableDeployment, siteOrigin} from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must never be crawled, or they compete with the live site.
  if (!isIndexableDeployment()) {
    return {rules: {userAgent: '*', disallow: '/'}}
  }

  return {
    rules: {userAgent: '*', allow: '/', disallow: '/api/'},
    sitemap: `${siteOrigin()}/sitemap.xml`,
  }
}
