import {colorHex} from '@/lib/colors'
import {HEADING_SIZE_CLASSES} from '@/lib/heading-styles'
import {SanityImage} from '@/components/ui/sanity-image'
import type {SanityImage as SanityImageType} from '@/sanity/types'

export type TestimonialCardData = {
  quote?: string
  name?: string
  role?: string
  image?: SanityImageType
  backgroundColor?: string | null
  textColor?: string | null
}

export function TestimonialCard({
  slide,
  fallbackBackground = 'burnt-orange',
}: {
  slide: TestimonialCardData
  fallbackBackground?: string
}) {
  const bg = colorHex(slide.backgroundColor, fallbackBackground as 'burnt-orange')
  const text = colorHex(slide.textColor, 'white')

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <div className="relative aspect-square w-full shrink-0 bg-neutral-100 md:aspect-auto md:w-1/3">
        {slide.image && (
          <SanityImage
            image={slide.image}
            alt={slide.name}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div
        className="flex flex-1 flex-col justify-between gap-10 p-8 md:p-10 lg:p-12"
        style={{backgroundColor: bg, color: text}}
      >
        <blockquote className={HEADING_SIZE_CLASSES.md}>“{slide.quote}”</blockquote>
        {(slide.name || slide.role) && (
          <div className="space-y-1 text-base leading-snug">
            {slide.name && <p className="font-medium">{slide.name}</p>}
            {slide.role && <p className="opacity-90">{slide.role}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
