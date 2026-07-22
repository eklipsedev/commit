/**
 * Commit heading scale (from Figma).
 *
 * | Token  | Size              | Line height | Letter spacing | Default tag |
 * |--------|-------------------|-------------|----------------|-------------|
 * | hero   | 9rem (144px)      | 96%         | -3%            | h1          |
 * | xl     | 5.6875rem (91px)  | 100%        | -2%            | h1          |
 * | lg     | 4.5rem (72px)     | 110%        | -2%            | h2          |
 * | h3     | 3rem (48px) desktop / 2rem mobile | 110% / 120% | 0%             | h3          |
 * | md     | 2rem (32px) desktop / 1.5rem mobile | 120%      | 0%             | h2 / h5     |
 *
 * Font family is separate: Sans (Bloyd) vs Display (LustText / Lora stand-in).
 */

import {stegaClean} from 'next-sanity'

export const HEADING_SIZES = ['hero', 'xl', 'lg', 'h3', 'md'] as const
export type HeadingSize = (typeof HEADING_SIZES)[number]

export const HEADING_FONTS = ['sans', 'display'] as const
export type HeadingFont = (typeof HEADING_FONTS)[number]

/** @deprecated Use `md` — kept as alias for older call sites */
export type LegacyHeadingSize = HeadingSize | 'section'

export function resolveHeadingSize(size?: LegacyHeadingSize | null): HeadingSize {
  const cleaned =
    typeof size === 'string' ? (stegaClean(size) as LegacyHeadingSize) : size

  if (cleaned === 'section') return 'md'
  if (cleaned === 'hero' || cleaned === 'xl' || cleaned === 'lg' || cleaned === 'h3' || cleaned === 'md') {
    return cleaned
  }
  return 'md'
}

export function resolveHeadingFont(
  font?: string | null,
  size?: HeadingSize,
): HeadingFont {
  const cleaned = typeof font === 'string' ? stegaClean(font) : font
  if (cleaned === 'sans' || cleaned === 'display') return cleaned
  // Page heroes / case study titles default to display; section copy to sans.
  if (size === 'hero' || size === 'xl') return 'display'
  return 'sans'
}

/** Prefer `headingSize`, fall back to legacy CTA `headlineSize`. */
export function headingSizeFromBlock(
  block?: {headingSize?: string | null; headlineSize?: string | null} | null,
  fallback: HeadingSize = 'md',
) {
  return resolveHeadingSize(
    (block?.headingSize ?? block?.headlineSize ?? fallback) as LegacyHeadingSize,
  )
}

export function headingFontFromBlock(
  block?: {headingFont?: string | null} | null,
  size?: HeadingSize,
) {
  return resolveHeadingFont(block?.headingFont, size)
}

export const HEADING_FONT_CLASSES: Record<HeadingFont, string> = {
  sans: 'font-sans',
  display: 'font-display',
}

/**
 * Shared content scale (lists / attributes / module body — always Sans):
 * Large  48→32 · Medium 32→24 · Small 20→20
 */
export const TEXT_SIZE_CLASSES = {
  lg: 'font-sans text-[2rem] font-normal leading-[1.2] tracking-normal md:text-[3rem] md:leading-[1.1]',
  md: 'font-sans text-[1.5rem] font-normal leading-[1.2] tracking-normal md:text-[2rem]',
  sm: 'font-sans text-[1.25rem] font-normal leading-[1.2] tracking-normal',
} as const

/** Size metrics only — pair with `HEADING_FONT_CLASSES` via `headingClassName`. */
export const HEADING_SIZE_CLASSES: Record<HeadingSize, string> = {
  hero: 'text-[clamp(3.5rem,12vw,9rem)] font-normal leading-[0.96] tracking-[-0.03em] [hanging-punctuation:first_last]',
  xl: 'text-[clamp(2.75rem,7vw,5.6875rem)] font-normal leading-none tracking-[-0.02em]',
  lg: 'text-[clamp(2.25rem,5vw,4.5rem)] font-normal leading-[1.1] tracking-[-0.02em]',
  h3: 'text-[2rem] font-normal leading-[1.2] tracking-normal md:text-[3rem] md:leading-[1.1]',
  md: 'text-[1.5rem] font-normal leading-[1.2] tracking-normal md:text-[2rem]',
}

export function headingClassName(size: HeadingSize, font?: HeadingFont | string | null) {
  const resolvedFont = resolveHeadingFont(font, size)
  return `${HEADING_FONT_CLASSES[resolvedFont]} ${HEADING_SIZE_CLASSES[size]}`
}

export const HEADING_DEFAULT_TAG: Record<HeadingSize, 'h1' | 'h2' | 'h3' | 'h5'> = {
  hero: 'h1',
  xl: 'h1',
  lg: 'h2',
  h3: 'h3',
  md: 'h2',
}

export const HEADING_SIZE_OPTIONS = [
  {title: 'Large — 72px', value: 'lg'},
  {title: 'Mid — 48px (32px mobile)', value: 'h3'},
  {title: 'Medium — 32px (24px mobile)', value: 'md'},
] as const
