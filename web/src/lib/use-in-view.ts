'use client'

import {useEffect, useRef, useState, type RefObject} from 'react'

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type UseInViewOptions = {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

/**
 * Observes an element and reports when it enters the viewport.
 * Respects `prefers-reduced-motion` (reports visible immediately).
 */
export function useInView<T extends Element = HTMLElement>({
  threshold = 0.12,
  rootMargin = '0px 0px -6% 0px',
  once = true,
}: UseInViewOptions = {}): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
          return
        }
        if (!once) setVisible(false)
      },
      {threshold, rootMargin},
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, visible]
}
