import {Container} from '@/components/ui/container'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import type {PageBuilderBlock} from '@/sanity/types'

type TextColumnsBlock = PageBuilderBlock & {
  tagline?: string
  body?: string
}

export function TextColumnsSection({block}: {block: TextColumnsBlock}) {
  return (
    <Section {...block}>
      <Container className="space-y-8 md:space-y-10">
        {block.tagline && <Tagline>{block.tagline}</Tagline>}
        {block.body && (
          <div className="grid md:grid-cols-2 md:gap-x-14">
            <div className="hidden md:block" aria-hidden />
            <p
              className="whitespace-pre-line text-[1.5rem] font-normal leading-[1.2] md:text-[2rem]"
              style={{color: 'var(--section-body)'}}
            >
              {block.body}
            </p>
          </div>
        )}
      </Container>
    </Section>
  )
}
