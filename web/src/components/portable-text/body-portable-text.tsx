import {PortableText, type PortableTextComponents} from '@portabletext/react'
import Link from 'next/link'
import {cn} from '@/lib/cn'
import type {PortableTextBlock} from '@portabletext/types'

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="mb-4 text-base leading-relaxed last:mb-0">{children}</p>,
    h2: ({children}) => (
      <h2 className="mb-4 font-display text-3xl tracking-tight md:text-4xl">{children}</h2>
    ),
    h3: ({children}) => (
      <h3 className="mb-3 font-display text-2xl tracking-tight md:text-3xl">{children}</h3>
    ),
  },
  list: {
    bullet: ({children}) => <ul className="mb-4 list-disc space-y-2 pl-5">{children}</ul>,
    number: ({children}) => <ol className="mb-4 list-decimal space-y-2 pl-5">{children}</ol>,
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

type BodyPortableTextProps = {
  value?: PortableTextBlock[]
  className?: string
}

export function BodyPortableText({value, className}: BodyPortableTextProps) {
  if (!value?.length) return null
  return (
    <div className={cn('text-[var(--section-body,var(--foreground))]', className)}>
      <PortableText value={value} components={components} />
    </div>
  )
}
