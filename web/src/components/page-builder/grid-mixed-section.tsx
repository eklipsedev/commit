import {cn} from '@/lib/cn'
import {Container} from '@/components/ui/container'
import {CmsButton} from '@/components/ui/cms-button'
import {Heading} from '@/components/ui/heading'
import {SanityImage} from '@/components/ui/sanity-image'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import {headingFontFromBlock, headingSizeFromBlock} from '@/lib/heading-styles'
import type {PageBuilderBlock, SanityImage as SanityImageType} from '@/sanity/types'

/** Collage image: alt for a11y, description for the hover label. */
type CollageImage = SanityImageType & {
  description?: string
  _key?: string
}

type GridMixedImages = {
  topLeft?: CollageImage
  topRight?: CollageImage
  leftTall?: CollageImage
  centerSquare?: CollageImage
  rightSquare?: CollageImage
  bottomLeft?: CollageImage
  bottomWide?: CollageImage
}

type GridMixedBlock = PageBuilderBlock & {
  tagline?: string
  heading?: string
  /** Ordered collage images (preferred). */
  images?: CollageImage[] | GridMixedImages
  /** @deprecated Legacy flexible array — prefer `images` */
  items?: Array<{_key?: string; image?: CollageImage; size?: string}>
  button?: import('@/sanity/types').ButtonValue
}

const SLOT_ORDER = [
  'topLeft',
  'topRight',
  'leftTall',
  'centerSquare',
  'rightSquare',
  'bottomLeft',
  'bottomWide',
] as const

function resolveImages(block: GridMixedBlock): GridMixedImages {
  // New: reorderable array — index maps to layout slot.
  if (Array.isArray(block.images)) {
    const slots: GridMixedImages = {}
    for (let i = 0; i < SLOT_ORDER.length; i++) {
      const image = block.images[i]
      if (image) slots[SLOT_ORDER[i]] = image
    }
    return slots
  }

  // Legacy fixed-slot object
  if (block.images && typeof block.images === 'object') {
    return block.images
  }

  const items = block.items ?? []
  const bySize = (size: string) => items.find((item) => item.size === size)?.image
  const squares = items.filter((item) => item.size === 'square' || item.size === 'small')
  const wides = items.filter((item) => item.size === 'wide')

  return {
    topLeft: wides[0]?.image,
    topRight: wides[1]?.image,
    leftTall: bySize('tall'),
    centerSquare: squares[0]?.image,
    rightSquare: squares[1]?.image,
    bottomLeft: squares[2]?.image ?? bySize('small'),
    bottomWide: bySize('large'),
  }
}

function SlotImage({
  image,
  className,
  sizes = '(max-width: 768px) 50vw, 33vw',
  priority,
}: {
  image?: CollageImage
  className?: string
  sizes?: string
  priority?: boolean
}) {
  if (!image?.asset) return null

  const label = image.description?.trim() || image.alt?.trim()

  return (
    <div className={cn('group relative w-full overflow-hidden bg-neutral-100', className)}>
      <SanityImage
        image={image}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {label ? (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute bottom-0 left-0 z-10',
            'bg-white px-3 py-2 font-sans text-[1.25rem] leading-[1.2] text-brand-charcoal',
            '-translate-x-full transition-transform duration-300 ease-out',
            'group-hover:translate-x-0 group-focus-within:translate-x-0',
            'motion-reduce:transition-none',
          )}
        >
          <span aria-hidden className="mr-1.5">
            →
          </span>
          {label}
        </span>
      ) : null}
    </div>
  )
}

/**
 * Fixed 7-slot collage with staggered masonry:
 *
 * [ topLeft ½ ][ topRight ½ ]
 * [ leftTall  ][ sq ][ sq ]   ← tall keeps portrait aspect (not stretched)
 * [ leftTall  ][ bottomWide ] ← wide tucks under squares
 * [ bottomLeft][ bottomWide ] ← bottom tiles flex so bases align
 */
export function GridMixedSection({block}: {block: GridMixedBlock}) {
  const images = resolveImages(block)

  return (
    <Section {...block}>
      <Container className="space-y-10">
        <div className="space-y-8">
          {block.tagline && (
            <Tagline showRule={block.showTaglineRule !== false}>{block.tagline}</Tagline>
          )}
          {block.heading && (
            <Heading
              size={headingSizeFromBlock(block)}
              font={headingFontFromBlock(block)}
              style={{color: 'var(--section-heading)'}}
              collapseLineBreaksOnMobile={block.collapseLineBreaksOnMobile}
            >
              {block.heading}
            </Heading>
          )}
        </div>

        <div className="flex flex-col gap-3 md:gap-4">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <SlotImage
              image={images.topLeft}
              className="aspect-[2/1]"
              sizes="(max-width: 768px) 50vw, 50vw"
              priority
            />
            <SlotImage
              image={images.topRight}
              className="aspect-[2/1]"
              sizes="(max-width: 768px) 50vw, 50vw"
              priority
            />
          </div>

          {/*
            Left column sets height (tall + bottomLeft aspects).
            Right column stretches to match; bottomWide flex-fills the rest
            so it tucks under the squares and lines up with bottomLeft’s base.
          */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-stretch md:gap-4">
            <div className="flex flex-col gap-3 md:gap-4">
              <SlotImage image={images.leftTall} className="aspect-[3/4] w-full shrink-0" />
              <SlotImage image={images.bottomLeft} className="aspect-[2/1] w-full shrink-0" />
            </div>

            <div className="flex min-h-0 flex-col gap-3 md:col-span-2 md:gap-4">
              <div className="grid shrink-0 grid-cols-2 gap-3 md:gap-4">
                <SlotImage image={images.centerSquare} className="aspect-square w-full" />
                <SlotImage image={images.rightSquare} className="aspect-square w-full" />
              </div>
              <SlotImage
                image={images.bottomWide}
                className="min-h-48 w-full flex-1 basis-0 md:min-h-0"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
          </div>
        </div>

        {block.button && <CmsButton button={block.button} className="shrink-0" />}
      </Container>
    </Section>
  )
}
