import {cn} from '@/lib/cn'
import {CmsButton} from '@/components/ui/cms-button'
import {RichHeadline} from '@/components/ui/rich-headline'
import {Tagline} from '@/components/ui/tagline'
import {BodyPortableText} from '@/components/portable-text/body-portable-text'
import {
  distributeColumns,
  RuledListColumn,
} from '@/components/page-builder/list-text-section'
import {headingFontFromBlock, headingSizeFromBlock, TEXT_SIZE_CLASSES} from '@/lib/heading-styles'
import {moduleStackGapClass} from '@/lib/module-stack'
import type {ButtonValue, RichHeadline as RichHeadlineType} from '@/sanity/types'
import type {PortableTextBlock} from '@portabletext/types'

type TextGridItem =
  | string
  | {_type?: 'textGridItem'; text?: string}
  | {_type?: string; _id?: string; title?: string}

type TextGridGroup = {
  title?: string
  /** @deprecated Legacy whole-group services list */
  itemSource?: 'manual' | 'services'
  items?: TextGridItem[]
  /** @deprecated Legacy whole-group services list */
  services?: {_id?: string; title?: string}[]
}

type TextGrid = {
  columns?: number
  itemSize?: 'sm' | 'md'
  groups?: TextGridGroup[]
}

type DetailAttributes = {
  label?: string
  showTaglineRule?: boolean
  valueSize?: 'sm' | 'md' | 'lg'
  attributes?: {label?: string; values?: string[]}[]
}

type StringListItem =
  | string
  | {_type?: 'stringListItem' | 'textGridItem'; text?: string}
  | {_type?: string; _id?: string; title?: string}

type CustomModule = {
  _key?: string
  _type?: string
  text?: string | PortableTextBlock[]
  button?: ButtonValue
  buttonPlacement?: 'beside' | 'below'
  columns?: number
  items?: StringListItem[]
  groups?: TextGridGroup[]
  label?: string
  showTaglineRule?: boolean
  showRules?: boolean
  size?: 'sm' | 'md' | 'lg'
  steps?: {text?: string}[]
  headline?: RichHeadlineType
  headingSize?: string
  headingFont?: string
  fullWidth?: boolean
  /** Horizontal text alignment. Right also pins a constrained headline to the right edge. */
  align?: 'left' | 'right' | null
  /** Preferred field name from Studio (`textAlign`). */
  textAlign?: 'left' | 'right' | null
  collapseLineBreaksOnMobile?: boolean
  /** New flexible split layout */
  layout?: 1 | 2
  arrangement?: 'auto' | 'grid' | 'stack'
  columnGap?: 'sm' | 'md' | 'lg'
  content?: CustomModule[]
  left?: CustomModule[]
  right?: CustomModule[]
  /** @deprecated Legacy fixed left-headline / right-content split */
  rightType?: 'body' | 'list' | 'textGrid'
  body?: string
  listSource?: 'manual' | 'services'
  listItems?: string[]
  listServices?: {_id?: string; title?: string}[]
  listColumns?: number
  /** @deprecated Prefer string list / other modules — still rendered for legacy content */
  textGrid?: TextGrid
  itemSize?: 'sm' | 'md'
  textSize?: 'sm' | 'md' | 'lg'
  attributes?: {label?: string; values?: string[]}[]
  valueSize?: 'sm' | 'md' | 'lg'
}

function resolveListItemLabel(item: StringListItem | null | undefined): string | null {
  if (item == null) return null
  if (typeof item === 'string') return item.trim() || null
  if ('text' in item && item.text) return item.text.trim() || null
  if ('title' in item && item.title) return item.title
  return null
}

function resolveStringListItems(items?: (StringListItem | null)[]) {
  return (items ?? [])
    .map(resolveListItemLabel)
    .filter((label): label is string => Boolean(label))
}

function resolveTextGridItemLabel(item: TextGridItem | null | undefined): string | null {
  if (item == null) return null
  if (typeof item === 'string') return item.trim() || null
  if ('text' in item && item.text) return item.text.trim() || null
  if ('title' in item && item.title) return item.title
  return null
}

