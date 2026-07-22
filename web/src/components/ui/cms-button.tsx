'use client'

import Link from 'next/link'
import {cn} from '@/lib/cn'
import {colorHex} from '@/lib/colors'
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
  const classes = cn(
    'inline-flex items-center justify-center rounded-full border px-6 py-2.5 text-sm font-medium transition-colors',
    className,
  )

  const restText = button.textColor ? colorHex(button.textColor) : undefined
  const hoverBg = colorHex(
    button.hoverBackgroundColor ?? button.backgroundColor,
    'charcoal',
  )
  const hoverText = colorHex(
    button.hoverTextColor ?? button.textColor,
    'charcoal',
  )

  const style: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: restText ?? 'inherit',
    borderColor: restText ?? 'currentColor',
  }

  const onMouseEnter: React.MouseEventHandler<HTMLElement> = (e) => {
    e.currentTarget.style.backgroundColor = hoverBg
    e.currentTarget.style.color = hoverText
    e.currentTarget.style.borderColor = hoverBg
  }

  const onMouseLeave: React.MouseEventHandler<HTMLElement> = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent'
    e.currentTarget.style.color = restText ?? 'inherit'
    e.currentTarget.style.borderColor = restText ?? 'currentColor'
  }

  if (href && !onClick) {
    const external = button.link?.linkType === 'external' && button.link.openInNewTab
    return (
      <Link
        href={href}
        className={classes}
        style={style}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {button.label}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {button.label}
    </button>
  )
}
