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
const HOLD_MS = 2000
const MORPH_MS = 900
const FADE_MS = 500

type Phase = 'hold' | 'morph' | 'fade' | 'done'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * First-visit session intro: yellow full-screen with COMMIT. wordmark,
 * then morphs into the navbar logo slot and fades away.
 *
 * Starts in `hold` (not null) so SSR + first paint already cover the page —
 * otherwise content flashes before useLayoutEffect can show the loader.
 */
export function IntroLoader() {
  const {logoRef, setIntroActive} = useIntroLogo()
  const [phase, setPhase] = useState<Phase>('hold')
  const [transform, setTransform] = useState('none')
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
    document.documentElement.style.overflow = 'hidden'

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
      document.documentElement.style.overflow = ''
      setIntroActive(false)
      setPhase('done')
    }

    if (prefersReducedMotion()) {
      // Instant reveal — no motion
      finish()
      return () => {
        document.documentElement.style.overflow = ''
      }
    }

    setPhase('hold')

    const holdTimer = window.setTimeout(() => {
      const from = wordmarkRef.current?.getBoundingClientRect()
      const to = logoRef.current?.getBoundingClientRect()

      if (from && to && from.width > 0 && to.width > 0) {
        const scale = to.width / from.width
        const fromCx = from.left + from.width / 2
        const fromCy = from.top + from.height / 2
        const toCx = to.left + to.width / 2
        const toCy = to.top + to.height / 2
        setTransform(`translate(${toCx - fromCx}px, ${toCy - fromCy}px) scale(${scale})`)
      }

      setPhase('morph')

      const fadeTimer = window.setTimeout(() => {
        // Drop the CSS cover at the same moment the overlay fades, so yellow +
        // wordmark disappear together (otherwise ::before outlives the fade).
        document.documentElement.classList.remove('intro-pending')
        setIntroActive(false)
        setPhase('fade')
        const doneTimer = window.setTimeout(finish, FADE_MS)
        timers.current.push(doneTimer)
      }, MORPH_MS)
      timers.current.push(fadeTimer)
    }, HOLD_MS)
    timers.current.push(holdTimer)

    return () => {
      timers.current.forEach(clearTimeout)
      document.documentElement.style.overflow = ''
    }
  }, [logoRef, setIntroActive])

  if (phase === 'done') return null

  const fading = phase === 'fade'

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-start justify-center bg-brand-pale-yellow pt-[18vh] transition-opacity ease-out md:pt-[20vh]',
        fading ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
      style={{transitionDuration: `${FADE_MS}ms`}}
      aria-hidden={fading}
    >
      <div
        ref={wordmarkRef}
        className="origin-center will-change-transform"
        style={{
          transform,
          transition:
            phase === 'morph' || phase === 'fade'
              ? `transform ${MORPH_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
              : undefined,
        }}
      >
        <CommitWordmark
          className="h-auto w-[min(78vw,42rem)]"
          periodStyle={{
            fill: fading ? 'var(--brand-yellow)' : 'var(--brand-charcoal)',
            transition: `fill ${FADE_MS}ms ease-out`,
          }}
        />
      </div>
    </div>
  )
}
