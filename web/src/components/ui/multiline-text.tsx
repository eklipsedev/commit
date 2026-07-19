import {cn} from '@/lib/cn'

type MultilineTextProps = {
  children?: string | null
  className?: string
  style?: React.CSSProperties
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'span' | 'div'
  /**
   * When true, Enter line breaks only apply from `md` up.
   * On mobile, whitespace collapses so the copy reflows.
   */
  collapseLineBreaksOnMobile?: boolean
}

/**
 * Renders CMS multi-line `text` fields, preserving designer line breaks.
 * In Studio, use a `text` field (textarea) and press Enter for a break.
 */
export function MultilineText({
  children,
  className,
  style,
  as: Tag = 'p',
  collapseLineBreaksOnMobile = false,
}: MultilineTextProps) {
  if (!children) return null
  return (
    <Tag
      className={cn(
        collapseLineBreaksOnMobile
          ? 'whitespace-normal md:whitespace-pre-line'
          : 'whitespace-pre-line',
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  )
}
