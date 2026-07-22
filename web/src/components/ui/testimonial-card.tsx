'use client'

import {useEffect, useRef, useState, type CSSProperties, type ReactNode} from 'react'
import {colorHex} from '@/lib/colors'
import {TEXT_SIZE_CLASSES} from '@/lib/heading-styles'
import {SanityImage} from '@/components/ui/sanity-image'
import type {SanityImage as SanityImageType} from '@/sanity/types'

export type TestimonialCardData = {
  quote?: string
  name?: string
  role?: string
  image?: SanityImageType
  backgroundColor?: string | null
  textColor?: string | null
}

type RevealIntensity = 'full' | 'light'

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

const REVEAL = {
  full: {
    duration: 700,
    offset: 16,
    delays: {media: 0, quote: 100, name: 200, role: 280},
  },
  light: {
    duration: 480,
    offset: 12,
    delays: {media: 0, quote: 60, name: 120, role: 170},
  },
} as const

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function StaggerItem({
  show,
  delay,
  duration,
  offset,
  className,
  children,
  style,
}: {
  show: boolean
  delay: number
  duration: number
  offset: number
  className?: string
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translate3d(0, 0, 0)' : `translate3d(0, ${offset}px, 0)`,
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: EASING,
        transitionDelay: show ? `${delay}ms` : '0ms',
        willChange: show ? undefined : 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Remount with a new `key` to replay. Starts hidden, then staggers in. */
function StaggerCopy({
  intensity,
  quote,
  name,
  role,
  instant,
}: {
  intensity: RevealIntensity
  quote?: string
  name?: string
  role?: string
  instant?: boolean
}) {
  const timing = REVEAL[intensity]
  const [show, setShow] = useState(Boolean(instant))

  useEffect(() => {
    if (instant || prefersReducedMotion()) {
      setShow(true)
      return
    }
    setShow(false)
    const id = requestAnimationFrame(() => setShow(true))
    return () => cancelAnimationFrame(id)
  }, [instant])

  return (
    <>
      <StaggerItem
        show={show}
        delay={timing.delays.quote}
        duration={timing.duration}
        offset={timing.offset}
      >
        <blockquote className={TEXT_SIZE_CLASSES.md}>
          “{quote}”
        </blockquote>
      </StaggerItem>
      {(name || role) && (
        <div className="space-y-1 text-base leading-snug">
          {name ? (
            <StaggerItem
              show={show}
              delay={timing.delays.name}
              duration={timing.duration}
              offset={timing.offset}
            >
              <p className="font-medium">{name}</p>
            </StaggerItem>
          ) : null}
          {role ? (
            <StaggerItem
              show={show}
              delay={timing.delays.role}
              duration={timing.duration}
              offset={timing.offset}
            >
              <p className="opacity-90">{role}</p>
            </StaggerItem>
          ) : null}
        </div>
      )}
    </>
  )
}

/**
 * Testimonial card with staggered reveal for photo → quote → name → role.
 * Pass a new `activateToken` whenever this slide becomes current to replay copy.
 */
export function TestimonialCard({
  slide,
  fallbackBackground = 'burnt-orange',
  priority,
  sectionInView = true,
  active = true,
  activateToken = 0,
}: {
  slide: TestimonialCardData
  fallbackBackground?: string
  priority?: boolean
  sectionInView?: boolean
  active?: boolean
  activateToken?: number
}) {
  const bg = colorHex(slide.backgroundColor, fallbackBackground as 'burnt-orange')
  const text = colorHex(slide.textColor, 'white')
  const hasPlayedFull = useRef(false)
  const lastToken = useRef<number | null>(null)
  const intensityRef = useRef<RevealIntensity>('full')
  const [mediaShow, setMediaShow] = useState(false)
  const reduced = prefersReducedMotion()

  // Resolve intensity synchronously when this slide is (re)activated.
  if (sectionInView && active && lastToken.current !== activateToken) {
    intensityRef.current = hasPlayedFull.current ? 'light' : 'full'
    hasPlayedFull.current = true
    lastToken.current = activateToken
  }
  const intensity = intensityRef.current

  useEffect(() => {
    if (reduced) {
      setMediaShow(true)
      return
    }
    if (!sectionInView) {
      setMediaShow(false)
      return
    }
    // After the section is in view, keep photos visible (including off-slides).
    if (!active || intensity === 'light') {
      setMediaShow(true)
      return
    }
    setMediaShow(false)
    const id = requestAnimationFrame(() => setMediaShow(true))
    return () => cancelAnimationFrame(id)
  }, [sectionInView, active, intensity, reduced, activateToken])

  const timing = REVEAL[intensity]

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <StaggerItem
        show={mediaShow}
        delay={timing.delays.media}
        duration={timing.duration}
        offset={timing.offset}
        className="relative aspect-square w-full shrink-0 bg-neutral-100 md:aspect-auto md:w-1/3"
      >
        {slide.image && (
          <SanityImage
            image={slide.image}
            alt={slide.name}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
            priority={priority}
          />
        )}
      </StaggerItem>
      <div
        className="flex flex-1 flex-col justify-between gap-10 p-8 md:p-10 lg:p-12"
        style={{backgroundColor: bg, color: text}}
      >
        {sectionInView ? (
          <StaggerCopy
            key={active ? `active-${activateToken}` : 'idle'}
            intensity={active ? intensity : 'light'}
            quote={slide.quote}
            name={slide.name}
            role={slide.role}
            instant={!active || reduced}
          />
        ) : null}
      </div>
    </div>
  )
}
