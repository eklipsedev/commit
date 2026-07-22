import {defineField} from 'sanity'
import {BRAND_COLORS} from '../../lib/brand-colors'
import {BrandColorInput} from '../../components/brand-color-input'

/** Collapsible fieldset for tucking brand color overrides away (like Link on buttons). */
export const COLORS_FIELDSET = {
  name: 'colors',
  title: 'Colors',
  options: {
    collapsible: true,
    collapsed: true,
  },
} as const

/** Brand palette select — stores token name, not hex. */
export function brandColorField(
  name: string,
  title: string,
  options?: {
    description?: string
    required?: boolean
    group?: string
    fieldset?: string
  },
) {
  return defineField({
    name,
    title,
    type: 'string',
    description: options?.description,
    options: {
      list: BRAND_COLORS.map((color) => ({
        title: color.title,
        value: color.value,
      })),
      layout: 'dropdown',
    },
    components: {
      input: BrandColorInput,
    },
    validation: options?.required ? (rule) => rule.required() : undefined,
    group: options?.group,
    fieldset: options?.fieldset,
  })
}

export const sectionSpacingFields = [
  defineField({
    name: 'collapsePaddingTop',
    title: 'Collapse top padding',
    type: 'boolean',
    initialValue: false,
  }),
  defineField({
    name: 'collapsePaddingBottom',
    title: 'Collapse bottom padding',
    type: 'boolean',
    initialValue: false,
  }),
]

export const sectionColorFields = [
  brandColorField('backgroundColor', 'Background color'),
  brandColorField('headingColor', 'Heading color'),
  brandColorField('bodyColor', 'Body color'),
  brandColorField('accentColor', 'Accent color'),
]

/**
 * When enabled, CMS Enter line breaks only apply from `md` up.
 * On mobile the copy flows as a continuous paragraph.
 */
export function collapseLineBreaksOnMobileField(options?: {
  group?: string
  hidden?: (ctx: {parent?: Record<string, unknown>}) => boolean
}) {
  return defineField({
    name: 'collapseLineBreaksOnMobile',
    title: 'Collapse line breaks on mobile',
    type: 'boolean',
    initialValue: false,
    description:
      'Keep desktop line breaks from Enter, but let the text reflow without those breaks on small screens.',
    group: options?.group,
    hidden: options?.hidden,
  })
}

/**
 * Shared heading size for sections that use tagline + divider + heading.
 * Frontend tokens: Large 72px (`lg`), Mid 48→32 (`h3`), Medium 32→24 (`md`).
 */
export function headingSizeField(options?: {
  group?: string
  initialValue?: 'lg' | 'h3' | 'md'
  hidden?: (ctx: {parent?: Record<string, unknown>}) => boolean
}) {
  return defineField({
    name: 'headingSize',
    title: 'Heading size',
    type: 'string',
    options: {
      list: [
        {title: 'Large — 72px', value: 'lg'},
        {title: 'Mid — 48px (32px mobile)', value: 'h3'},
        {title: 'Medium — 32px (24px mobile)', value: 'md'},
      ],
      layout: 'radio',
    },
    initialValue: options?.initialValue ?? 'md',
    description: 'Large for short display lines. Mid for mid-length headlines. Medium for denser section copy.',
    group: options?.group,
    hidden: options?.hidden,
  })
}

/**
 * Sans (Bloyd) vs Display (LustText) for section headlines.
 * Default Sans — most section / CTA copy. Display for more expressive lines.
 */
export function headingFontField(options?: {
  group?: string
  initialValue?: 'sans' | 'display'
  hidden?: (ctx: {parent?: Record<string, unknown>}) => boolean
}) {
  return defineField({
    name: 'headingFont',
    title: 'Heading font',
    type: 'string',
    options: {
      list: [
        {title: 'Sans — Bloyd', value: 'sans'},
        {title: 'Display — LustText', value: 'display'},
      ],
      layout: 'radio',
    },
    initialValue: options?.initialValue ?? 'sans',
    description: 'Sans for most section copy. Display for more expressive headlines.',
    group: options?.group,
    hidden: options?.hidden,
  })
}

/** Studio preview label for headingSize values. */
export function headingSizeLabel(size?: string | null) {
  if (size === 'lg') return 'Large'
  if (size === 'h3') return 'Mid'
  return 'Medium'
}

export function headingFontLabel(font?: string | null) {
  if (font === 'display') return 'Display'
  return 'Sans'
}
