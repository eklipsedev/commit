'use client'

import {useCallback, useRef, useState} from 'react'
import {cn} from '@/lib/cn'
import {colorHex} from '@/lib/colors'
import {useOverlay} from '@/components/overlays/overlay-provider'
import {Container} from '@/components/ui/container'
import {FadeIn} from '@/components/ui/fade-in'
import {Heading} from '@/components/ui/heading'
import {Section} from '@/components/ui/section'
import {headingSizeFromBlock} from '@/lib/heading-styles'
import type {OfferingCard, PageBuilderBlock} from '@/sanity/types'

type CardsTextBlock = PageBuilderBlock & {
  heading?: string
  offerings?: OfferingCard[]
}

function OfferingCardItem({offering}: {offering: OfferingCard}) {
  const {openOffering} = useOverlay()
  const cardRef = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)
  const [cursor, setCursor] = useState({x: 0, y: 0})

  const bg = colorHex(offering.cardBackgroundColor, 'yellow')
  const text = colorHex(offering.cardHeadingColor, 'charcoal')
  const btnText = colorHex(offering.buttonTextColor, 'white')
  const label = offering.cardButtonLabel ?? 'Learn More'

  const updateCursor = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    setCursor({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }, [])

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => openOffering(offering)}
      onMouseEnter={(event) => {
        setHovered(true)
        updateCursor(event)
      }}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={updateCursor}
      className="relative flex h-full w-full flex-col rounded-none p-8 text-left md:p-10"
      style={{backgroundColor: bg, color: text}}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h3 className="font-display text-[3rem] font-normal leading-[1.2] tracking-normal">
          {offering.title}
        </h3>
        {offering.timeline && (
          <span className="font-mono text-[1.5rem] leading-[1.2]">{offering.timeline}</span>
        )}
      </div>

      {offering.cardDescription && (
        <p className="mt-4 text-base leading-relaxed md:text-lg">{offering.cardDescription}</p>
      )}

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
          backgroundColor: text,
          color: btnText,
        }}
      >
        {label}
      </span>
    </button>
  )
}

export function CardsTextSection({block}: {block: CardsTextBlock}) {
  const offerings = block.offerings ?? []

  return (
    <Section {...block}>
      <Container className="space-y-10">
        {block.heading && (
          <Heading
            size={headingSizeFromBlock(block)}
            style={{color: 'var(--section-heading)'}}
            collapseLineBreaksOnMobile={block.collapseLineBreaksOnMobile}
          >
            {block.heading}
          </Heading>
        )}
        <div className="grid gap-x-14 gap-y-10 sm:grid-cols-2">
          {offerings.map((offering, index) => (
            <FadeIn key={offering._id} delay={Math.min(index, 3) * 40} className="h-full w-full">
              <OfferingCardItem offering={offering} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  )
}
