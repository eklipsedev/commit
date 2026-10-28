'use client'

import {useLayoutEffect, useRef, useState} from 'react'
import {CommitWordmark} from '@/components/brand/commit-wordmark'
import {INTRO_STORAGE_KEY, type IntroConfig} from '@/components/layout/intro-bootstrap'
import {useIntroLogo} from '@/components/layout/intro-logo-context'
import {cn} from '@/lib/cn'

/** Logo fades and rises onto the background. */
const ENTER_MS = 520
/** Background stays up after the logo lands, then dissolves. */
const BACKDROP_HOLD_MS = 80

const ENTER_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const PERIOD_EASE = 'cubic-bezier(0.33, 1, 0.68, 1)'
const FADE_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

type Phase = 'enter' | 'morph' | 'fade' | 'done'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * First-visit session intro: full-screen color with COMMIT. wordmark,
 * then morphs into the navbar logo slot and fades away.
 *
 * The color field is up on first paint. The wordmark fades in, then eases
 * into the navbar while its period turns yellow. Timing, easing, and color
 * come from the Studio's "Intro animation" settings.
 */
export function IntroLoader({config}: {config: IntroConfig}) {
  const {playEveryLoad, holdMs, moveMs, periodMs, fadeMs, moveEase, background} = config
  const {logoRef, setIntroActive} = useIntroLogo()
  const [phase, setPhase] = useState<Phase>('enter')
  const [revealed, setRevealed] = useState(false)
  const [transform, setTransform] = useState('translate3d(0, 0, 0) scale(1)')
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])

  useLayoutEffect(() => {
    let seen = false
    if (!playEveryLoad) {
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
      if (!playEveryLoad) {
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

    const morphAt = ENTER_MS + holdMs
    const fadeAt = morphAt + moveMs + BACKDROP_HOLD_MS

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

    const doneTimer = window.setTimeout(finish, fadeAt + fadeMs)
    timers.current.push(revealFrame, morphTimer, fadeTimer, doneTimer)

    return () => {
      window.cancelAnimationFrame(revealFrame)
      timers.current.forEach((id) => {
        window.clearTimeout(id)
        window.cancelAnimationFrame(id)
      })
      timers.current = []
    }
  }, [logoRef, setIntroActive, playEveryLoad, holdMs, moveMs, fadeMs])

  if (phase === 'done') return null

  const fading = phase === 'fade'
  const traveling = phase === 'morph' || phase === 'fade'
  const wordmarkTransform = traveling
    ? transform
    : revealed
      ? 'translate3d(0, 0, 0) scale(1)'
      : 'translate3d(0, 18px, 0) scale(0.985)'

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-start justify-center px-6 pt-[10vh] md:px-10',
        fading ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
      style={{
        backgroundColor: background,
        transition: `opacity ${fadeMs}ms ${FADE_EASE}`,
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
          transitionDuration: `${ENTER_MS}ms, ${traveling ? moveMs : ENTER_MS}ms`,
          transitionTimingFunction: traveling
            ? `${ENTER_EASE}, ${moveEase}`
            : `${ENTER_EASE}, ${ENTER_EASE}`,
        }}
      >
        <CommitWordmark
          className="h-auto w-[calc(100vw-3rem)] max-w-[80rem] md:w-[calc(100vw-5rem)]"
          periodStyle={{
            fill: traveling ? 'var(--brand-yellow)' : 'var(--brand-charcoal)',
            transition: `fill ${periodMs}ms ${PERIOD_EASE}`,
          }}
        />
      </div>
    </div>
  )
}
