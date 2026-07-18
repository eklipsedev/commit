import {cn} from '@/lib/cn'
import {CmsButton} from '@/components/ui/cms-button'
import {RichHeadline} from '@/components/ui/rich-headline'
import {Tagline} from '@/components/ui/tagline'
import {headingSizeFromBlock} from '@/lib/heading-styles'
import type {ButtonValue, RichHeadline as RichHeadlineType} from '@/sanity/types'

type TextGridGroup = {
  title?: string
  items?: string[]
}

type TextGrid = {
  columns?: number
  groups?: TextGridGroup[]
}

type DetailAttributes = {
  label?: string
  attributes?: {label?: string; values?: string[]}[]
}

type CustomModule = {
  _key?: string
  _type?: string
  text?: string
  button?: ButtonValue
  buttonPlacement?: 'beside' | 'below'
  columns?: number
  items?: string[]
  groups?: TextGridGroup[]
  label?: string
  showRules?: boolean
  steps?: {text?: string}[]
  headline?: RichHeadlineType
  headingSize?: string
  fullWidth?: boolean
  rightType?: 'body' | 'list' | 'textGrid'
  body?: string
  listItems?: string[]
  listColumns?: number
  textGrid?: TextGrid
  attributes?: {label?: string; values?: string[]}[]
}

function TextGridView({grid}: {grid?: TextGrid}) {
  if (!grid?.groups?.length) return null
  const cols = grid.columns ?? 2
  return (
    <div
      className={cn(
        'grid gap-8',
        cols === 2 && 'md:grid-cols-2',
        cols === 3 && 'md:grid-cols-3',
        cols === 4 && 'md:grid-cols-4',
      )}
    >
      {grid.groups.map((group, i) => (
        <div key={group.title ?? i} className="space-y-3">
          {group.title && (
            <p className="font-mono text-xs tracking-normal text-brand-charcoal">{group.title}</p>
          )}
          <ul className="space-y-2 text-sm leading-relaxed md:text-base">
            {group.items?.map((item, j) => (
              <li key={`${item}-${j}`}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function DetailAttributesView({details}: {details?: DetailAttributes}) {
  if (!details?.attributes?.length) return null
  return (
    <div className="space-y-6 border-t border-current/15 pt-8">
      {details.label && (
        <p className="font-mono text-xs tracking-normal text-brand-charcoal">{details.label}</p>
      )}
      <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {details.attributes.map((attr) => (
          <div key={attr.label}>
            <dt className="font-mono text-xs tracking-normal text-brand-charcoal">{attr.label}</dt>
            <dd className="mt-2 space-y-1 text-sm md:text-base">
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
  showRules,
  className,
}: {
  label?: string
  items?: string[]
  columns?: number
  showRules?: boolean
  className?: string
}) {
  if (!items?.length) return null
  return (
    <div className={cn('space-y-4', className)}>
      {label && <p className="font-mono text-xs uppercase tracking-wide">{label}</p>}
      <ul
        className={cn(
          'grid gap-x-10 gap-y-2',
          showRules && 'gap-y-0 divide-y divide-current/15 border-t border-current/15',
          columns === 2 && 'sm:grid-cols-2',
          columns === 3 && 'sm:grid-cols-2 md:grid-cols-3',
        )}
      >
        {items.map((item, i) => (
          <li
            key={`${item}-${i}`}
            className={cn(
              // Bloyd / 20px / 120%
              'font-display text-[1.25rem] font-normal leading-[1.2]',
              showRules && 'py-3',
            )}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
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
        />
      )
    case 'moduleBody':
      return (
        <p className="max-w-3xl text-base leading-relaxed md:text-lg" style={{color: 'var(--section-body)'}}>
          {module.text}
        </p>
      )
    case 'moduleSplit':
      return (
        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          <RichHeadline
            value={module.headline}
            as="h2"
            size={headingSizeFromBlock(module)}
          />
          <div className="space-y-6">
            {module.rightType === 'body' && module.body && (
              <p className="text-base leading-relaxed md:text-lg">{module.body}</p>
            )}
            {module.rightType === 'list' && (
              <StringListView items={module.listItems} columns={module.listColumns} showRules />
            )}
            {module.rightType === 'textGrid' && <TextGridView grid={module.textGrid} />}
            {module.button && <CmsButton button={module.button} />}
          </div>
        </div>
      )
    case 'textGrid':
      return <TextGridView grid={module as unknown as TextGrid} />
    case 'moduleStringList': {
      const placement = module.buttonPlacement ?? 'below'
      const list = (
        <StringListView
          label={module.label}
          items={module.items}
          columns={module.columns}
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
    case 'moduleSteps':
      return (
        <ol className="space-y-4">
          {module.steps?.map((step, i) => (
            <li key={step.text ?? i} className="flex gap-4 text-base md:text-lg">
              <span className="font-mono text-sm text-brand-charcoal">{String(i + 1).padStart(2, '0')}</span>
              <span>{step.text}</span>
            </li>
          ))}
        </ol>
      )
    case 'moduleButton':
      return <CmsButton button={module.button} />
    default:
      return null
  }
}
