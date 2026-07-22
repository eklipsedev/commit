import {CustomModuleRenderer} from '@/components/custom/custom-module-renderer'
import {Heading} from '@/components/ui/heading'
import {cn} from '@/lib/cn'
import {colorHex} from '@/lib/colors'
import {headingClassName, TEXT_SIZE_CLASSES} from '@/lib/heading-styles'
import type {DetailAttributes, OverlayModule, OverlayRow} from '@/sanity/types'
import type {PortableTextBlock} from '@portabletext/types'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import Link from 'next/link'

/** Default overlay string content — Medium scale (24px → 32px). */
const overlayStringClass = TEXT_SIZE_CLASSES.md

function OverlayLabeledList({module}: {module: Extract<OverlayModule, {_type: 'overlayLabeledList'}>}) {
  return (
    <div className="space-y-4">
      {module.title && (
        <p className="font-mono text-xs tracking-normal md:text-sm">{module.title}</p>
      )}
      <ul className="space-y-2">
        {module.items?.map((item, i) => (
          <li key={`${item}-${i}`} className={overlayStringClass}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function OverlayText({module}: {module: Extract<OverlayModule, {_type: 'overlayText'}>}) {
  const isCaption = module.style === 'caption'
  return (
    <p
      className={cn(
        isCaption
          ? 'font-mono text-xs tracking-normal md:text-sm'
          : overlayStringClass,
      )}
    >
      {module.text}
    </p>
  )
}

function OverlayStringList({module}: {module: Extract<OverlayModule, {_type: 'overlayStringList'}>}) {
  const cols = module.columns ?? 2
  return (
    <div className="space-y-4">
      {module.label && (
        <p className="font-mono text-xs tracking-normal md:text-sm">{module.label}</p>
      )}
      <ul
        className={cn(
          'space-y-2',
          cols === 2 && 'md:columns-2 md:gap-8',
          cols === 3 && 'md:columns-3 md:gap-8',
        )}
      >
        {module.items?.map((item, i) => (
          <li key={`${item}-${i}`} className={cn(overlayStringClass, 'break-inside-avoid')}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function OverlayModuleView({module}: {module: OverlayModule}) {
  switch (module._type) {
    case 'overlayLabeledList':
      return <OverlayLabeledList module={module} />
    case 'overlayText':
      return <OverlayText module={module} />
    case 'overlayStringList':
      return <OverlayStringList module={module} />
    default:
      return null
  }
}

function OverlayRowView({row}: {row: OverlayRow}) {
  if (row.layout === 'full') {
    return (
      <div className="space-y-8">
        {row.modules?.map((module) => (
          <OverlayModuleView key={module._key ?? module._type} module={module} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <div className="space-y-8">
        {row.left?.map((module) => (
          <OverlayModuleView key={module._key ?? module._type} module={module} />
        ))}
      </div>
      <div className="space-y-8">
        {row.right?.map((module) => (
          <OverlayModuleView key={module._key ?? module._type} module={module} />
        ))}
      </div>
    </div>
  )
}

function DetailAttributesBlock({details}: {details?: DetailAttributes}) {
  if (!details?.attributes?.length) return null
  const valueClass = details.valueSize === 'md' ? TEXT_SIZE_CLASSES.sm : TEXT_SIZE_CLASSES.md
  return (
    <div className="space-y-6 border-t border-current pt-8">
      {details.label && (
        <p className="font-mono text-xs tracking-normal md:text-sm">{details.label}</p>
      )}
      <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {details.attributes.map((attr) => (
          <div key={attr.label}>
            <dt className="font-mono text-xs tracking-normal md:text-sm">{attr.label}</dt>
            <dd className="mt-2 space-y-1">
              {attr.values?.map((value, i) => (
                <p key={`${value}-${i}`} className={valueClass}>
                  {value}
                </p>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function OfferingOverlayHeader({
  offering,
}: {
  offering: {
    title?: string
    snippet?: string
  }
}) {
  return (
    <div className="space-y-4">
      <Heading size="md" as="h5">
        {offering.title}
      </Heading>
      {offering.snippet && (
        <div className="space-y-4">
          <p className="font-mono text-[1rem] leading-[1.2]">{offering.snippet}</p>
          <hr className="w-full border-0 border-t border-current" />
        </div>
      )}
      {!offering.snippet && <hr className="w-full border-0 border-t border-current" />}
    </div>
  )
}

export function OfferingOverlayBody({
  offering,
}: {
  offering: {
    modules?: {_key?: string; _type?: string; [key: string]: unknown}[]
    body?: OverlayRow[]
    details?: DetailAttributes
  }
}) {
  if (offering.modules?.length) {
    return (
      <div className="flex flex-col">
        {offering.modules.map((module, index) => {
          const prev = offering.modules![index - 1]
          const tightToPrev = prev?._type === 'moduleTagline'
          return (
            <div
              key={module._key ?? `${module._type}-${index}`}
              className={cn(index > 0 && (tightToPrev ? 'mt-7 md:mt-8' : 'mt-10 md:mt-14'))}
            >
              <CustomModuleRenderer module={module} />
            </div>
          )
        })}
      </div>
    )
  }

  // Legacy: overlay rows + trailing attributes
  return (
    <div className="space-y-10">
      {offering.body?.map((row) => (
        <OverlayRowView key={row._key} row={row} />
      ))}
      <DetailAttributesBlock details={offering.details} />
    </div>
  )
}

const personBioComponents: PortableTextComponents = {
  block: {
    normal: ({children}) => (
      <p className={cn(headingClassName('md', 'sans'), 'mb-6 last:mb-0')}>{children}</p>
    ),
    h2: ({children}) => (
      <h2 className={cn(headingClassName('md', 'sans'), 'mb-6 last:mb-0')}>{children}</h2>
    ),
    h3: ({children}) => (
      <h3 className={cn(headingClassName('md', 'sans'), 'mb-6 last:mb-0')}>{children}</h3>
    ),
  },
  list: {
    bullet: ({children}) => (
      <ul className={cn(headingClassName('md', 'sans'), 'mb-6 list-disc space-y-2 pl-6 last:mb-0')}>
        {children}
      </ul>
    ),
    number: ({children}) => (
      <ol className={cn(headingClassName('md', 'sans'), 'mb-6 list-decimal space-y-2 pl-6 last:mb-0')}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({children}) => <li>{children}</li>,
    number: ({children}) => <li>{children}</li>,
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
    link: ({value, children}) => {
      const href = value?.href as string | undefined
      if (!href) return <>{children}</>
      const external = href.startsWith('http')
      return external ? (
        <a
          href={href}
          className="underline underline-offset-2"
          target={value?.openInNewTab ? '_blank' : undefined}
          rel={value?.openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      ) : (
        <Link href={href} className="underline underline-offset-2">
          {children}
        </Link>
      )
    },
  },
}

export function PersonOverlayHeader({
  person,
}: {
  person: {
    name?: string
    role?: string
  }
}) {
  return (
    <div className="space-y-4">
      <Heading size="md" as="h5">
        {person.name}
      </Heading>
      {person.role && (
        <div className="space-y-4">
          <p className="font-mono text-[1rem] leading-[1.2]">{person.role}</p>
          <hr className="w-full border-0 border-t border-current" />
        </div>
      )}
    </div>
  )
}

export function PersonOverlayBody({
  person,
}: {
  person: {
    bio?: PortableTextBlock[]
  }
}) {
  if (!person.bio?.length) return null
  return <PortableText value={person.bio} components={personBioComponents} />
}

export function getOverlayTheme(
  offering?: {cardBackgroundColor?: string; cardHeadingColor?: string} | null,
  person?: {cardHoverBackgroundColor?: string; textColor?: string} | null,
) {
  if (offering) {
    return {
      background: colorHex(offering.cardBackgroundColor, 'yellow'),
      text: colorHex(offering.cardHeadingColor, 'charcoal'),
    }
  }
  if (person) {
    return {
      background: colorHex(person.cardHoverBackgroundColor, 'deep-blue'),
      text: colorHex(person.textColor, 'white'),
    }
  }
  return {
    background: '#FBFAFA',
    text: colorHex('charcoal'),
  }
}
