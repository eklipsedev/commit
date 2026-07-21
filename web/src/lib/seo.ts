import type {Metadata} from 'next'
import type {PortableTextBlock} from '@portabletext/types'
import {stegaClean} from 'next-sanity'
import {urlFor} from '@/sanity/image'
import type {SanityImage} from '@/sanity/types'

export type PageSeo = {
  title?: string | null
  description?: string | null
  image?: SanityImage | null
  noIndex?: boolean | null
}

export type DefaultSeo = {
  siteName?: string | null
  title?: string | null
  description?: string | null
  image?: SanityImage | null
}

function clean(value?: string | null) {
  if (!value) return ''
  return stegaClean(value).trim()
}

/** Flatten rich headline / portable text blocks to plain text for titles. */
export function richTextToPlain(blocks?: PortableTextBlock[] | null) {
  if (!blocks?.length) return ''
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !('children' in block) || !Array.isArray(block.children)) {
        return ''
      }
      return block.children
        .map((child) => ('text' in child && typeof child.text === 'string' ? child.text : ''))
        .join('')
    })
    .filter(Boolean)
    .join(' ')
    .trim()
}

function ogImageUrl(image?: SanityImage | null) {
  if (!image?.asset) return undefined
  try {
    return urlFor(image).width(1200).height(630).fit('crop').auto('format').url()
  } catch {
    return undefined
  }
}

function siteOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (fromEnv) return fromEnv
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

function withSiteName(title: string, siteName: string) {
  if (!siteName) return title
  if (!title) return siteName
  if (title === siteName) return title
  if (title.endsWith(`| ${siteName}`) || title.endsWith(`— ${siteName}`)) return title
  return `${title} | ${siteName}`
}

/**
 * Merge page SEO overrides with site defaults and content fallbacks into Next.js Metadata.
 */
export function resolveSeoMetadata({
  pageSeo,
  defaults,
  fallbackTitle,
  fallbackDescription,
  path = '/',
}: {
  pageSeo?: PageSeo | null
  defaults?: DefaultSeo | null
  fallbackTitle?: string | null
  fallbackDescription?: string | null
  path?: string
}): Metadata {
  const siteName = clean(defaults?.siteName) || 'Commit'
  const rawTitle =
    clean(pageSeo?.title) ||
    clean(fallbackTitle) ||
    clean(defaults?.title) ||
    siteName
  const title = withSiteName(rawTitle, siteName)

  const description =
    clean(pageSeo?.description) ||
    clean(fallbackDescription) ||
    clean(defaults?.description) ||
    undefined

  const imageUrl = ogImageUrl(pageSeo?.image) || ogImageUrl(defaults?.image)
  const canonicalPath = path.startsWith('/') ? path : `/${path}`
  const url = `${siteOrigin()}${canonicalPath === '/' ? '' : canonicalPath}`

  return {
    title,
    description,
    metadataBase: new URL(siteOrigin()),
    alternates: {
      canonical: canonicalPath,
    },
    robots: pageSeo?.noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph: {
      type: 'website',
      siteName,
      title,
      description,
      url,
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(imageUrl ? {images: [imageUrl]} : {}),
    },
  }
}
