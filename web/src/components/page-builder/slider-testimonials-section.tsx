'use client'

import {TestimonialsBlock} from '@/components/ui/testimonials-block'
import {normalizeTestimonialSlide} from '@/lib/normalize-testimonial'
import type {PageBuilderBlock, TestimonialSlide} from '@/sanity/types'

type SliderTestimonialsBlock = PageBuilderBlock & {
  testimonials?: TestimonialSlide[]
}

export function SliderTestimonialsSection({block}: {block: SliderTestimonialsBlock}) {
  const slides = (block.testimonials ?? [])
    .map(normalizeTestimonialSlide)
    .filter((s) => s.quote)

  return <TestimonialsBlock slides={slides} sectionProps={block} />
}
