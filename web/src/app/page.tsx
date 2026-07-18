import {notFound} from 'next/navigation'
import {PageBuilder} from '@/components/page-builder/page-builder'
import {SetFooterAppearance} from '@/components/layout/set-footer-appearance'
import {resolvePageBuilderCtas, type CtaContent} from '@/lib/resolve-cta'
import {sanityFetch} from '@/sanity/live'
import {DEFAULT_CTA_QUERY, HOME_PAGE_QUERY} from '@/sanity/queries'
import type {FooterAppearance, PageBuilderBlock} from '@/sanity/types'

export default async function HomePage() {
  const [{data}, {data: defaultCtaDoc}] = await Promise.all([
    sanityFetch({query: HOME_PAGE_QUERY}),
    sanityFetch({query: DEFAULT_CTA_QUERY}),
  ])

  if (!data) notFound()

  const page = data as {
    pageBuilder?: PageBuilderBlock[]
    footerAppearance?: FooterAppearance
    seo?: {title?: string; description?: string}
  }
  const defaultCta = (defaultCtaDoc as {cta?: CtaContent} | null)?.cta

  return (
    <>
      <SetFooterAppearance appearance={page.footerAppearance} />
      <PageBuilder blocks={resolvePageBuilderCtas(page.pageBuilder, defaultCta)} />
    </>
  )
}
