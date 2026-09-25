'use client'

import {useLayoutEffect, useRef, useState} from 'react'
import {CommitWordmark} from '@/components/brand/commit-wordmark'
import {
  INTRO_ALWAYS_SHOW_FOR_TESTING,
  INTRO_STORAGE_KEY,
} from '@/components/layout/intro-bootstrap'
import {useIntroLogo} from '@/components/layout/intro-logo-context'
import {cn} from '@/lib/cn'

const ALWAYS_SHOW_FOR_TESTING = INTRO_ALWAYS_SHOW_FOR_TESTING
/** Logo fades and rises onto the yellow field. */
const ENTER_MS = 760
/** Breath after the wordmark settles, before the period turns yellow. */
const REST_MS = 180
/** Charcoal period eases to brand yellow while the mark is still large. */
const PERIOD_MS = 620
const PERIOD_HOLD_MS = 280
/** Travel into the navbar slot. */
const MORPH_MS = 980
/** Yellow stays up after the logo lands, then dissolves. */
const BACKDROP_HOLD_MS = 480
const FADE_MS = 520

const ENTER_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const PERIOD_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const MORPH_EASE = 'cubic-bezier(0.77, 0, 0.18, 1)'
const FADE_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

type Phase = 'enter' | 'accent' | 'morph' | 'fade' | 'done'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * First-visit session intro: yellow full-screen with COMMIT. wordmark,
 * then morphs into the navbar logo slot and fades away.
 *
 * The yellow field is up on first paint. The wordmark fades in, the period
 * turns yellow, then the mark eases into the navbar.
 */
export function IntroLoader() {
  const {logoRef, setIntroActive} = useIntroLogo()
  const [phase, setPhase] = useState<Phase>('enter')
  const [revealed, setRevealed] = useState(false)
  const [transform, setTransform] = useState('translate3d(0, 0, 0) scale(1)')
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])

  useLayoutEffect(() => {
    let seen = false
    if (!ALWAYS_SHOW_FOR_TESTING) {
      try {
        seen = sessionStorage.getItem(INTRO_STORAGE_KEY) === '1'
      } catch {
        seen = false
      }
    }

    if (seen) {
      document.documentElement.classList.remove('intro-pending')
      document.documentElement.classList.add('intro-seen')
      setPhase('done')
      return
    }

    document.documentElement.classList.add('intro-pending')
    document.documentElement.classList.remove('intro-seen')
    setIntroActive(true)

    const finish = () => {
      if (!ALWAYS_SHOW_FOR_TESTING) {
        try {
          sessionStorage.setItem(INTRO_STORAGE_KEY, '1')
        } catch {
          /* ignore */
        }
      }
      document.documentElement.classList.remove('intro-pending')
      document.documentElement.classList.add('intro-seen')
      setIntroActive(false)
      setPhase('done')
    }

    if (prefersReducedMotion()) {
      // Instant reveal — no motion
      finish()
      return
    }

    const revealFrame = window.requestAnimationFrame(() => {
      timers.current.push(
        window.requestAnimationFrame(() => {
          setRevealed(true)
        }),
      )
    })

    const accentAt = ENTER_MS + REST_MS
    const morphAt = accentAt + PERIOD_MS + PERIOD_HOLD_MS
    const fadeAt = morphAt + MORPH_MS + BACKDROP_HOLD_MS

    const accentTimer = window.setTimeout(() => setPhase('accent'), accentAt)

    const morphTimer = window.setTimeout(() => {
      const from = wordmarkRef.current?.getBoundingClientRect()
      const to = logoRef.current?.getBoundingClientRect()

      if (from && to && from.width > 0 && to.width > 0) {
        const scale = to.width / from.width
        const fromCx = from.left + from.width / 2
        const fromCy = from.top + from.height / 2
        const toCx = to.left + to.width / 2
        const toCy = to.top + to.height / 2
        setTransform(
          `translate3d(${toCx - fromCx}px, ${toCy - fromCy}px, 0) scale(${scale})`,
        )
      }

      setPhase('morph')
    }, morphAt)

    const fadeTimer = window.setTimeout(() => {
      // Drop the CSS cover as the overlay fades, so yellow + wordmark
      // disappear together (otherwise ::before outlives the fade).
      document.documentElement.classList.remove('intro-pending')
      setIntroActive(false)
      setPhase('fade')
    }, fadeAt)

    const doneTimer = window.setTimeout(finish, fadeAt + FADE_MS)
    timers.current.push(revealFrame, accentTimer, morphTimer, fadeTimer, doneTimer)

    return () => {
      window.cancelAnimationFrame(revealFrame)
      timers.current.forEach((id) => {
        window.clearTimeout(id)
        window.cancelAnimationFrame(id)
      })
      timers.current = []
    }
  }, [logoRef, setIntroActive])

  if (phase === 'done') return null

  const fading = phase === 'fade'
  const traveling = phase === 'morph' || phase === 'fade'
  const periodYellow = phase === 'accent' || traveling
  const wordmarkTransform = traveling
    ? transform
    : revealed
      ? 'translate3d(0, 0, 0) scale(1)'
      : 'translate3d(0, 18px, 0) scale(0.985)'

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-start justify-center bg-brand-pale-yellow px-6 pt-[10vh] md:px-10',
        fading ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
      style={{
        transition: `opacity ${FADE_MS}ms ${FADE_EASE}`,
      }}
      aria-hidden={fading}
    >
      <div
        ref={wordmarkRef}
        className="origin-center will-change-[transform,opacity]"
        style={{
          opacity: revealed ? 1 : 0,
          transform: wordmarkTransform,
          transitionProperty: 'opacity, transform',
          transitionDuration: `${ENTER_MS}ms, ${traveling ? MORPH_MS : ENTER_MS}ms`,
          transitionTimingFunction: traveling
            ? `${ENTER_EASE}, ${MORPH_EASE}`
            : `${ENTER_EASE}, ${ENTER_EASE}`,
        }}
      >
        <CommitWordmark
          className="h-auto w-[calc(100vw-3rem)] max-w-[80rem] md:w-[calc(100vw-5rem)]"
          periodStyle={{
            fill: periodYellow ? 'var(--brand-yellow)' : 'var(--brand-charcoal)',
            transition: `fill ${PERIOD_MS}ms ${PERIOD_EASE}`,
          }}
        />
      </div>
    </div>
  )
}
