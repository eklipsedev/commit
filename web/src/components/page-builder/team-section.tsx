'use client'

import {useCallback, useRef, useState} from 'react'
import {cn} from '@/lib/cn'
import {colorHex} from '@/lib/colors'
import {useOverlay} from '@/components/overlays/overlay-provider'
import {Container} from '@/components/ui/container'
import {FadeIn, FadeInStack, FADE_IN_STAGGER_MS} from '@/components/ui/fade-in'
import {Heading} from '@/components/ui/heading'
import {SanityImage} from '@/components/ui/sanity-image'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import {headingFontFromBlock, headingSizeFromBlock} from '@/lib/heading-styles'
import type {PageBuilderBlock, PersonCard} from '@/sanity/types'

type TeamBlock = PageBuilderBlock & {
  tagline?: string
  headline?: string
  body?: string
  /** @deprecated Prefer ordering in `people` (first two = large cards). */
  featuredPeople?: PersonCard[]
  people?: PersonCard[]
}

type CardSize = 'featured' | 'member'

function resolveTeamRows(block: TeamBlock) {
  const people = (block.people ?? []).filter(Boolean)
  const legacyFeatured = (block.featuredPeople ?? []).filter(Boolean)

  // Prefer a single ordered list; merge legacy featuredPeople if still present.
  const ordered =
    legacyFeatured.length > 0
      ? [
          ...legacyFeatured,
          ...people.filter((p) => !legacyFeatured.some((f) => f._id === p._id)),
        ]
      : people

  return {
    featured: ordered.slice(0, 2),
    members: ordered.slice(2),
  }
}

function PersonCardItem({
  person,
  size,
}: {
  person: PersonCard
  size: CardSize
}) {
  const {openPerson} = useOverlay()
  const cardRef = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)
  const [cursor, setCursor] = useState({x: 0, y: 0})

  const primaryBg = colorHex(person.cardBackgroundColor, 'sage')
  const secondaryBg = colorHex(person.cardHoverBackgroundColor, 'deep-blue')
  const btnBg = colorHex(person.buttonBackgroundColor, 'yellow')
  const btnText = colorHex(person.buttonTextColor, 'deep-blue')

  const updateCursor = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    setCursor({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }, [])

  const featured = size === 'featured'

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => openPerson(person)}
      onMouseEnter={(event) => {
        setHovered(true)
        updateCursor(event)
      }}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={updateCursor}
      className="group relative flex w-full min-w-0 flex-col text-left"
    >
      {/* Featured = project-card ratio; members = square. Photo flush to bottom. */}
      <div
        className={cn(
          'relative w-full overflow-hidden transition-colors duration-300',
          featured ? 'aspect-[636/358]' : 'aspect-square',
        )}
        style={{backgroundColor: hovered ? secondaryBg : primaryBg}}
      >
        {person.photo && (
          <SanityImage
            key={person.photo.asset?._ref ?? person._id}
            image={person.photo}
            alt={person.photo.alt ?? person.name}
            fill
            sizes={
              featured
                ? '(max-width: 768px) 100vw, 50vw'
                : '(max-width: 768px) 50vw, 20vw'
            }
            className="object-contain object-bottom"
          />
        )}
      </div>

      <div className={cn('min-w-0 space-y-1', featured ? 'mt-4' : 'mt-3')}>
        <p
          className={cn(
            'font-medium leading-[1.2] text-brand-charcoal',
            featured ? 'text-[2rem]' : 'text-xl md:text-[1.5rem]',
          )}
        >
          {person.name}
        </p>
        {person.role && (
          <p
            className={cn(
              'font-mono leading-snug text-brand-charcoal',
              featured ? 'text-sm' : 'text-xs',
            )}
          >
            {person.role}
          </p>
        )}
      </div>

      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute z-10 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-opacity duration-200',
          hovered ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          left: cursor.x,
          top: cursor.y,
          transform: 'translate(0.5rem, calc(-100% - 0.5rem))',
          backgroundColor: btnBg,
          color: btnText,
        }}
      >
        Learn More
      </span>
    </button>
  )
}

export function TeamSection({block}: {block: TeamBlock}) {
  const {featured, members} = resolveTeamRows(block)

  return (
    <Section {...block}>
      <Container className="space-y-10 md:space-y-14">
        {(block.tagline || block.headline || block.body) && (
          <FadeInStack className="space-y-6 md:space-y-8">
            {block.tagline ? (
              <Tagline showRule={block.showTaglineRule !== false}>{block.tagline}</Tagline>
            ) : null}
            {block.headline ? (
              <Heading
                size={headingSizeFromBlock(block)}
                font={headingFontFromBlock(block)}
                style={{color: 'var(--section-heading)'}}
                collapseLineBreaksOnMobile={block.collapseLineBreaksOnMobile}
              >
                {block.headline}
              </Heading>
            ) : null}
            {block.body ? (
              <p
                className="max-w-3xl whitespace-pre-line text-base leading-relaxed"
                style={{color: 'var(--section-body)'}}
              >
                {block.body}
              </p>
            ) : null}
          </FadeInStack>
        )}

        <div className="space-y-10 md:space-y-14">
          {featured.length > 0 && (
            <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6 md:gap-y-10">
              {featured.map((person, index) => (
                <FadeIn
                  key={person._id}
                  className="relative min-w-0 w-full hover:z-20"
                  delay={Math.min(index, 1) * FADE_IN_STAGGER_MS}
                >
                  <PersonCardItem person={person} size="featured" />
                </FadeIn>
              ))}
            </div>
          )}

          {members.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-5 md:gap-y-10 lg:grid-cols-5">
              {members.map((person, index) => (
                <FadeIn
                  key={person._id}
                  className="relative min-w-0 w-full hover:z-20"
                  delay={Math.min(index, 4) * FADE_IN_STAGGER_MS}
                >
                  <PersonCardItem person={person} size="member" />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}