function resolveGroupItems(group: TextGridGroup) {
  if (group.items?.length) {
    return group.items
      .map(resolveTextGridItemLabel)
      .filter((label): label is string => Boolean(label))
  }
  // Legacy: whole-group source before mixed items array
  if (group.itemSource === 'services') {
    return (group.services ?? [])
      .map((service) => service.title)
      .filter((title): title is string => Boolean(title))
  }
  return (group.items ?? [])
    .filter((item): item is string => typeof item === 'string')
    .filter(Boolean)
}

function textGridItemClass(itemSize?: 'sm' | 'md') {
  return itemSize === 'sm' ? TEXT_SIZE_CLASSES.sm : TEXT_SIZE_CLASSES.md
}

function detailAttributeValueClass(valueSize?: 'sm' | 'md' | 'lg') {
  // Medium (default) = 32→24. Small = 20. Legacy `lg` maps to Medium.
  return valueSize === 'sm' ? TEXT_SIZE_CLASSES.sm : TEXT_SIZE_CLASSES.md
}

function TextGridView({grid}: {grid?: TextGrid}) {
  if (!grid?.groups?.length) return null
  const cols = grid.columns ?? 2
  const itemClass = textGridItemClass(grid.itemSize)
  return (
    <div
      className={cn(
        'grid gap-8',
        cols === 2 && 'md:grid-cols-2',
        cols === 3 && 'md:grid-cols-3',
        cols === 4 && 'md:grid-cols-4',
      )}
    >
      {grid.groups.map((group, i) => {
        const items = resolveGroupItems(group)
        if (!items.length && !group.title) return null
        return (
          <div key={group.title ?? i} className="space-y-3">
            {group.title && (
              <p className="font-mono text-xs tracking-normal">{group.title}</p>
            )}
            {items.length > 0 && (
              <ul className={cn('space-y-2', itemClass)}>
                {items.map((item, j) => (
                  <li key={`${item}-${j}`}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

function DetailAttributesView({details}: {details?: DetailAttributes}) {
  if (!details?.attributes?.length) return null

  const columns = Math.min(Math.max(details.attributes.length, 1), 4) as 1 | 2 | 3 | 4
  const columnClass = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns]
  const valueClass = detailAttributeValueClass(details.valueSize)

  return (
    <div className="space-y-8">
      {details.label && (
        <Tagline showRule={details.showTaglineRule !== false}>{details.label}</Tagline>
      )}
      <dl className={cn('grid gap-6', columnClass)}>
        {details.attributes.map((attr) => (
          <div key={attr.label}>
            <dt className="font-mono text-xs tracking-normal">{attr.label}</dt>
            <dd className={cn('mt-2 space-y-1', valueClass)}>
              {attr.values?.map((value, i) => (
                <p key={`${value}-${i}`}>{value}</p>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function StringListView({
  label,
  items,
  columns = 2,
  itemSize = 'md',
  showRules,
  className,
}: {
  label?: string
  items?: StringListItem[]
  columns?: number
  itemSize?: 'sm' | 'md'
  showRules?: boolean
  className?: string
}) {
  const labels = resolveStringListItems(items)
  if (!labels.length) return null
  const itemClass =
    itemSize === 'sm'
      ? 'text-base leading-snug'
      : 'font-sans text-[1.25rem] font-normal leading-snug tracking-normal'

  if (showRules) {
    const columnCount = Math.min(Math.max(columns ?? 2, 1), 3)
    const cols = distributeColumns(labels, columnCount)
    return (
      <div className={cn('space-y-4', className)}>
        {label && (
          <p className="font-sans text-[1.5rem] font-normal leading-[1.2] tracking-normal md:text-[2rem]">
            {label}
          </p>
        )}
        <div
          className={cn(
            'grid gap-x-10',
            columnCount === 1 && 'grid-cols-1',
            columnCount === 2 && 'grid-cols-1 sm:grid-cols-2',
            columnCount === 3 && 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
          )}
        >
          {cols.map((column, index) => (
            <RuledListColumn key={index} items={column} itemClassName={itemClass} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {label && (
        <p className="font-sans text-[1.5rem] font-normal leading-[1.2] tracking-normal md:text-[2rem]">
          {label}
        </p>
      )}
      <ul
        className={cn(
          'grid gap-x-10 gap-y-1.5',
          columns === 2 && 'sm:grid-cols-2',
          columns === 3 && 'sm:grid-cols-2 md:grid-cols-3',
        )}
      >
        {labels.map((item, i) => (
          <li key={`${item}-${i}`} className={cn('flex gap-2.5', itemClass)}>
            <span
              aria-hidden
              className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-current"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SplitColumn({modules}: {modules?: CustomModule[]}) {
  if (!modules?.length) return <div />
  return (
    <div className="flex flex-col">
      {modules.map((mod, index) => {
        const prev = modules[index - 1]
        const tightToPrev = prev?._type === 'moduleTagline'
        const afterSpacer = prev?._type === 'moduleSpacer'
        return (
          <div
            key={mod._key ?? `${mod._type}-${index}`}
            className={cn(
              index > 0 &&
                !afterSpacer &&
                moduleStackGapClass({tightToPrev, nested: true}),
            )}
          >
            <CustomModuleRenderer module={mod} nested />
          </div>
        )
      })}
    </div>
  )
}

function splitColumnGapClass(columnGap?: 'sm' | 'md' | 'lg') {
  if (columnGap === 'sm') return 'grid gap-8 md:grid-cols-2 md:gap-10'
  if (columnGap === 'lg') return 'grid gap-8 md:grid-cols-2 md:gap-24 lg:gap-28'
  return 'grid gap-8 md:grid-cols-2 md:gap-16'
}

function StepIndex({n}: {n: number}) {
  return (
    <span
      aria-hidden
      className="flex size-7 shrink-0 items-center justify-center rounded-full border border-current font-sans text-base font-normal leading-none"
    >
      {n}
    </span>
  )
}

function hasLegacySplitContent(module: CustomModule) {
  return Boolean(
    module.headline ||
      module.body ||
      module.listItems?.length ||
      module.listServices?.length ||
      module.textGrid ||
      module.button ||
      module.rightType,
  )
}

function bodyTextClass(module: CustomModule) {
  // Prefer textSize; map legacy headingSize (h3/lg → Large, else Medium).
  const legacy = module.headingSize
  const size =
    module.textSize ??
    (legacy === 'lg' || legacy === 'h3' ? 'lg' : legacy === 'sm' ? 'sm' : 'md')
  if (size === 'lg') return TEXT_SIZE_CLASSES.lg
  if (size === 'sm') {
    return 'font-sans text-[1.5rem] font-normal leading-[1.2] tracking-normal'
  }
  return TEXT_SIZE_CLASSES.md
}

export function CustomModuleRenderer({
  module,
  nested = false,
}: {
  module: CustomModule
  nested?: boolean
}) {
  switch (module._type) {
    case 'moduleTagline':
      return typeof module.text === 'string' ? (
        <Tagline showRule={module.showTaglineRule !== false}>{module.text}</Tagline>
      ) : null
    case 'moduleHeadline':
      return (
        <RichHeadline
          value={(module as {text?: RichHeadlineType}).text}
          as="h2"
          size={headingSizeFromBlock(module)}
          font={headingFontFromBlock(module)}
          fullWidth={module.fullWidth}
          align={module.textAlign ?? module.align}
          collapseLineBreaksOnMobile={module.collapseLineBreaksOnMobile}
        />
      )
    case 'moduleBody': {
      const paragraphClass = cn(bodyTextClass(module), 'leading-[1.35]')
      if (Array.isArray(module.text)) {
        return (
          <BodyPortableText
            value={module.text}
            className="max-w-3xl"
            paragraphClassName={paragraphClass}
          />
        )
      }
      if (!module.text) return null
      return (
        <p
          className={cn('max-w-3xl whitespace-pre-line', paragraphClass)}
          style={{color: 'var(--section-body)'}}
        >
          {module.text}
        </p>
      )
    }
    case 'moduleSplit': {
      const hasNewColumns = Boolean(
        module.content?.length || module.left?.length || module.right?.length,
      )

      if (hasNewColumns || module.layout === 1 || module.layout === 2) {
        if (module.layout === 1) {
          return <SplitColumn modules={module.content} />
        }
        return (
          <div className={splitColumnGapClass(module.columnGap)}>
            <SplitColumn modules={module.left} />
            <SplitColumn modules={module.right} />
          </div>
        )
      }

      // Legacy: fixed left headline + right body/list/text grid
      if (!hasLegacySplitContent(module)) return null

      const listItems =
        module.listSource === 'services'
          ? (module.listServices ?? [])
              .map((service) => service.title)
              .filter((title): title is string => Boolean(title))
          : module.listItems

      return (
        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          <RichHeadline
            value={module.headline}
            as="h2"
            size={headingSizeFromBlock(module)}
            font={headingFontFromBlock(module)}
            collapseLineBreaksOnMobile={module.collapseLineBreaksOnMobile}
          />
          <div className="space-y-6">
            {module.rightType === 'body' && module.body && (
              <p className={TEXT_SIZE_CLASSES.md}>{module.body}</p>
            )}
            {module.rightType === 'list' && (
              <StringListView items={listItems} columns={module.listColumns} showRules />
            )}
            {module.rightType === 'textGrid' && <TextGridView grid={module.textGrid} />}
            {module.button && <CmsButton button={module.button} />}
          </div>
        </div>
      )
    }
    case 'textGrid':
      return <TextGridView grid={module as unknown as TextGrid} />
    case 'moduleStringList': {
      const placement = module.buttonPlacement ?? 'below'
      const list = (
        <StringListView
          label={module.label}
          items={module.items}
          columns={module.columns}
          itemSize={module.itemSize}
          showRules={module.showRules}
          className={placement === 'beside' ? 'min-w-0 flex-1' : undefined}
        />
      )

      if (module.button && placement === 'beside') {
        return (
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
            {list}
            <CmsButton button={module.button} className="shrink-0 self-start" />
          </div>
        )
      }

      return (
        <div className="space-y-6">
          {list}
          {module.button && <CmsButton button={module.button} />}
        </div>
      )
    }
    case 'detailAttributes':
      return <DetailAttributesView details={module as unknown as DetailAttributes} />
    case 'moduleSteps': {
      const steps = module.steps ?? []
      const stacked =
        module.arrangement === 'stack' ||
        (module.arrangement !== 'grid' && nested)

      if (stacked) {
        return (
          <ol className="flex flex-col gap-8 md:gap-10">
            {steps.map((step, i) => (
              <li key={step.text ?? i} className="flex items-start gap-8">
                <StepIndex n={i + 1} />
                <p className={cn(TEXT_SIZE_CLASSES.md, 'min-w-0 pt-0.5')}>{step.text}</p>
              </li>
            ))}
          </ol>
        )
      }

      const columns = Math.min(Math.max(steps.length, 1), 3) as 1 | 2 | 3
      const columnClass = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
      }[columns]

      return (
        <ol className={cn('grid gap-y-10 gap-x-16', columnClass)}>
          {steps.map((step, i) => (
            <li key={step.text ?? i} className="flex flex-col gap-5">
              <StepIndex n={i + 1} />
              <p className={cn(TEXT_SIZE_CLASSES.md, 'text-balance')}>{step.text}</p>
            </li>
          ))}
        </ol>
      )
    }
    case 'moduleChecklist':
      return <ChecklistView items={module.items} />
    case 'moduleButton':
      return <CmsButton button={module.button} />
    case 'moduleSpacer': {
      const size = module.size === 'sm' ? 'sm' : module.size === 'lg' ? 'lg' : 'md'
      return (
        <div
          aria-hidden
          className={cn(
            size === 'sm' && 'h-6 md:h-8',
            size === 'md' && 'h-12 md:h-16',
            size === 'lg' && 'h-20 md:h-28',
          )}
        />
      )
    }
    default:
      return null
  }
}

function ChecklistView({items}: {items?: StringListItem[]}) {
  const labels = resolveStringListItems(items)
  if (!labels.length) return null

  return (
    <ul className="space-y-6">
      {labels.map((item) => (
        <li key={item} className="flex gap-4">
          <span
            aria-hidden
            className="mt-[0.35em] size-3 shrink-0 rounded-full border border-current"
          />
          <p className={cn(TEXT_SIZE_CLASSES.md, 'text-balance')}>{item}</p>
        </li>
      ))}
    </ul>
  )
}
