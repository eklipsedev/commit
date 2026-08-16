import {stegaClean} from 'next-sanity'
import {getBrandColor, type BrandColorToken} from '@/sanity/brand-colors'

const DEFAULTS = {
  background: 'white',
  heading: 'charcoal',
  body: 'charcoal',
  tagline: 'charcoal',
  accent: 'yellow',
} as const satisfies Record<string, BrandColorToken>

function cleanToken(token?: string | null) {
  if (!token) return token
  return typeof token === 'string' ? stegaClean(token) : token
}

export function colorHex(token?: string | null, fallback?: BrandColorToken | string) {
  const cleaned = cleanToken(token)
  const cleanedFallback =
    typeof fallback === 'string' && !fallback.startsWith('#')
      ? (cleanToken(fallback) as BrandColorToken | string)
      : fallback

  if (cleaned && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(cleaned)) {
    return cleaned
  }
  if (
    cleanedFallback &&
    typeof cleanedFallback === 'string' &&
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(cleanedFallback)
  ) {
    const fromToken = getBrandColor(cleaned)?.hex
    if (fromToken) return fromToken
    return cleanedFallback
  }
  const resolved =
    getBrandColor(cleaned)?.hex ??
    getBrandColor((cleanedFallback as BrandColorToken) ?? DEFAULTS.body)?.hex
  return resolved ?? '#303030'
}

export function sectionColors(colors?: {
  backgroundColor?: string | null
  headingColor?: string | null
  bodyColor?: string | null
  taglineColor?: string | null
  accentColor?: string | null
}) {
  return {
    background: colorHex(colors?.backgroundColor, DEFAULTS.background),
    heading: colorHex(colors?.headingColor, DEFAULTS.heading),
    body: colorHex(colors?.bodyColor, DEFAULTS.body),
    tagline: colorHex(colors?.taglineColor, DEFAULTS.tagline),
    accent: colorHex(colors?.accentColor, DEFAULTS.accent),
  }
}

export function isDarkBackground(token?: string | null) {
  const darkTokens = new Set(['charcoal', 'black', 'deep-blue', 'plum', 'brown', 'olive', 'burnt-orange'])
  return darkTokens.has(cleanToken(token) ?? '')
}

/**
 * Resolve outline-button hover label color.
 * Explicit hoverTextColor wins; otherwise dark fills default to white
 * (resting text / charcoal would stay illegible on plum, charcoal, etc.).
 */
export function buttonHoverTextHex(colors?: {
  hoverTextColor?: string | null
  textColor?: string | null
  hoverBackgroundColor?: string | null
  backgroundColor?: string | null
}) {
  const fillToken = colors?.hoverBackgroundColor ?? colors?.backgroundColor
  const darkFill = isDarkBackground(fillToken)
  return colorHex(
    colors?.hoverTextColor ?? (darkFill ? 'white' : colors?.textColor),
    darkFill ? 'white' : 'charcoal',
  )
}
