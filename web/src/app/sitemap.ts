import type {MetadataRoute} from 'next'
import {stegaClean} from 'next-sanity'
import {siteOrigin} from '@/lib/seo'
import {client} from '@/sanity/client'

type SitemapEntry = {path?: string | null; updatedAt?: string | null}

/** Every published, indexable page. Pages marked "Hide from search engines" are left out. */
const SITEMAP_QUERY = `[
  ...*[_id == "homePage" && seo.noIndex != true]{"path": "/", "updatedAt": _updatedAt},
  ...*[_type == "page" && defined(slug.current) && seo.noIndex != true]{"path": "/" + slug.current, "updatedAt": _updatedAt},
  ...*[_type == "project" && defined(slug.current) && seo.noIndex != true]{"path": "/work/" + slug.current, "updatedAt": _updatedAt},
  ...*[_id == "contactPage" && seo.noIndex != true]{"path": "/contact", "updatedAt": _updatedAt},
  ...*[_type == "legalPage" && defined(slug.current) && seo.noIndex != true]{"path": "/legal/" + slug.current, "updatedAt": _updatedAt}
]`

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await client
    .withConfig({perspective: 'published', stega: false})
    .fetch<SitemapEntry[]>(SITEMAP_QUERY)
  const origin = siteOrigin()

  return entries
    .filter((entry) => entry.path)
    .map((entry) => {
      const path = stegaClean(entry.path!)
      return {
        url: path === '/' ? origin : `${origin}${path}`,
        lastModified: entry.updatedAt ? new Date(entry.updatedAt) : undefined,
      }
    })
}
