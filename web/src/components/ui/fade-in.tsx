'use client'

import {type CSSProperties, type ElementType, type ReactNode} from 'react'
import {cn} from '@/lib/cn'
import {useInView} from '@/lib/use-in-view'

type FadeInProps = {
  children: ReactNode
  className?: string
  /** Element tag to render. Defaults to `div`. */
  as?: ElementType
  /** Extra delay after the element enters view (ms). */
  delay?: number
  /** Transition duration (ms). */
  duration?: number
  /** Starting vertical offset in px (positive = below). */
  offset?: number
  /** IntersectionObserver threshold (0–1). */
  threshold?: number
  /** IntersectionObserver rootMargin. */
  rootMargin?: string
  /** When true, animates only the first time it enters view. */
  once?: boolean
  style?: CSSProperties
}

/**
 * Subtly fades and translates children up as they scroll into view.
 * Reusable across sections; respects `prefers-reduced-motion`.
 */
export function FadeIn({
  children,
  className,
  as: Tag = 'div',
  delay = 0,
  duration = 700,
  offset = 20,
  threshold = 0.12,
  rootMargin = '0px 0px -6% 0px',
  once = true,
  style,
}: FadeInProps) {
  const [ref, visible] = useInView<HTMLElement>({threshold, rootMargin, once})

  return (
    <Tag
      ref={ref}
      className={cn(className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0, 0, 0)' : `translate3d(0, ${offset}px, 0)`,
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: visible ? `${delay}ms` : '0ms',
        willChange: visible ? undefined : 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}
