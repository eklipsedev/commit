import {cn} from '@/lib/cn'
import {CmsButton} from '@/components/ui/cms-button'
import {RichHeadline} from '@/components/ui/rich-headline'
import {Tagline} from '@/components/ui/tagline'
import {headingSizeFromBlock} from '@/lib/heading-styles'
import type {ButtonValue, RichHeadline as RichHeadlineType} from '@/sanity/types'

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
  attributes?: {label?: string; values?: string[]}[]
}

type StringListItem =
  | string
  | {_type?: 'stringListItem' | 'textGridItem'; text?: string}
  | {_type?: string; _id?: string; title?: string}

type CustomModule = {
  _key?: string
  _type?: string
  text?: string
  button?: ButtonValue
  buttonPlacement?: 'beside' | 'below'
  columns?: number
  items?: StringListItem[]
  groups?: TextGridGroup[]
  label?: string
  showRules?: boolean
  steps?: {text?: string}[]
  headline?: RichHeadlineType
  headingSize?: string
  fullWidth?: boolean
  collapseLineBreaksOnMobile?: boolean
  /** New flexible split layout */
  layout?: 1 | 2
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
  textGrid?: TextGrid
  itemSize?: 'sm' | 'md'
  attributes?: {label?: string; values?: string[]}[]
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
  return itemSize === 'md'
    ? 'font-display text-[1.25rem] font-normal leading-[1.2] tracking-normal md:text-[2rem]'
    : 'font-display text-[1.25rem] font-normal leading-[1.2] tracking-normal'
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
              <p className="font-mono text-xs tracking-normal text-brand-charcoal">{group.title}</p>
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

  return (
    <div className="space-y-8">
      {details.label && <Tagline>{details.label}</Tagline>}
      <dl className={cn('grid gap-6', columnClass)}>
        {details.attributes.map((attr) => (
          <div key={attr.label}>
            <dt className="font-mono text-xs tracking-normal text-brand-charcoal">{attr.label}</dt>
            <dd className="mt-2 space-y-1 font-display text-[1.25rem] font-normal leading-[1.2] tracking-normal md:text-[2rem]">
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
  itemSize = 'sm',
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
    itemSize === 'md'
      ? 'font-display text-[1.25rem] font-normal leading-[1.2] tracking-normal md:text-[2rem]'
      : 'font-display text-[1.25rem] font-normal leading-[1.2] tracking-normal'
  return (
    <div className={cn('space-y-4', className)}>
      {label && <p className="font-mono text-xs uppercase tracking-wide">{label}</p>}
      <ul
        className={cn(
          'grid gap-x-10 gap-y-2',
          showRules && 'gap-y-0 divide-y divide-brand-charcoal border-t border-brand-charcoal',
          columns === 2 && 'sm:grid-cols-2',
          columns === 3 && 'sm:grid-cols-2 md:grid-cols-3',
        )}
      >
        {labels.map((item, i) => (
          <li key={`${item}-${i}`} className={cn(itemClass, showRules && 'py-3')}>
            {item}
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
        return (
          <div
            key={mod._key ?? `${mod._type}-${index}`}
            className={cn(index > 0 && (tightToPrev ? 'mt-7 md:mt-8' : 'mt-6 md:mt-8'))}
          >
            <CustomModuleRenderer module={mod} />
          </div>
        )
      })}
    </div>
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

export function CustomModuleRenderer({module}: {module: CustomModule}) {
  switch (module._type) {
    case 'moduleTagline':
      return <Tagline>{module.text}</Tagline>
    case 'moduleHeadline':
      return (
        <RichHeadline
          value={(module as {text?: RichHeadlineType}).text}
          as="h2"
          size={headingSizeFromBlock(module)}
          fullWidth={module.fullWidth}
          collapseLineBreaksOnMobile={module.collapseLineBreaksOnMobile}
        />
      )
    case 'moduleBody':
      return (
        <p
          className="max-w-3xl font-display text-[1.25rem] font-normal leading-[1.2] tracking-normal md:text-[2rem]"
          style={{color: 'var(--section-body)'}}
        >
          {module.text}
        </p>
      )
    case 'moduleSplit': {
      const hasNewColumns = Boolean(
        module.content?.length || module.left?.length || module.right?.length,
      )

      if (hasNewColumns || module.layout === 1 || module.layout === 2) {
        if (module.layout === 1) {
          return <SplitColumn modules={module.content} />
        }
        return (
          <div className="grid gap-8 md:grid-cols-2 md:gap-16">
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
            collapseLineBreaksOnMobile={module.collapseLineBreaksOnMobile}
          />
          <div className="space-y-6">
            {module.rightType === 'body' && module.body && (
              <p className="font-display text-[1.25rem] font-normal leading-[1.2] tracking-normal md:text-[2rem]">
                {module.body}
              </p>
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
      const columns = Math.min(Math.max(steps.length, 1), 3) as 1 | 2 | 3
      const columnClass = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
      }[columns]

      return (
        <ol className={cn('grid gap-10', columnClass)}>
          {steps.map((step, i) => (
            <li key={step.text ?? i} className="flex flex-col gap-5 text-brand-charcoal">
              <span
                aria-hidden
                className="flex size-10 items-center justify-center rounded-full border border-brand-charcoal font-sans text-base font-normal leading-none"
              >
                {i + 1}
              </span>
              <p className="font-display text-[1.25rem] font-normal leading-[1.2] tracking-normal md:text-[2rem]">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      )
    }
    case 'moduleButton':
      return <CmsButton button={module.button} />
    default:
      return null
  }
}
