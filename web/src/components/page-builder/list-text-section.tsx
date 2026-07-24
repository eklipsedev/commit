import {cn} from '@/lib/cn'
import {Container} from '@/components/ui/container'
import {RichHeadline} from '@/components/ui/rich-headline'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import {TEXT_SIZE_CLASSES, headingFontFromBlock, headingSizeFromBlock} from '@/lib/heading-styles'
import type {PageBuilderBlock, RichHeadline as RichHeadlineType} from '@/sanity/types'

type ListTextBlock = PageBuilderBlock & {
  tagline?: string
  showTaglineRule?: boolean | null
  headline?: RichHeadlineType
  items?: string[]
  columns?: number
}

/** Fill columns top-to-bottom (same as CSS `columns`). */
export function distributeColumns<T>(items: T[], columnCount: number): T[][] {
  const count = Math.max(1, columnCount)
  const perColumn = Math.ceil(items.length / count)
  const columns: T[][] = Array.from({length: count}, () => [])

  items.forEach((item, index) => {
    const columnIndex = Math.min(Math.floor(index / perColumn), count - 1)
    columns[columnIndex].push(item)
  })

  return columns.filter((column) => column.length > 0)
}

export function RuledListColumn({
  items,
  itemClassName = TEXT_SIZE_CLASSES.md,
}: {
  items: string[]
  itemClassName?: string
}) {
  return (
    <ul>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <li
            key={`${item}-${i}`}
            className={cn(
              itemClassName,
              // Per-column rules: top on every row, bottom on the last
              'border-t border-current py-6 md:py-7',
              isLast && 'border-b',
            )}
          >
            {item}
          </li>
        )
      })}
    </ul>
  )
}

export function ListTextSection({block}: {block: ListTextBlock}) {
  const columnCount = block.columns ?? 2
  const items = block.items ?? []
  const columns = distributeColumns(items, columnCount)
  const hasHeader = Boolean(block.tagline || block.headline)

  return (
    <Section {...block}>
      <Container className={cn(hasHeader && 'space-y-10')}>
        {hasHeader && (
          <div className={cn(block.tagline && block.headline && 'space-y-6')}>
            {block.tagline && (
              // Column borders provide the rules — never a full-width tagline rule here.
              <Tagline showRule={false} className="normal-case">
                {block.tagline}
              </Tagline>
            )}
            {block.headline && (
              <RichHeadline
                value={block.headline}
                as="h2"
                size={headingSizeFromBlock(block)}
                font={headingFontFromBlock(block)}
                collapseLineBreaksOnMobile={block.collapseLineBreaksOnMobile}
              />
            )}
          </div>
        )}

        <div className="md:hidden">
          <RuledListColumn items={items} />
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
            <RuledListColumn key={index} items={column} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
