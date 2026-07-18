'use client'

import Link from 'next/link'
import {cn} from '@/lib/cn'
import {colorHex} from '@/lib/colors'
import {resolveLinkHref} from '@/lib/links'
import {DotButton} from '@/components/ui/dot-button'
import type {ButtonValue} from '@/sanity/types'

type CmsButtonProps = {
  button?: ButtonValue | null
  className?: string
  onClick?: () => void
  tone?: 'light' | 'dark'
}

export function CmsButton({button, className, onClick, tone}: CmsButtonProps) {
  if (!button?.label) return null

  const variant = button.variant ?? 'primary'
  const href = resolveLinkHref(button.link)

  if (variant === 'dot') {
    return (
      <DotButton button={button} className={className} onClick={onClick} tone={tone} />
    )
  }

  const classes = cn(
    'inline-flex items-center justify-center rounded-full border px-6 py-2.5 text-sm font-medium transition-colors',
    className,
  )

  let style: React.CSSProperties
  let onMouseEnter: React.MouseEventHandler<HTMLElement> | undefined
  let onMouseLeave: React.MouseEventHandler<HTMLElement> | undefined

  if (variant === 'secondary') {
    // Outline: inherit section text color so the button stays visible on
    // light and dark sections. backgroundColor = hover fill (per schema).
    const hoverBg = colorHex(
      button.hoverBackgroundColor ?? button.backgroundColor,
      'charcoal',
    )
    const hoverText = colorHex(button.hoverTextColor, 'white')

    style = {
      backgroundColor: 'transparent',
      color: 'inherit',
      borderColor: 'currentColor',
    }

    onMouseEnter = (e) => {
      e.currentTarget.style.backgroundColor = hoverBg
      e.currentTarget.style.color = hoverText
      e.currentTarget.style.borderColor = hoverBg
    }
    onMouseLeave = (e) => {
      e.currentTarget.style.backgroundColor = 'transparent'
      e.currentTarget.style.color = 'inherit'
      e.currentTarget.style.borderColor = 'currentColor'
    }
  } else {
    const bg = colorHex(button.backgroundColor, 'yellow')
    const text = colorHex(button.textColor, 'charcoal')
    style = {backgroundColor: bg, color: text, borderColor: bg}
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
