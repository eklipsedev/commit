import {cn} from '@/lib/cn'
import {Container} from '@/components/ui/container'
import {RichHeadline} from '@/components/ui/rich-headline'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import {HEADING_SIZE_CLASSES, headingSizeFromBlock} from '@/lib/heading-styles'
import type {PageBuilderBlock, RichHeadline as RichHeadlineType} from '@/sanity/types'

type ListTextBlock = PageBuilderBlock & {
  tagline?: string
  showTaglineRule?: boolean
  headline?: RichHeadlineType
  items?: string[]
  columns?: number
}

/** Fill columns top-to-bottom (same as CSS `columns`). */
function distributeColumns<T>(items: T[], columnCount: number): T[][] {
  const count = Math.max(1, columnCount)
  const perColumn = Math.ceil(items.length / count)
  const columns: T[][] = Array.from({length: count}, () => [])

  items.forEach((item, index) => {
    const columnIndex = Math.min(Math.floor(index / perColumn), count - 1)
    columns[columnIndex].push(item)
  })

  return columns.filter((column) => column.length > 0)
}

function ListColumn({items}: {items: string[]}) {
  return (
    <ul className="text-brand-charcoal">
      {items.map((item, i) => (
        <li
          key={`${item}-${i}`}
          className={cn(
            HEADING_SIZE_CLASSES.md,
            'border-t border-brand-charcoal py-4 text-[1.25rem] md:text-[2rem]',
            i === items.length - 1 && 'border-b border-brand-charcoal',
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

export function ListTextSection({block}: {block: ListTextBlock}) {
  const columnCount = block.columns ?? 2
  const items = block.items ?? []
  const columns = distributeColumns(items, columnCount)
  const showTaglineRule = block.showTaglineRule !== false
  const hasHeader = Boolean(block.tagline || block.headline)

  return (
    <Section {...block}>
      <Container
        className={cn(
          hasHeader && (showTaglineRule || block.headline) ? 'space-y-10' : 'space-y-4',
        )}
      >
        {hasHeader && (
          <div className={cn(block.tagline && block.headline && 'space-y-6')}>
            {block.tagline && (
              <Tagline showRule={showTaglineRule}>{block.tagline}</Tagline>
            )}
            {block.headline && (
              <RichHeadline
                value={block.headline}
                as="h2"
                size={headingSizeFromBlock(block)}
                collapseLineBreaksOnMobile={block.collapseLineBreaksOnMobile}
              />
            )}
          </div>
        )}

        <div className="md:hidden">
          <ListColumn items={items} />
        </div>

        <div
          className={cn(
            'hidden gap-x-10 md:grid',
            columnCount === 3 && 'md:grid-cols-3',
            columnCount === 2 && 'md:grid-cols-2',
            columnCount === 1 && 'md:grid-cols-1',
          )}
        >
          {columns.map((column, index) => (
            <ListColumn key={index} items={column} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
