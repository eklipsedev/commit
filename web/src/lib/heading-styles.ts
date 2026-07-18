/**
 * Commit heading scale (from Figma).
 *
 * | Token  | Size              | Line height | Letter spacing | Default tag |
 * |--------|-------------------|-------------|----------------|-------------|
 * | hero   | 9rem (144px)      | 96%         | -3%            | h1          |
 * | xl     | 5.6875rem (91px)  | 100%        | -2%            | h1          |
 * | lg     | 4.5rem (72px)     | 110%        | -2%            | h2          |
 * | h3     | 3rem (48px)       | 110%        | 0%             | h3          |
 * | md     | 2rem (32px)       | 120%        | 0%             | h2 / h5     |
 */

export const HEADING_SIZES = ['hero', 'xl', 'lg', 'h3', 'md'] as const
export type HeadingSize = (typeof HEADING_SIZES)[number]

/** @deprecated Use `md` — kept as alias for older call sites */
export type LegacyHeadingSize = HeadingSize | 'section'

export function resolveHeadingSize(size?: LegacyHeadingSize | null): HeadingSize {
  if (size === 'section') return 'md'
  if (size === 'hero' || size === 'xl' || size === 'lg' || size === 'h3' || size === 'md') {
    return size
  }
  return 'md'
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

export const HEADING_SIZE_CLASSES: Record<HeadingSize, string> = {
  hero:
    'font-display text-[clamp(3.5rem,12vw,9rem)] font-normal leading-[0.96] tracking-[-0.03em] [hanging-punctuation:first_last]',
  /** Case study project headline — 91px / 100% / -2% */
  xl: 'font-display text-[clamp(2.75rem,7vw,5.6875rem)] font-normal leading-none tracking-[-0.02em]',
  lg: 'font-display text-[clamp(2.25rem,5vw,4.5rem)] font-normal leading-[1.1] tracking-[-0.02em]',
  h3: 'font-display text-[3rem] font-normal leading-[1.1] tracking-normal',
  md: 'font-display text-[2rem] font-normal leading-[1.2] tracking-normal',
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
  {title: 'Mid — 48px', value: 'h3'},
  {title: 'Medium — 32px', value: 'md'},
] as const
