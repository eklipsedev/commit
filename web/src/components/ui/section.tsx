import {cn} from '@/lib/cn'
import {sectionColors} from '@/lib/colors'
import type {SectionStyle} from '@/sanity/types'

type SectionProps = SectionStyle & {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  id?: string
  /** Reserved for future nav theming; not applied to the DOM. */
  navTheme?: 'light' | 'dark'
} & Record<string, unknown>

/**
 * Section shell for page-builder blocks.
 * Accepts a full CMS block via `{...block}` but only applies style fields —
 * content fields (projects, heading, etc.) must not reach the DOM.
 */
export function Section({
  className,
  children,
  collapsePaddingTop,
  collapsePaddingBottom,
  backgroundColor,
  headingColor,
  bodyColor,
  taglineColor,
  accentColor,
  style,
  id,
}: SectionProps) {
  const colors = sectionColors({
    backgroundColor,
    headingColor,
    bodyColor,
    taglineColor,
    accentColor,
  })

  return (
    <section
      id={id}
      className={cn(
        !collapsePaddingTop && 'pt-12 md:pt-16',
        !collapsePaddingBottom && 'pb-12 md:pb-16',
        className,
      )}
      style={
        {
          backgroundColor: colors.background,
          color: colors.body,
          '--section-heading': colors.heading,
          '--section-body': colors.body,
          '--section-tagline': colors.tagline,
          '--section-accent': colors.accent,
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </section>
  )
}
