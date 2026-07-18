import {PortableText, type PortableTextComponents} from '@portabletext/react'
import {cn} from '@/lib/cn'
import {
  HEADING_DEFAULT_TAG,
  HEADING_SIZE_CLASSES,
  resolveHeadingSize,
  type HeadingSize,
  type LegacyHeadingSize,
} from '@/lib/heading-styles'
import type {RichHeadline} from '@/sanity/types'

function createComponents(size: HeadingSize): PortableTextComponents {
  return {
    block: {
      // Each Studio Enter creates a new block — render as lines, not inline spans.
      normal: ({children}) => (
        <span
          className={cn(
            HEADING_SIZE_CLASSES[size],
            'block text-[var(--section-heading,var(--foreground))]',
          )}
        >
          {children}
        </span>
      ),
    },
    hardBreak: () => <br />,
    marks: {
      em: ({children}) => <em className="italic">{children}</em>,
    },
  }
}

type RichHeadlineProps = {
  value?: RichHeadline
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'div'
  size?: LegacyHeadingSize
  /** When true, spans the full container width. Default is max-w-4xl. */
  fullWidth?: boolean
}

export function RichHeadline({
  value,
  className,
  as,
  size = 'md',
  fullWidth = false,
}: RichHeadlineProps) {
  if (!value?.length) return null

  const resolved = resolveHeadingSize(size)
  const Tag = as ?? HEADING_DEFAULT_TAG[resolved]
  const spanFull = fullWidth || resolved === 'hero'

  return (
    <Tag
      className={cn(
        spanFull ? 'max-w-none' : 'max-w-4xl',
        resolved === 'hero' && '[hanging-punctuation:first_last]',
        className,
      )}
    >
      <PortableText value={value} components={createComponents(resolved)} />
    </Tag>
  )
}
