import {Container} from '@/components/ui/container'
import {CmsButton} from '@/components/ui/cms-button'
import {RichHeadline} from '@/components/ui/rich-headline'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import type {PageBuilderBlock} from '@/sanity/types'

type HeroBlock = PageBuilderBlock & {
  tagline?: string
  headline?: import('@/sanity/types').RichHeadline
  body?: string
  button?: import('@/sanity/types').ButtonValue
}

export function HeroSection({block}: {block: HeroBlock}) {
  return (
    <Section {...block}>
      <Container className="space-y-10 md:space-y-14">
        <RichHeadline
          value={block.headline}
          size="hero"
          collapseLineBreaksOnMobile={block.collapseLineBreaksOnMobile}
        />
        {(block.tagline || block.body || block.button) && (
          <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-start">
            <div className="space-y-6">
              {block.tagline && <Tagline>{block.tagline}</Tagline>}
            </div>
            <div className="space-y-6">
              {block.body && (
                <p className="max-w-xl text-base leading-relaxed md:text-lg" style={{color: 'var(--section-body)'}}>
                  {block.body}
                </p>
              )}
              {block.button && <CmsButton button={block.button} />}
            </div>
          </div>
        )}
      </Container>
    </Section>
  )
}
