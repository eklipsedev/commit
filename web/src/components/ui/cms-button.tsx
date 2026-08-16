'use client'

import Link from 'next/link'
import {cn} from '@/lib/cn'
import {buttonHoverTextHex, colorHex} from '@/lib/colors'
import {resolveLinkHref} from '@/lib/links'
import type {ButtonValue} from '@/sanity/types'

type CmsButtonProps = {
  button?: ButtonValue | null
  className?: string
  onClick?: () => void
}

/**
 * Site button: transparent outline at rest, filled on hover.
 * Nav uses DotButton separately — not via this component.
 */
export function CmsButton({button, className, onClick}: CmsButtonProps) {
  if (!button?.label) return null

  const href = resolveLinkHref(button.link)
  const restText = colorHex(button.textColor, 'charcoal')
  const hoverBg = colorHex(
    button.hoverBackgroundColor ?? button.backgroundColor,
    'charcoal',
  )
  const hoverText = buttonHoverTextHex(button)

  const classes = cn(
    'inline-flex items-center justify-center rounded-full border px-7 py-2 text-sm font-medium transition-colors',
    'bg-transparent [color:var(--btn-rest)] [border-color:var(--btn-rest)]',
    'hover:[background-color:var(--btn-hover-bg)] hover:[color:var(--btn-hover-text)] hover:[border-color:var(--btn-hover-bg)]',
    'focus-visible:outline-none focus-visible:[background-color:var(--btn-hover-bg)] focus-visible:[color:var(--btn-hover-text)] focus-visible:[border-color:var(--btn-hover-bg)]',
    className,
  )

  const style = {
    '--btn-rest': restText,
    '--btn-hover-bg': hoverBg,
    '--btn-hover-text': hoverText,
  } as React.CSSProperties

  if (href && !onClick) {
    const external = button.link?.linkType === 'external' && button.link.openInNewTab
    return (
      <Link
        href={href}
        className={classes}
        style={style}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {button.label}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} style={style} onClick={onClick}>
      {button.label}
    </button>
  )
}
