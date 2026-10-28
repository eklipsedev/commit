import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import {PageBuilder} from '@/components/page-builder/page-builder'
import {SetFooterAppearance} from '@/components/layout/set-footer-appearance'
import {resolvePageBuilderCtas, type CtaContent} from '@/lib/resolve-cta'
import {resolveSeoMetadata, siteOrigin, type DefaultSeo, type PageSeo} from '@/lib/seo'
import {sanityFetch} from '@/sanity/live'
import {
  DEFAULT_CTA_QUERY,
  DEFAULT_SEO_QUERY,
  FOOTER_QUERY,
  HOME_PAGE_QUERY,
} from '@/sanity/queries'
import type {FooterAppearance, FooterData, PageBuilderBlock} from '@/sanity/types'

export async function generateMetadata(): Promise<Metadata> {
  const [{data}, {data: defaults}] = await Promise.all([
    sanityFetch({query: HOME_PAGE_QUERY, stega: false}),
    sanityFetch({query: DEFAULT_SEO_QUERY, stega: false}),
  ])

  const page = data as {seo?: PageSeo} | null

  return resolveSeoMetadata({
    pageSeo: page?.seo,
    defaults: defaults as DefaultSeo | null,
    // Home uses the site Default SEO title rather than the internal "Home" label.
    fallbackTitle: null,
    path: '/',
  })
}

export default async function HomePage() {
  const [{data}, {data: defaultCtaDoc}, {data: defaults}, {data: footer}] = await Promise.all([
    sanityFetch({query: HOME_PAGE_QUERY}),
    sanityFetch({query: DEFAULT_CTA_QUERY}),
    sanityFetch({query: DEFAULT_SEO_QUERY, stega: false}),
    sanityFetch({query: FOOTER_QUERY, stega: false}),
  ])

  if (!data) notFound()

  const page = data as {
    pageBuilder?: PageBuilderBlock[]
    footerAppearance?: FooterAppearance
    seo?: PageSeo
  }
  const defaultCta = (defaultCtaDoc as {cta?: CtaContent} | null)?.cta

  // Organization details for search results; social profiles come from the footer links.
  const seoDefaults = defaults as DefaultSeo | null
  const origin = siteOrigin()
  const socialLinks = (footer as FooterData | null)?.linkColumns
    ?.flatMap((column) => column.links ?? [])
    .map((link) => (link.linkType === 'external' ? link.href : null))
    .filter((href): href is string => Boolean(href?.startsWith('http')))
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seoDefaults?.siteName || 'Commit',
    url: origin,
    logo: `${origin}/icon.svg`,
    ...(seoDefaults?.description ? {description: seoDefaults.description} : {}),
    ...(socialLinks?.length ? {sameAs: [...new Set(socialLinks)]} : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')}}
      />
      <SetFooterAppearance appearance={page.footerAppearance} />
      <PageBuilder blocks={resolvePageBuilderCtas(page.pageBuilder, defaultCta)} />
    </>
  )
}
