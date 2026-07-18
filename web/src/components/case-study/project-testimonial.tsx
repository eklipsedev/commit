import {TestimonialsBlock} from '@/components/ui/testimonials-block'
import {normalizeTestimonialSlide} from '@/lib/normalize-testimonial'
import type {CaseStudyProject, TestimonialSlide} from '@/sanity/types'

export function CaseStudyTestimonial({
  testimonials,
  legacyTestimonial,
}: {
  testimonials?: TestimonialSlide[]
  /** @deprecated Single reference — migrated to `testimonials` array */
  legacyTestimonial?: CaseStudyProject['testimonial']
}) {
  const fromArray = (testimonials ?? [])
    .map(normalizeTestimonialSlide)
    .filter((s) => s.quote)

  if (fromArray.length) {
    return <TestimonialsBlock slides={fromArray} fallbackBackground="deep-blue" />
  }

  if (!legacyTestimonial?.quote) return null

  return (
    <TestimonialsBlock
      slides={[
        {
          quote: legacyTestimonial.quote,
          name: legacyTestimonial.person?.name,
          role: legacyTestimonial.person?.role,
          image: legacyTestimonial.person?.photo,
          backgroundColor: legacyTestimonial.backgroundColor,
          textColor: legacyTestimonial.textColor,
        },
      ]}
      fallbackBackground="deep-blue"
    />
  )
}
