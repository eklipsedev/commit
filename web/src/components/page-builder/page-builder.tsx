'use client'

import {CardsTextSection} from '@/components/page-builder/cards-text-section'
import {CtaSection} from '@/components/page-builder/cta-section'
import {CustomSection} from '@/components/page-builder/custom-section'
import {GridMixedSection} from '@/components/page-builder/grid-mixed-section'
import {GridTextSection} from '@/components/page-builder/grid-text-section'
import {HeroSection} from '@/components/page-builder/hero-section'
import {ListTextSection} from '@/components/page-builder/list-text-section'
import {LogosSection} from '@/components/page-builder/logos-section'
import {SliderTestimonialsSection} from '@/components/page-builder/slider-testimonials-section'
import {TeamSection} from '@/components/page-builder/team-section'
import {TextColumnsSection} from '@/components/page-builder/text-columns-section'
import {TwoColCardsSection} from '@/components/page-builder/two-col-cards-section'
import {TwoColImageSection} from '@/components/page-builder/two-col-image-section'
import type {PageBuilderBlock} from '@/sanity/types'

export function PageBuilder({blocks}: {blocks?: PageBuilderBlock[]}) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block) => {
        switch (block._type) {
          case 'hero':
            return <HeroSection key={block._key} block={block} />
          case 'cta':
            return <CtaSection key={block._key} block={block} />
          case 'logos':
            return <LogosSection key={block._key} block={block} />
          case 'twoColCards':
            return <TwoColCardsSection key={block._key} block={block} />
          case 'twoColImage':
            return <TwoColImageSection key={block._key} block={block} />
          case 'textColumns':
            return <TextColumnsSection key={block._key} block={block} />
          case 'listText':
            return <ListTextSection key={block._key} block={block} />
          case 'cardsText':
            return <CardsTextSection key={block._key} block={block} />
          case 'gridText':
            return <GridTextSection key={block._key} block={block} />
          case 'gridMixed':
            return <GridMixedSection key={block._key} block={block} />
          case 'team':
            return <TeamSection key={block._key} block={block} />
          case 'sliderTestimonials':
            return <SliderTestimonialsSection key={block._key} block={block} />
          case 'customSection':
            return <CustomSection key={block._key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
