'use client'

import {useCallback, useRef, useState} from 'react'
import {cn} from '@/lib/cn'
import {colorHex} from '@/lib/colors'
import {useOverlay} from '@/components/overlays/overlay-provider'
import {Container} from '@/components/ui/container'
import {Heading} from '@/components/ui/heading'
import {SanityImage} from '@/components/ui/sanity-image'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import {headingSizeFromBlock} from '@/lib/heading-styles'
import type {PageBuilderBlock, PersonCard} from '@/sanity/types'

type TeamBlock = PageBuilderBlock & {
  tagline?: string
  headline?: string
  people?: PersonCard[]
  columns?: number
  photoStyle?: 'round' | 'anchored'
}

function PersonCardItem({
  person,
  photoStyle,
}: {
  person: PersonCard
  photoStyle: 'round' | 'anchored'
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

  const morphToCircle = photoStyle === 'round' || hovered

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
      className="group relative flex flex-col text-left"
    >
      {/* Colored headshot area only */}
      <div className="relative aspect-square overflow-hidden" style={{backgroundColor: secondaryBg}}>
        {/* Primary layer: square → circle on hover */}
        <div
          className="absolute inset-0 overflow-hidden transition-[border-radius] duration-300 ease-in-out"
          style={{
            backgroundColor: primaryBg,
            borderRadius: morphToCircle ? '50%' : '0%',
          }}
        >
          {person.photo && (
            <div
              className={cn(
                'absolute inset-x-0 bottom-0 overflow-hidden',
                photoStyle === 'anchored' ? 'h-[90%]' : 'inset-0 h-full',
              )}
            >
              <SanityImage
                image={person.photo}
                alt={person.photo.alt ?? person.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className={cn(
                  'object-cover',
                  photoStyle === 'anchored' ? 'object-bottom' : 'object-center',
                )}
              />
            </div>
          )}
        </div>
      </div>

      {/* Name / role sit outside the colored headshot */}
      <div className="mt-4 space-y-1">
        <p className="text-lg font-medium leading-snug text-brand-charcoal md:text-xl">
          {person.name}
        </p>
        {person.role && (
          <p className="font-mono text-sm leading-snug text-brand-charcoal">{person.role}</p>
        )}
      </div>

      {/* Magnetic Learn More — tracks cursor across the whole card */}
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
  const columns = block.columns ?? 3
  const photoStyle = block.photoStyle ?? 'anchored'

  return (
    <Section {...block}>
      <Container className="space-y-10">
        {(block.tagline || block.headline) && (
          <div className="space-y-6">
            {block.tagline && <Tagline>{block.tagline}</Tagline>}
            {block.headline && (
              <Heading
                size={headingSizeFromBlock(block)}
                style={{color: 'var(--section-heading)'}}
                collapseLineBreaksOnMobile={block.collapseLineBreaksOnMobile}
              >
                {block.headline}
              </Heading>
            )}
          </div>
        )}
        <div
          className={cn(
            'grid gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10',
            columns === 2 && 'sm:grid-cols-2',
            columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
            columns === 4 && 'sm:grid-cols-2 lg:grid-cols-4',
          )}
        >
          {block.people?.map((person) => (
            <PersonCardItem key={person._id} person={person} photoStyle={photoStyle} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
