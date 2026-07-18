import {cn} from '@/lib/cn'
import {
  HEADING_DEFAULT_TAG,
  HEADING_SIZE_CLASSES,
  resolveHeadingSize,
  type LegacyHeadingSize,
} from '@/lib/heading-styles'
import {MultilineText} from '@/components/ui/multiline-text'

type HeadingProps = {
  children?: string | null
  className?: string
  style?: React.CSSProperties
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'div'
  size?: LegacyHeadingSize
}

/** Plain-string / multi-line CMS headings using the shared Commit scale. */
export function Heading({children, className, style, as, size = 'md'}: HeadingProps) {
  if (!children) return null

  const resolved = resolveHeadingSize(size)
  const Tag = as ?? HEADING_DEFAULT_TAG[resolved]

  return (
    <MultilineText
      as={Tag}
      className={cn(HEADING_SIZE_CLASSES[resolved], className)}
      style={style}
    >
      {children}
    </MultilineText>
  )
}
