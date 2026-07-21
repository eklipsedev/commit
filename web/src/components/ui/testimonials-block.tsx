'use client'

import useEmblaCarousel from 'embla-carousel-react'
import {useCallback, useEffect, useState} from 'react'
import {ArrowIcon} from '@/components/ui/arrow-icon'
import {Container} from '@/components/ui/container'
import {Section} from '@/components/ui/section'
import {
  TestimonialCard,
  type TestimonialCardData,
} from '@/components/ui/testimonial-card'
import {useInView} from '@/lib/use-in-view'
import type {PageBuilderBlock} from '@/sanity/types'

function TestimonialsSlider({slides}: {slides: TestimonialCardData[]}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    // Embla duration is a travel factor (not ms); keep the slide itself snappy.
    duration: 20,
  })
  const [sectionRef, sectionInView] = useInView<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: '0px 0px -8% 0px',
    once: true,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  /** Incremented when the destination slide is selected so copy remounts immediately. */
  const [activateToken, setActivateToken] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.reInit()
  }, [emblaApi, slides.length])

  useEffect(() => {
    if (!emblaApi) return

    let armed = false
    let lastAnimatedIndex = emblaApi.selectedScrollSnap()

    // Fire as soon as the destination slide is known (start of scroll), not after settle.
    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap()
      setSelectedIndex(index)
      if (!armed) return
      // Loop reposition can re-select the same snap.
      if (index === lastAnimatedIndex) return
      lastAnimatedIndex = index
      setActivateToken((token) => token + 1)
    }

    setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    // Ignore the init select; section enter owns the first reveal.
    const armId = window.setTimeout(() => {
      armed = true
    }, 0)

    return () => {
      window.clearTimeout(armId)
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  // First entrance: once the section is in view, kick the active slide.
  useEffect(() => {
    if (!sectionInView) return
    setActivateToken((token) => (token === 0 ? 1 : token))
  }, [sectionInView])

  return (
    <div ref={sectionRef}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex items-stretch">
          {slides.map((slide, i) => (
            <div key={i} className="flex min-w-0 flex-[0_0_100%] flex-col">
              <TestimonialCard
                slide={slide}
                priority={i === 0}
                sectionInView={sectionInView}
                active={i === selectedIndex}
                activateToken={i === selectedIndex ? activateToken : 0}
              />
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
    </div>
  )
}

function SingleTestimonial({
  slide,
  fallbackBackground,
}: {
  slide: TestimonialCardData
  fallbackBackground?: string
}) {
  const [sectionRef, sectionInView] = useInView<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: '0px 0px -8% 0px',
    once: true,
  })
  const [activateToken, setActivateToken] = useState(0)

  useEffect(() => {
    if (!sectionInView) return
    setActivateToken(1)
  }, [sectionInView])

  return (
    <div ref={sectionRef}>
      <TestimonialCard
        slide={slide}
        fallbackBackground={fallbackBackground}
        priority
        sectionInView={sectionInView}
        active
        activateToken={activateToken}
      />
    </div>
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
      <SingleTestimonial slide={slides[0]} fallbackBackground={fallbackBackground} />
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
