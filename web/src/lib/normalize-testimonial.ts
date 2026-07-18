import type {TestimonialCardData} from '@/components/ui/testimonial-card'
import type {TestimonialSlide} from '@/sanity/types'

export function normalizeTestimonialSlide(slide: TestimonialSlide): TestimonialCardData {
  if (slide.testimonial) {
    const person = slide.testimonial.person
    return {
      quote: slide.testimonial.quote,
      name: person?.name ?? slide.testimonial.name,
      role: person?.role ?? slide.testimonial.role,
      image: person?.photo ?? slide.testimonial.image,
      backgroundColor: slide.backgroundColor ?? slide.testimonial.defaultBackgroundColor,
      textColor: slide.textColor ?? slide.testimonial.defaultTextColor,
    }
  }

  const person = slide.person
  return {
    quote: slide.quote,
    name: person?.name ?? slide.name,
    role: person?.role ?? slide.role,
    image: person?.photo ?? slide.image,
    backgroundColor: slide.backgroundColor,
    textColor: slide.textColor,
  }
}
