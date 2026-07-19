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

function createComponents(
  size: HeadingSize,
  collapseLineBreaksOnMobile: boolean,
): PortableTextComponents {
  return {
    block: {
      // Each Studio Enter creates a new block — render as lines, not inline spans.
      // On mobile with collapse enabled, lines flow inline with a separating space.
      normal: ({children}) => (
        <span
          className={cn(
            HEADING_SIZE_CLASSES[size],
            'text-[var(--section-heading,var(--foreground))]',
            collapseLineBreaksOnMobile ? 'inline md:block' : 'block',
          )}
        >
          {children}
          {collapseLineBreaksOnMobile ? (
            <span className="md:hidden" aria-hidden>
              {' '}
            </span>
          ) : null}
        </span>
      ),
    },
    hardBreak: () =>
      collapseLineBreaksOnMobile ? (
        <>
          <span className="md:hidden"> </span>
          <br className="hidden md:block" />
        </>
      ) : (
        <br />
      ),
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
  collapseLineBreaksOnMobile?: boolean
}

export function RichHeadline({
  value,
  className,
  as,
  size = 'md',
  fullWidth = false,
  collapseLineBreaksOnMobile = false,
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
      <PortableText
        value={value}
        components={createComponents(resolved, collapseLineBreaksOnMobile)}
      />
    </Tag>
  )
}
