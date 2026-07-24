import {PortableText, type PortableTextComponents} from '@portabletext/react'
import Link from 'next/link'
import {cn} from '@/lib/cn'
import {resolveLinkHref, type LinkValue} from '@/lib/links'
import type {PortableTextBlock} from '@portabletext/types'

type LinkAnnotation = LinkValue & {
  /** @deprecated Legacy portable-text links stored only `href` */
  href?: string
  _type?: string
  _key?: string
}

function resolvePortableTextHref(value?: LinkAnnotation | null) {
  if (!value) return null

  // New shared `link` object (internal / external / email / phone)
  if (value.linkType || value.internalLink || value.email || value.phone) {
    return resolveLinkHref(value)
  }

  // Legacy annotation: plain URL string
  return value.href ?? null
}

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => (
      <p className="mb-4 break-words text-base leading-relaxed last:mb-0">{children}</p>
    ),
    h2: ({children}) => (
      <h2 className="mb-4 break-words font-sans text-3xl tracking-tight md:text-4xl">{children}</h2>
    ),
    h3: ({children}) => (
      <h3 className="mb-3 break-words font-sans text-2xl tracking-tight md:text-3xl">{children}</h3>
    ),
  },
  list: {
    bullet: ({children}) => <ul className="mb-4 list-disc space-y-2 pl-5">{children}</ul>,
    number: ({children}) => <ol className="mb-4 list-decimal space-y-2 pl-5">{children}</ol>,
  },
  listItem: {
    bullet: ({children}) => <li className="break-words">{children}</li>,
    number: ({children}) => <li className="break-words">{children}</li>,
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
    link: ({value, children}) => {
      const annotation = value as LinkAnnotation | undefined
      const href = resolvePortableTextHref(annotation)
      if (!href) return <>{children}</>

      const className = 'break-all underline underline-offset-2 [overflow-wrap:anywhere]'
      const external =
        annotation?.linkType === 'external' ||
        (!annotation?.linkType && Boolean(annotation?.href?.startsWith('http')))

      if (external || annotation?.linkType === 'email' || annotation?.linkType === 'phone') {
        return (
          <a
            href={href}
            className={className}
            target={annotation?.openInNewTab ? '_blank' : undefined}
            rel={annotation?.openInNewTab ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        )
      }

      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      )
    },
  },
}

type BodyPortableTextProps = {
  value?: PortableTextBlock[]
  className?: string
}

export function BodyPortableText({value, className}: BodyPortableTextProps) {
  if (!value?.length) return null
  return (
    <div
      className={cn(
        'min-w-0 overflow-x-hidden text-[var(--section-body,var(--foreground))]',
        className,
      )}
    >
      <PortableText value={value} components={components} />
    </div>
  )
}
