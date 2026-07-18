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
 * Hover fills the pill yellow, matches the border, and turns the dot charcoal.
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
    'group relative inline-flex h-11 items-center overflow-hidden rounded-full border',
    'bg-transparent py-1.5 pl-1.5 pr-5',
    'transition-[background-color,border-color,color]',
    transition,
    tone === 'dark'
      ? 'border-white text-white hover:border-brand-yellow hover:bg-brand-yellow hover:text-brand-charcoal'
      : 'border-brand-charcoal text-brand-charcoal hover:border-brand-yellow hover:bg-brand-yellow',
    className,
  )

  const inner = (
    <>
      {/* Sliding dot — yellow left by default; charcoal on the right when hovered */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-1/2 size-8 -translate-y-1/2 rounded-full',
          'left-1.5 bg-brand-yellow',
          'transition-[left,background-color]',
          transition,
          'group-hover:left-[calc(100%-0.375rem-2rem)] group-hover:bg-brand-charcoal',
        )}
      />
      {/* Label shifts padding so it clears the moving dot */}
      <span
        className={cn(
          'relative z-10 whitespace-nowrap text-sm font-medium',
          'pl-10 pr-1',
          'transition-[padding]',
          transition,
          'group-hover:pl-1 group-hover:pr-10',
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
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {inner}
    </button>
  )
}
