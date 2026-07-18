import {cn} from '@/lib/cn'
import {Container} from '@/components/ui/container'
import {RichHeadline} from '@/components/ui/rich-headline'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import {headingSizeFromBlock} from '@/lib/heading-styles'
import type {PageBuilderBlock, RichHeadline as RichHeadlineType} from '@/sanity/types'

type ListTextBlock = PageBuilderBlock & {
  tagline?: string
  headline?: RichHeadlineType
  items?: string[]
  columns?: number
}

export function ListTextSection({block}: {block: ListTextBlock}) {
  const columns = block.columns ?? 2

  return (
    <Section {...block}>
      <Container className="space-y-10">
        {(block.tagline || block.headline) && (
          <div className="space-y-6">
            {block.tagline && <Tagline>{block.tagline}</Tagline>}
            {block.headline && (
              <RichHeadline
                value={block.headline}
                as="h2"
                size={headingSizeFromBlock(block)}
              />
            )}
          </div>
        )}
        <ul
          className={cn(
            'divide-y divide-current/15 border-t border-current/15',
            columns === 3 && 'md:columns-3 md:gap-10',
            columns === 2 && 'md:columns-2 md:gap-10',
          )}
        >
          {block.items?.map((item, i) => (
            <li
              key={`${item}-${i}`}
              className="break-inside-avoid py-4 font-mono text-sm leading-relaxed md:text-base"
              style={{color: 'var(--section-body)'}}
            >
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
