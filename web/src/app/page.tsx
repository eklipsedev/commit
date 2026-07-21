import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import {PageBuilder} from '@/components/page-builder/page-builder'
import {SetFooterAppearance} from '@/components/layout/set-footer-appearance'
import {resolvePageBuilderCtas, type CtaContent} from '@/lib/resolve-cta'
import {resolveSeoMetadata, type DefaultSeo, type PageSeo} from '@/lib/seo'
import {sanityFetch} from '@/sanity/live'
import {DEFAULT_CTA_QUERY, DEFAULT_SEO_QUERY, HOME_PAGE_QUERY} from '@/sanity/queries'
import type {FooterAppearance, PageBuilderBlock} from '@/sanity/types'

export async function generateMetadata(): Promise<Metadata> {
  const [{data}, {data: defaults}] = await Promise.all([
    sanityFetch({query: HOME_PAGE_QUERY, stega: false}),
    sanityFetch({query: DEFAULT_SEO_QUERY, stega: false}),
  ])

  const page = data as {seo?: PageSeo; title?: string} | null

  return resolveSeoMetadata({
    pageSeo: page?.seo,
    defaults: defaults as DefaultSeo | null,
    fallbackTitle: page?.title || 'Home',
    path: '/',
  })
}

export default async function HomePage() {
  const [{data}, {data: defaultCtaDoc}] = await Promise.all([
    sanityFetch({query: HOME_PAGE_QUERY}),
    sanityFetch({query: DEFAULT_CTA_QUERY}),
  ])

  if (!data) notFound()

  const page = data as {
    pageBuilder?: PageBuilderBlock[]
    footerAppearance?: FooterAppearance
    seo?: PageSeo
  }
  const defaultCta = (defaultCtaDoc as {cta?: CtaContent} | null)?.cta

  return (
    <>
      <SetFooterAppearance appearance={page.footerAppearance} />
      <PageBuilder blocks={resolvePageBuilderCtas(page.pageBuilder, defaultCta)} />
    </>
  )
}
