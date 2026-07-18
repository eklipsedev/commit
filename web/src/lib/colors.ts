import {getBrandColor, type BrandColorToken} from '@/sanity/brand-colors'

const DEFAULTS = {
  background: 'white',
  heading: 'charcoal',
  body: 'charcoal',
  tagline: 'charcoal',
  accent: 'yellow',
} as const satisfies Record<string, BrandColorToken>

export function colorHex(token?: string | null, fallback?: BrandColorToken | string) {
  if (token && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(token)) {
    return token
  }
  if (fallback && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(fallback)) {
    const fromToken = getBrandColor(token)?.hex
    if (fromToken) return fromToken
    return fallback
  }
  const resolved =
    getBrandColor(token)?.hex ?? getBrandColor((fallback as BrandColorToken) ?? DEFAULTS.body)?.hex
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
  return darkTokens.has(token ?? '')
}
