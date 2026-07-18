'use client'

import useEmblaCarousel from 'embla-carousel-react'
import {useCallback, useEffect} from 'react'
import {ArrowIcon} from '@/components/ui/arrow-icon'
import {Container} from '@/components/ui/container'
import {Section} from '@/components/ui/section'
import {
  TestimonialCard,
  type TestimonialCardData,
} from '@/components/ui/testimonial-card'
import type {PageBuilderBlock} from '@/sanity/types'

function TestimonialsSlider({slides}: {slides: TestimonialCardData[]}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true, align: 'start'})

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.reInit()
  }, [emblaApi, slides.length])

  return (
    <>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex items-stretch">
          {slides.map((slide, i) => (
            <div key={i} className="flex min-w-0 flex-[0_0_100%] flex-col">
              <TestimonialCard slide={slide} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-[0.5rem] flex justify-end gap-3">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={scrollPrev}
          className="flex size-8 items-center justify-center rounded-full border border-brand-charcoal text-brand-charcoal transition-opacity hover:opacity-70"
        >
          <ArrowIcon direction="left" className="h-[13px] w-4" />
        </button>
        <button
          type="button"
          aria-label="Next testimonial"
          onClick={scrollNext}
          className="flex size-8 items-center justify-center rounded-full border border-brand-charcoal text-brand-charcoal transition-opacity hover:opacity-70"
        >
          <ArrowIcon direction="right" className="h-[13px] w-4" />
        </button>
      </div>
    </>
  )
}

/**
 * One testimonial → stand-alone card. Two or more → slider with arrows.
 */
export function TestimonialsBlock({
  slides,
  sectionProps,
  fallbackBackground = 'burnt-orange',
}: {
  slides: TestimonialCardData[]
  sectionProps?: PageBuilderBlock
  fallbackBackground?: string
}) {
  if (!slides.length) return null

  const content =
    slides.length === 1 ? (
      <TestimonialCard slide={slides[0]} fallbackBackground={fallbackBackground} />
    ) : (
      <TestimonialsSlider slides={slides} />
    )

  if (sectionProps) {
    return (
      <Section {...sectionProps}>
        <Container>{content}</Container>
      </Section>
    )
  }

  return <Container>{content}</Container>
}
