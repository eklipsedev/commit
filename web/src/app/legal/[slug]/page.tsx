import {notFound} from 'next/navigation'
import {BodyPortableText} from '@/components/portable-text/body-portable-text'
import {Container} from '@/components/ui/container'
import {SetFooterAppearance} from '@/components/layout/set-footer-appearance'
import {sanityFetch} from '@/sanity/live'
import {LEGAL_PAGE_BY_SLUG_QUERY} from '@/sanity/queries'
import type {FooterAppearance} from '@/sanity/types'
import type {PortableTextBlock} from '@portabletext/types'

type PageProps = {
  params: Promise<{slug: string}>
}

export default async function LegalPage({params}: PageProps) {
  const {slug} = await params
  const {data} = await sanityFetch({
    query: LEGAL_PAGE_BY_SLUG_QUERY,
    params: {slug},
  })

  if (!data) notFound()

  const page = data as {
    heading?: string
    description?: string
    body?: PortableTextBlock[]
    _updatedAt?: string
    footerAppearance?: FooterAppearance
  }

  const updated = page._updatedAt
    ? new Date(page._updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <>
      <SetFooterAppearance appearance={page.footerAppearance} />
      <section className="py-16 md:py-24">
        <Container className="max-w-3xl space-y-8">
          <header className="space-y-4 border-b border-neutral-200 pb-8">
            <h1 className="font-display text-4xl tracking-tight md:text-5xl">{page.heading}</h1>
            {page.description && <p className="text-lg text-brand-charcoal">{page.description}</p>}
            {updated && (
              <p className="font-mono text-xs tracking-normal text-brand-charcoal">
                Last updated {updated}
              </p>
            )}
          </header>
          <BodyPortableText value={page.body} />
        </Container>
      </section>
    </>
  )
}
