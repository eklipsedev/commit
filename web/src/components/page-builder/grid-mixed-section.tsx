import {cn} from '@/lib/cn'
import {Container} from '@/components/ui/container'
import {CmsButton} from '@/components/ui/cms-button'
import {FadeIn, FadeInStack} from '@/components/ui/fade-in'
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
  dimensions?: {width?: number; height?: number}
}

/** Visible frame after a Sanity crop, as a CSS aspect-ratio. */
function imageAspect(image?: CollageImage): string | undefined {
  const width = image?.dimensions?.width
  const height = image?.dimensions?.height
  if (!width || !height) return undefined
  const crop = image.crop
  const w = width * (1 - (crop?.left ?? 0) - (crop?.right ?? 0))
  const h = height * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0))
  if (w <= 0 || h <= 0) return undefined
  return `${w} / ${h}`
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
  /** Use the photo’s own aspect ratio so object-cover does not clip it. */
  natural = false,
}: {
  image?: CollageImage
  className?: string
  sizes?: string
  priority?: boolean
  natural?: boolean
}) {
  if (!image?.asset) return null

  const label = image.description?.trim() || image.alt?.trim()
  const aspect = natural ? imageAspect(image) : undefined

  return (
    <div
      className={cn('group relative w-full overflow-hidden bg-neutral-100', className)}
      style={aspect ? {aspectRatio: aspect} : undefined}
    >
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
            'bg-brand-white px-4 py-2 font-sans text-sm font-medium leading-snug text-brand-charcoal md:px-5 md:text-base',
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
 * [ bottomLeft][ bottomWide ] ← wide tiles use the photo aspect (not a shorter frame)
 */
export function GridMixedSection({block}: {block: GridMixedBlock}) {
  const images = resolveImages(block)

  return (
    <Section {...block}>
      <Container className="space-y-10">
        <FadeInStack className="space-y-8">
          {block.tagline ? (
            <Tagline showRule={block.showTaglineRule !== false}>{block.tagline}</Tagline>
          ) : null}
          {block.heading ? (
            <Heading
              size={headingSizeFromBlock(block)}
              font={headingFontFromBlock(block)}
              style={{color: 'var(--section-heading)'}}
              collapseLineBreaksOnMobile={block.collapseLineBreaksOnMobile}
            >
              {block.heading}
            </Heading>
          ) : null}
        </FadeInStack>

        <FadeIn>
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="grid grid-cols-2 items-start gap-3 md:gap-4">
              <SlotImage
                image={images.topLeft}
                natural
                className="aspect-[8/5]"
                sizes="(max-width: 768px) 50vw, 50vw"
                priority
              />
              <SlotImage
                image={images.topRight}
                natural
                className="aspect-[8/5]"
                sizes="(max-width: 768px) 50vw, 50vw"
                priority
              />
            </div>

            {/*
              Wide photos keep their own aspect ratio. A fixed 2:1 frame, and a
              laptop slot stretched to fill leftover height, was clipping the
              top and bottom of those images.
            */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-start md:gap-4">
              <div className="flex flex-col gap-3 md:gap-4">
                <SlotImage image={images.leftTall} className="aspect-[3/4] w-full shrink-0" />
                <SlotImage
                  image={images.bottomLeft}
                  natural
                  className="aspect-[8/5] w-full shrink-0"
                />
              </div>

              <div className="flex flex-col gap-3 md:col-span-2 md:gap-4">
                <div className="grid shrink-0 grid-cols-2 gap-3 md:gap-4">
                  <SlotImage image={images.centerSquare} className="aspect-square w-full" />
                  <SlotImage image={images.rightSquare} className="aspect-square w-full" />
                </div>
                <SlotImage
                  image={images.bottomWide}
                  natural
                  className="aspect-[101/47] w-full"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>
            </div>
          </div>
        </FadeIn>

        {block.button?.label ? (
          <FadeIn>
            <CmsButton button={block.button} className="shrink-0" />
          </FadeIn>
        ) : null}
      </Container>
    </Section>
  )
}
