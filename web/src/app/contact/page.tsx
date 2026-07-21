import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import Link from 'next/link'
import {Container} from '@/components/ui/container'
import {RichHeadline} from '@/components/ui/rich-headline'
import {Tagline} from '@/components/ui/tagline'
import {SetFooterAppearance} from '@/components/layout/set-footer-appearance'
import {resolveLinkHref} from '@/lib/links'
import {resolveSeoMetadata, richTextToPlain, type DefaultSeo, type PageSeo} from '@/lib/seo'
import {sanityFetch} from '@/sanity/live'
import {CONTACT_PAGE_QUERY, DEFAULT_SEO_QUERY} from '@/sanity/queries'
import type {FooterAppearance, RichHeadline as RichHeadlineType} from '@/sanity/types'

export async function generateMetadata(): Promise<Metadata> {
  const [{data}, {data: defaults}] = await Promise.all([
    sanityFetch({query: CONTACT_PAGE_QUERY, stega: false}),
    sanityFetch({query: DEFAULT_SEO_QUERY, stega: false}),
  ])

  const page = data as {seo?: PageSeo; heading?: RichHeadlineType} | null

  return resolveSeoMetadata({
    pageSeo: page?.seo,
    defaults: defaults as DefaultSeo | null,
    fallbackTitle: richTextToPlain(page?.heading) || 'Contact',
    path: '/contact',
  })
}

export default async function ContactPage() {
  const {data} = await sanityFetch({query: CONTACT_PAGE_QUERY})
  if (!data) notFound()

  const page = data as {
    heading?: RichHeadlineType
    tagline?: string
    attributes?: {
      _key?: string
      label?: string
      value?: string
      link?: import('@/lib/links').LinkValue
    }[]
    footerAppearance?: FooterAppearance
    seo?: PageSeo
  }

  return (
    <>
      <SetFooterAppearance appearance={page.footerAppearance} />
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:gap-x-14 md:gap-y-0">
            <RichHeadline
              value={page.heading}
              size="hero"
              className="min-w-0 self-start"
            />

            <div className="space-y-8 self-start">
              {page.tagline && <Tagline>{page.tagline}</Tagline>}

              {page.attributes?.length ? (
                <ul className="space-y-3 text-base leading-snug text-brand-charcoal md:space-y-4 md:text-lg">
                  {page.attributes.map((attr) => {
                    const href = resolveLinkHref(attr.link)
                    const content = attr.value
                    if (!content) return null

                    return (
                      <li key={attr._key ?? attr.value}>
                        {href ? (
                          <Link
                            href={href}
                            className="underline-offset-4 hover:underline"
                          >
                            {content}
                          </Link>
                        ) : (
                          content
                        )}
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
