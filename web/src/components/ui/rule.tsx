'use client'

import {type CSSProperties} from 'react'
import {cn} from '@/lib/cn'
import {useInView} from '@/lib/use-in-view'

type RuleProps = {
  className?: string
  /** Extra delay after the element enters view (ms). */
  delay?: number
  /** Draw duration (ms). */
  duration?: number
  /** IntersectionObserver threshold (0–1). */
  threshold?: number
  /** IntersectionObserver rootMargin. */
  rootMargin?: string
  /** When true, animates only the first time it enters view. */
  once?: boolean
  style?: CSSProperties
}

/**
 * Horizontal rule that draws from left → full width when scrolled into view.
 * Use for section taglines; keep navbar rules static.
 */
export function Rule({
  className,
  delay = 0,
  duration = 900,
  threshold = 0.2,
  rootMargin = '0px 0px -4% 0px',
  once = true,
  style,
}: RuleProps) {
  const [ref, visible] = useInView<HTMLHRElement>({threshold, rootMargin, once})

  return (
    <hr
      ref={ref}
      aria-hidden
      className={cn('block border-0 border-t border-current', className)}
      style={{
        width: visible ? '100%' : '0%',
        maxWidth: '100%',
        transitionProperty: 'width',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: visible ? `${delay}ms` : '0ms',
        willChange: visible ? undefined : 'width',
        ...style,
      }}
    />
  )
}