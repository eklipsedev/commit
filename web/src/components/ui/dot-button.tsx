'use client'

import Link from 'next/link'
import {cn} from '@/lib/cn'
import {resolveLinkHref} from '@/lib/links'
import type {ButtonValue} from '@/sanity/types'

type DotButtonProps = {
  /** Visible label. Defaults to “Get Started”. */
  children?: React.ReactNode
  /** Optional CMS button — supplies label + link when present. */
  button?: ButtonValue | null
  href?: string | null
  className?: string
  onClick?: () => void
  /** `light` = charcoal on white; `dark` = white on black. */
  tone?: 'light' | 'dark'
  external?: boolean
}

const transition = 'duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'

/**
 * Pill CTA with a leading yellow dot that slides to the trailing edge on hover.
 * Hover fills the pill yellow and turns the dot white.
 *
 * --inset: border↔dot (outer horizontal padding)
 * --gap: dot↔label (kept equal on both sides when the dot slides)
 * Sized to match site outline buttons (`py-2` / `text-sm`).
 */
export function DotButton({
  children,
  button,
  href: hrefProp,
  className,
  onClick,
  tone = 'light',
  external: externalProp,
}: DotButtonProps) {
  const label = children ?? button?.label ?? 'Get Started'
  if (!label) return null

  const href = hrefProp ?? resolveLinkHref(button?.link)
  const external =
    externalProp ??
    (button?.link?.linkType === 'external' && Boolean(button.link.openInNewTab))

  const classes = cn(
    'group relative inline-flex items-center overflow-hidden rounded-full border',
    'bg-transparent py-2 pl-[var(--inset)] pr-[var(--inset)]',
    'transition-[background-color,border-color,color]',
    transition,
    tone === 'dark'
      ? 'border-white text-white hover:border-brand-yellow hover:bg-brand-yellow hover:text-brand-charcoal'
      : 'border-brand-charcoal text-brand-charcoal hover:border-brand-yellow hover:bg-brand-yellow',
    className,
  )

  const style = {
    '--dot': '14px',
    '--inset': '0.75rem', // 12px — outer padding / border↔dot
    '--gap': '0.5rem', // 8px — dot↔text
  } as React.CSSProperties

  const inner = (
    <>
      {/* Sliding dot — yellow left at rest; white on the right when hovered */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-1/2 size-[var(--dot)] -translate-y-1/2 rounded-full',
          'left-[var(--inset)] bg-brand-yellow',
          'transition-[left,background-color]',
          transition,
          'group-hover:left-[calc(100%-var(--inset)-var(--dot))] group-hover:bg-white',
        )}
      />
      {/* Label reserves (dot + gap) on the active side */}
      <span
        className={cn(
          'relative z-10 whitespace-nowrap text-sm font-medium',
          'pl-[calc(var(--dot)+var(--gap))] pr-0',
          'transition-[padding]',
          transition,
          'group-hover:pl-0 group-hover:pr-[calc(var(--dot)+var(--gap))]',
        )}
      >
        {label}
      </span>
    </>
  )

  if (href && !onClick) {
    return (
      <Link
        href={href}
        className={classes}
        style={style}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} style={style} onClick={onClick}>
      {inner}
    </button>
  )
}
