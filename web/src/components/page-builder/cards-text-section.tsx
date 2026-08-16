'use client'

import {colorHex} from '@/lib/colors'
import {useOverlay} from '@/components/overlays/overlay-provider'
import {Container} from '@/components/ui/container'
import {FadeIn, FADE_IN_STAGGER_MS} from '@/components/ui/fade-in'
import {Heading} from '@/components/ui/heading'
import {CmsButton} from '@/components/ui/cms-button'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import {headingFontFromBlock, headingSizeFromBlock} from '@/lib/heading-styles'
import type {ButtonValue, OfferingCard, PageBuilderBlock} from '@/sanity/types'

type CardsTextBlock = PageBuilderBlock & {
  tagline?: string
  heading?: string
  cardsSource?: 'salesPages' | 'manual' | 'offerings'
  cards?: PageCard[]
  salesPages?: SalesPageCard[]
  offerings?: OfferingCard[]
}

type PageCard = {
  _key?: string
  title?: string
  body?: string
  button?: ButtonValue
  backgroundColor?: string
  headingColor?: string
  bodyColor?: string
}

type SalesPageCard = {
  _id: string
  title?: string
  slug?: {current?: string}
  cardTitle?: string
  cardBody?: string
  cardButtonLabel?: string
  cardBackgroundColor?: string
  cardHeadingColor?: string
  cardBodyColor?: string
  buttonTextColor?: string
  buttonHoverBackgroundColor?: string
  buttonHoverTextColor?: string
}

function CardFrame({
  title,
  body,
  button,
  backgroundColor,
  headingColor,
  bodyColor,
  onClick,
}: {
  title?: string
  body?: string
  button?: ButtonValue
  backgroundColor?: string
  headingColor?: string
  bodyColor?: string
  onClick?: () => void
}) {
  const background = colorHex(backgroundColor, 'yellow')
  const heading = colorHex(headingColor, 'charcoal')
  const copy = colorHex(bodyColor ?? headingColor, 'charcoal')

  return (
    <article
      className="flex h-full min-h-[17rem] w-full flex-col rounded-none p-6 sm:p-8 md:min-h-[20rem] md:p-10"
      style={{backgroundColor: background}}
    >
      {title && (
        <h3
          className="max-w-[14ch] whitespace-pre-line font-sans text-[2rem] leading-[1.05] tracking-[-0.02em] md:text-[2.5rem]"
          style={{color: heading}}
        >
          {title}
        </h3>
      )}
      {body && (
        <p
          className="mt-5 whitespace-pre-line text-balance text-base leading-relaxed"
          style={{color: copy}}
        >
          {body}
        </p>
      )}
      {button && (
        <div className="mt-auto self-start pt-8">
          <CmsButton button={button} onClick={onClick} />
        </div>
      )}
    </article>
  )
}

function salesPageToCard(page: SalesPageCard): PageCard {
  return {
    _key: page._id,
    title: page.cardTitle || page.title,
    body: page.cardBody,
    backgroundColor: page.cardBackgroundColor,
    headingColor: page.cardHeadingColor,
    bodyColor: page.cardBodyColor,
    button: {
      label: page.cardButtonLabel ?? 'Learn More',
      textColor: page.buttonTextColor ?? page.cardHeadingColor ?? 'charcoal',
      hoverBackgroundColor: page.buttonHoverBackgroundColor ?? 'deep-blue',
      hoverTextColor: page.buttonHoverTextColor,
      link: {
        linkType: 'internal',
        internalLink: {
          _type: 'page',
          _id: page._id,
          slug: page.slug,
        },
      },
    },
  }
}

function OfferingCardItem({offering}: {offering: OfferingCard}) {
  const {openOffering} = useOverlay()

  return (
    <CardFrame
      title={offering.title}
      body={offering.cardDescription}
      backgroundColor={offering.cardBackgroundColor}
      headingColor={offering.cardHeadingColor}
      bodyColor={offering.cardBodyColor}
      button={{
        label: offering.cardButtonLabel ?? 'Learn More',
        textColor: offering.buttonTextColor ?? offering.cardHeadingColor,
        hoverBackgroundColor: offering.buttonBackgroundColor ?? offering.cardHeadingColor,
        hoverTextColor: offering.buttonTextColor,
      }}
      onClick={() => openOffering(offering)}
    />
  )
}

function resolveCards(block: CardsTextBlock): {
  pageCards: PageCard[]
  offerings: OfferingCard[]
} {
  const source = block.cardsSource
    ?? (block.cards?.length ? 'manual' : block.offerings?.length ? 'offerings' : 'salesPages')

  if (source === 'salesPages') {
    return {
      pageCards: (block.salesPages ?? []).map(salesPageToCard),
      offerings: [],
    }
  }
  if (source === 'manual') {
    return {pageCards: block.cards ?? [], offerings: []}
  }
  return {pageCards: [], offerings: block.offerings ?? []}
}

export function CardsTextSection({block}: {block: CardsTextBlock}) {
  const {pageCards, offerings} = resolveCards(block)

  return (
    <Section {...block}>
      <Container className="space-y-10 md:space-y-14">
        {(block.tagline || block.heading) && (
          <FadeIn className="space-y-8">
            {block.tagline && (
              <Tagline showRule={block.showTaglineRule !== false}>{block.tagline}</Tagline>
            )}
            {block.heading && (
              <Heading
                size={headingSizeFromBlock(block)}
                font={headingFontFromBlock(block)}
                style={{color: 'var(--section-heading)'}}
                collapseLineBreaksOnMobile={block.collapseLineBreaksOnMobile}
              >
                {block.heading}
              </Heading>
            )}
          </FadeIn>
        )}
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
          {pageCards.length > 0
            ? pageCards.map((card, index) => (
                <FadeIn
                  key={card._key ?? card.title}
                  delay={Math.min(index, 3) * FADE_IN_STAGGER_MS}
                  className="h-full w-full"
                >
                  <CardFrame {...card} />
                </FadeIn>
              ))
            : offerings.map((offering, index) => (
                <FadeIn
                  key={offering._id}
                  delay={Math.min(index, 3) * FADE_IN_STAGGER_MS}
                  className="h-full w-full"
                >
                  <OfferingCardItem offering={offering} />
                </FadeIn>
              ))}
        </div>
      </Container>
    </Section>
  )
}
