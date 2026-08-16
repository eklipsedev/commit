import {BodyPortableText} from '@/components/portable-text/body-portable-text'
import {Container} from '@/components/ui/container'
import {FadeIn} from '@/components/ui/fade-in'
import {Heading} from '@/components/ui/heading'
import {SanityImage} from '@/components/ui/sanity-image'
import {Section} from '@/components/ui/section'
import {headingFontFromBlock, headingSizeFromBlock} from '@/lib/heading-styles'
import type {PageBuilderBlock, SanityImage as SanityImageType} from '@/sanity/types'
import type {PortableTextBlock} from '@portabletext/types'

type TwoColImageBlock = PageBuilderBlock & {
  image?: SanityImageType
  imagePosition?: 'left' | 'right'
  heading?: string
  body?: PortableTextBlock[]
}

export function TwoColImageSection({block}: {block: TwoColImageBlock}) {
  const imageLeft = block.imagePosition !== 'right'
  const headingSize = headingSizeFromBlock(block, 'md')
  const headingFont = headingFontFromBlock(block, headingSize)

  const imageCol = (
    <FadeIn>
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        {block.image && (
          <SanityImage
            image={block.image}
            alt={block.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}
      </div>
    </FadeIn>
  )

  const textCol = (
    <FadeIn delay={100}>
      <div className="flex flex-col justify-center space-y-6">
        {block.heading && (
          <Heading
            size={headingSize}
            font={headingFont}
            style={{color: 'var(--section-heading)'}}
            collapseLineBreaksOnMobile={block.collapseLineBreaksOnMobile}
          >
            {block.heading}
          </Heading>
        )}
        <BodyPortableText value={block.body} />
      </div>
    </FadeIn>
  )

  return (
    <Section {...block}>
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          {imageLeft ? (
            <>
              {imageCol}
              {textCol}
            </>
          ) : (
            <>
              {textCol}
              {imageCol}
            </>
          )}
        </div>
      </Container>
    </Section>
  )
}
