import {Container} from '@/components/ui/container'
import {PageHeroIntro} from '@/components/ui/page-hero-intro'
import {RichHeadline} from '@/components/ui/rich-headline'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import type {PageBuilderBlock} from '@/sanity/types'

type HeroBlock = PageBuilderBlock & {
  tagline?: string
  headline?: import('@/sanity/types').RichHeadline
}

export function HeroSection({block}: {block: HeroBlock}) {
  return (
    <Section {...block}>
      <Container className="space-y-10 md:space-y-14">
        <PageHeroIntro
          headline={
            <RichHeadline
              value={block.headline}
              size="hero"
              collapseLineBreaksOnMobile={block.collapseLineBreaksOnMobile}
            />
          }
          tagline={
            block.tagline ? (
              <Tagline showRule={block.showTaglineRule !== false}>{block.tagline}</Tagline>
            ) : undefined
          }
        />
      </Container>
    </Section>
  )
}
