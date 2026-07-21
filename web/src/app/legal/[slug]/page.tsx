import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import {BodyPortableText} from '@/components/portable-text/body-portable-text'
import {Container} from '@/components/ui/container'
import {PageHeroIntro} from '@/components/ui/page-hero-intro'
import {RichHeadline} from '@/components/ui/rich-headline'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import {SetFooterAppearance} from '@/components/layout/set-footer-appearance'
import {resolveSeoMetadata, richTextToPlain, type DefaultSeo, type PageSeo} from '@/lib/seo'
import {sanityFetch} from '@/sanity/live'
import {DEFAULT_SEO_QUERY, LEGAL_PAGE_BY_SLUG_QUERY} from '@/sanity/queries'
import type {FooterAppearance, RichHeadline as RichHeadlineType} from '@/sanity/types'
import type {PortableTextBlock} from '@portabletext/types'

type PageProps = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params
  const [{data}, {data: defaults}] = await Promise.all([
    sanityFetch({query: LEGAL_PAGE_BY_SLUG_QUERY, params: {slug}, stega: false}),
    sanityFetch({query: DEFAULT_SEO_QUERY, stega: false}),
  ])

  const page = data as {
    seo?: PageSeo
    heading?: RichHeadlineType
    description?: string
  } | null
  if (!page) return {}

  return resolveSeoMetadata({
    pageSeo: page.seo,
    defaults: defaults as DefaultSeo | null,
    fallbackTitle: richTextToPlain(page.heading),
    fallbackDescription: page.description,
    path: `/legal/${slug}`,
  })
}

export default async function LegalPage({params}: PageProps) {
  const {slug} = await params
  const {data} = await sanityFetch({
    query: LEGAL_PAGE_BY_SLUG_QUERY,
    params: {slug},
  })

  if (!data) notFound()

  const page = data as {
    heading?: RichHeadlineType
    collapseLineBreaksOnMobile?: boolean
    description?: string
    body?: PortableTextBlock[]
    _updatedAt?: string
    footerAppearance?: FooterAppearance
    seo?: PageSeo
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
      <Section>
        <Container className="space-y-10 md:space-y-14">
          <PageHeroIntro
            headline={
              <RichHeadline
                value={page.heading}
                size="hero"
                collapseLineBreaksOnMobile={page.collapseLineBreaksOnMobile}
              />
            }
            fullWidthTagline={
              updated ? <Tagline>Last updated {updated}</Tagline> : undefined
            }
          />
          {page.description && (
            <p
              className="max-w-xl text-base leading-relaxed md:text-lg"
              style={{color: 'var(--section-body)'}}
            >
              {page.description}
            </p>
          )}
          <BodyPortableText value={page.body} />
        </Container>
      </Section>
    </>
  )
}
