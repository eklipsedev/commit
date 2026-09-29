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
    initialValue?: string
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
    initialValue: options?.initialValue,
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
 * Toggle the horizontal rule under a tagline. On by default.
 * `textKey` is the parent field that holds the tagline string (`tagline` or `text`).
 */
export function showTaglineRuleField(options?: {
  group?: string
  textKey?: string
}) {
  const textKey = options?.textKey ?? 'tagline'
  return defineField({
    name: 'showTaglineRule',
    title: 'Show tagline rule',
    type: 'boolean',
    initialValue: true,
    description: 'When off, the line under the tagline is hidden.',
    hidden: ({parent}) => !parent?.[textKey],
    group: options?.group,
  })
}

/**
 * Shared heading size for sections that use tagline + divider + heading.
 * Default tokens: Large 64px (`lg`), Mid 32px (`h3`), Medium 32px desktop / 24px mobile (`md`).
 * Flexible headlines use Large 64px, Medium 48px (`h3`), Small 40px (`40`), Extra small 32px (`32`).
 */
export function headingSizeField(options?: {
  group?: string
  initialValue?: 'lg' | 'h3' | 'md' | '40' | '32'
  /** Flexible headlines: Large 64px, Medium 48px, Small 40px, Extra small 32px. */
  variant?: 'default' | 'flexible'
  hidden?: (ctx: {parent?: Record<string, unknown>}) => boolean
}) {
  const flexible = options?.variant === 'flexible'
  return defineField({
    name: 'headingSize',
    title: 'Heading size',
    type: 'string',
    options: {
      list: flexible
        ? [
            {title: 'Large — 64px', value: 'lg'},
            {title: 'Medium — 48px', value: 'h3'},
            {title: 'Small — 40px', value: '40'},
            {title: 'Extra small — 32px', value: '32'},
          ]
        : [
            {title: 'Large — 64px', value: 'lg'},
            {title: 'Mid — 32px', value: 'h3'},
            {title: 'Medium — 32px (24px mobile)', value: 'md'},
          ],
      layout: 'radio',
    },
    initialValue: options?.initialValue ?? (flexible ? '32' : 'md'),
    description: flexible
      ? 'Large 64px, medium 48px, small 40px, or extra small 32px.'
      : 'Large for short display lines. Mid for mid-length headlines. Medium for denser section copy.',
    group: options?.group,
    hidden: options?.hidden,
  })
}

/**
 * Sans (Bloyd) vs Display (LustText) for section headlines.
 * Default Sans for most sections; CTA opts into Display via initialValue.
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

/** Off = a set max width (narrower for Mid). On = span the full content width. */
export function fullWidthHeadlineField(options?: {group?: string}) {
  return defineField({
    name: 'fullWidth',
    title: 'Full width',
    type: 'boolean',
    initialValue: false,
    description: 'Off = a set max width (Mid is a bit narrower). On = span the full content width.',
    group: options?.group,
  })
}

/** Pin the headline block left (default) or right within the section. */
export function headlineAlignField(options?: {group?: string}) {
  return defineField({
    name: 'textAlign',
    title: 'Position',
    type: 'string',
    options: {
      list: [
        {title: 'Left', value: 'left'},
        {title: 'Right', value: 'right'},
      ],
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: 'left',
    description:
      'Place the headline on the left or right. The block shrinks to the text, up to the max width, so it sits on that edge.',
    group: options?.group,
  })
}

/** Studio preview label for headingSize values. */
export function headingSizeLabel(size?: string | null, variant?: 'default' | 'flexible') {
  if (variant === 'flexible') {
    if (size === 'lg') return 'Large — 64px'
    if (size === 'h3') return 'Medium — 48px'
    if (size === '40') return 'Small — 40px'
    return 'Extra small — 32px'
  }
  if (size === 'lg') return 'Large'
  if (size === 'h3') return 'Mid'
  if (size === '32') return 'Small — 32px'
  return 'Medium'
}

export function headingFontLabel(font?: string | null) {
  if (font === 'display') return 'Display'
  return 'Sans'
}

export function headlineAlignLabel(align?: string | null) {
  if (align === 'right') return 'Right'
  return 'Left'
}
