import {cn} from '@/lib/cn'
import {Container} from '@/components/ui/container'
import {CmsButton} from '@/components/ui/cms-button'
import {Heading} from '@/components/ui/heading'
import {SanityImage} from '@/components/ui/sanity-image'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import {headingSizeFromBlock} from '@/lib/heading-styles'
import type {PageBuilderBlock, SanityImage as SanityImageType} from '@/sanity/types'

type GridMixedImages = {
  topLeft?: SanityImageType
  topRight?: SanityImageType
  leftTall?: SanityImageType
  centerSquare?: SanityImageType
  rightSquare?: SanityImageType
  bottomLeft?: SanityImageType
  bottomWide?: SanityImageType
}

type GridMixedBlock = PageBuilderBlock & {
  tagline?: string
  heading?: string
  images?: GridMixedImages
  /** @deprecated Legacy flexible array — prefer `images` slots */
  items?: Array<{_key?: string; image?: SanityImageType; size?: string}>
  button?: import('@/sanity/types').ButtonValue
}

function resolveImages(block: GridMixedBlock): GridMixedImages {
  if (block.images) return block.images

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
  image?: SanityImageType
  className?: string
  sizes?: string
  priority?: boolean
}) {
  if (!image?.asset) return null

  return (
    <div className={cn('relative w-full overflow-hidden bg-neutral-100', className)}>
      <SanityImage
        image={image}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
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
          {block.tagline && <Tagline>{block.tagline}</Tagline>}
          {block.heading && (
            <Heading
              size={headingSizeFromBlock(block)}
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
            Equal-height columns (stretch) + flex-1 bottom tiles → bases align.
            Fixed-aspect top tiles (shrink-0 / items-start) → tall stays taller
            than the squares, so the wide tile tucks under the squares.
          */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-stretch md:gap-4">
            <div className="flex min-h-0 flex-col gap-3 md:gap-4">
              <SlotImage image={images.leftTall} className="aspect-[3/4] shrink-0" />
              <SlotImage image={images.bottomLeft} className="min-h-48 flex-1 basis-0 md:min-h-0" />
            </div>

            <div className="flex min-h-0 flex-col gap-3 md:col-span-2 md:gap-4">
              <div className="grid shrink-0 grid-cols-2 items-start gap-3 md:gap-4">
                <SlotImage image={images.centerSquare} className="aspect-square" />
                <SlotImage image={images.rightSquare} className="aspect-square" />
              </div>
              <SlotImage
                image={images.bottomWide}
                className="min-h-48 flex-1 basis-0 md:min-h-0"
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
