import {stegaClean} from 'next-sanity'
import {colorHex} from '@/lib/colors'

/** Shared with IntroLoader (keep in sync). */
export const INTRO_STORAGE_KEY = 'commit-intro-seen'

/** Curves behind the Studio's "Movement easing" presets. */
const INTRO_EASINGS = {
  smooth: 'cubic-bezier(0.65, 0, 0.35, 1)',
  gentle: 'cubic-bezier(0.37, 0, 0.63, 1)',
  expressive: 'cubic-bezier(0.77, 0, 0.18, 1)',
  glide: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const

export type IntroSettingsDoc = {
  enabled?: boolean | null
  frequency?: 'session' | 'always' | null
  easing?: keyof typeof INTRO_EASINGS | null
  backgroundColor?: string | null
  holdMs?: number | null
  moveMs?: number | null
  periodMs?: number | null
  fadeMs?: number | null
}

export type IntroConfig = {
  enabled: boolean
  playEveryLoad: boolean
  moveEase: string
  background: string
  holdMs: number
  moveMs: number
  periodMs: number
  fadeMs: number
}

function duration(value: number | null | undefined, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(3000, Math.max(0, Math.round(value)))
    : fallback
}

/**
 * Studio "Intro animation" settings → values the loader can use.
 * No settings document means no intro, so the site never shows a half-configured one.
 */
export function resolveIntroConfig(doc?: IntroSettingsDoc | null): IntroConfig {
  const easing = stegaClean(doc?.easing) as keyof typeof INTRO_EASINGS | undefined
  return {
    enabled: doc?.enabled === true,
    playEveryLoad: stegaClean(doc?.frequency) === 'always',
    moveEase: INTRO_EASINGS[easing ?? 'smooth'] ?? INTRO_EASINGS.smooth,
    background: colorHex(doc?.backgroundColor, 'pale-yellow'),
    holdMs: duration(doc?.holdMs, 560),
    moveMs: duration(doc?.moveMs, 900),
    periodMs: duration(doc?.periodMs, 540),
    fadeMs: duration(doc?.fadeMs, 360),
  }
}

/**
 * Runs before first paint: returning visitors (intro already seen this session)
 * skip the yellow cover instead of flashing it until React hydrates.
 */
export function introSeenScript() {
  return `try{if(sessionStorage.getItem(${JSON.stringify(INTRO_STORAGE_KEY)})==='1'){document.documentElement.classList.remove('intro-pending')}}catch(e){}`
}
