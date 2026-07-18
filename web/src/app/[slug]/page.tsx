import {notFound} from 'next/navigation'
import {PageBuilder} from '@/components/page-builder/page-builder'
import {SetFooterAppearance} from '@/components/layout/set-footer-appearance'
import {resolvePageBuilderCtas, type CtaContent} from '@/lib/resolve-cta'
import {sanityFetch} from '@/sanity/live'
import {DEFAULT_CTA_QUERY, PAGE_BY_SLUG_QUERY} from '@/sanity/queries'
import type {FooterAppearance, PageBuilderBlock} from '@/sanity/types'

type PageProps = {
  params: Promise<{slug: string}>
}

export default async function CmsPage({params}: PageProps) {
  const {slug} = await params
  const [{data}, {data: defaultCtaDoc}] = await Promise.all([
    sanityFetch({
      query: PAGE_BY_SLUG_QUERY,
      params: {slug},
    }),
    sanityFetch({query: DEFAULT_CTA_QUERY}),
  ])

  if (!data) notFound()

  const page = data as {
    pageBuilder?: PageBuilderBlock[]
    footerAppearance?: FooterAppearance
  }
  const defaultCta = (defaultCtaDoc as {cta?: CtaContent} | null)?.cta

  return (
    <>
      <SetFooterAppearance appearance={page.footerAppearance} />
      <PageBuilder blocks={resolvePageBuilderCtas(page.pageBuilder, defaultCta)} />
    </>
  )
}
