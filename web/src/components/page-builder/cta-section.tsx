import {Container} from '@/components/ui/container'
import {CmsButton} from '@/components/ui/cms-button'
import {RichHeadline} from '@/components/ui/rich-headline'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import {headingFontFromBlock, headingSizeFromBlock} from '@/lib/heading-styles'
import type {PageBuilderBlock, RichHeadline as RichHeadlineType} from '@/sanity/types'

type CtaBlock = PageBuilderBlock & {
  tagline?: string
  headline?: RichHeadlineType
  button?: import('@/sanity/types').ButtonValue
}

export function CtaSection({block}: {block: CtaBlock}) {
  const size = headingSizeFromBlock(block, 'lg')
  // CTAs default to Display (LustText); other sections default to Sans.
  const font = headingFontFromBlock(
    {headingFont: block.headingFont ?? 'display'},
    size,
  )

  return (
    <Section {...block}>
      <Container className="space-y-8">
        {block.tagline && <Tagline showRule={block.showTaglineRule !== false}>{block.tagline}</Tagline>}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
          <RichHeadline
            value={block.headline}
            as="h2"
            size={size}
            font={font}
            className="min-w-0 flex-1"
            collapseLineBreaksOnMobile={block.collapseLineBreaksOnMobile}
          />
          {block.button?.label ? (
            <CmsButton button={block.button} className="shrink-0 self-start" />
          ) : null}
        </div>
      </Container>
    </Section>
  )
}
