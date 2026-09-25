import {stegaClean} from 'next-sanity'
import {cn} from '@/lib/cn'
import {Container} from '@/components/ui/container'
import {FadeInStack} from '@/components/ui/fade-in'
import {RichHeadline} from '@/components/ui/rich-headline'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import type {PageBuilderBlock} from '@/sanity/types'

type HeroBlock = PageBuilderBlock & {
  tagline?: string
  headline?: import('@/sanity/types').RichHeadline
}

/** Tighter under the nav than a normal section, with more room below the headline. */
const HERO_PADDING_TOP = 'pt-8 md:pt-10'
const HERO_PADDING_BOTTOM = 'pb-20 md:pb-32'

export function HeroSection({block}: {block: HeroBlock}) {
  const collapseTop = stegaClean(block.collapsePaddingTop) === true
  const collapseBottom = stegaClean(block.collapsePaddingBottom) === true

  return (
    <Section
      {...block}
      className={cn(!collapseTop && HERO_PADDING_TOP, !collapseBottom && HERO_PADDING_BOTTOM)}
    >
      <Container>
        <FadeInStack className="space-y-10 md:space-y-14" stagger={120}>
          <RichHeadline
            value={block.headline}
            size="hero"
            collapseLineBreaksOnMobile={block.collapseLineBreaksOnMobile}
          />
          {block.tagline ? (
            <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-start">
              <Tagline showRule={block.showTaglineRule !== false}>{block.tagline}</Tagline>
            </div>
          ) : null}
        </FadeInStack>
      </Container>
    </Section>
  )
}
