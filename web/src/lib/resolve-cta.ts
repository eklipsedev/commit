import type {ButtonValue, PageBuilderBlock, RichHeadline, SectionStyle} from '@/sanity/types'

export type CtaContent = SectionStyle & {
  tagline?: string
  headline?: RichHeadline
  button?: ButtonValue
  /** @deprecated Prefer blank fields that inherit site defaults */
  useSiteDefault?: boolean
}

function hasHeadline(headline?: RichHeadline | null) {
  return Boolean(headline?.length)
}

function hasButton(button?: ButtonValue | null) {
  return Boolean(button?.label || button?.link)
}

function hasTagline(tagline?: string | null) {
  return Boolean(tagline?.trim())
}

/**
 * Merge site-default copy into page-builder CTA blocks.
 * Blank tagline / headline / button inherit from Default CTA.
 * Legacy `useSiteDefault: true` still forces a full inherit.
 */
export function resolvePageBuilderCtas(
  blocks: PageBuilderBlock[] | undefined,
  defaultCta?: CtaContent | null,
): PageBuilderBlock[] | undefined {
  if (!blocks?.length) return blocks

  return blocks.map((block) => {
    if (block._type !== 'cta') return block
    const cta = block as PageBuilderBlock & CtaContent
    if (!defaultCta) return block

    if (cta.useSiteDefault) {
      return {
        ...block,
        tagline: defaultCta.tagline,
        headline: defaultCta.headline,
        button: defaultCta.button,
      }
    }

    return {
      ...block,
      tagline: hasTagline(cta.tagline) ? cta.tagline : defaultCta.tagline,
      headline: hasHeadline(cta.headline) ? cta.headline : defaultCta.headline,
      button: hasButton(cta.button) ? cta.button : defaultCta.button,
    }
  })
}

/**
 * Projects: `default` uses site CTA, `custom` uses project CTA, `hidden` omits it.
 * Legacy docs without `ctaMode` keep an existing custom CTA when present.
 */
export function resolveProjectCta(
  ctaMode: 'default' | 'custom' | 'hidden' | undefined,
  projectCta: CtaContent | undefined,
  defaultCta: CtaContent | null | undefined,
): CtaContent | null {
  const mode = ctaMode ?? (projectCta?.headline ? 'custom' : 'default')

  if (mode === 'hidden') return null
  if (mode === 'custom') {
    if (!projectCta && !defaultCta) return null
    return {
      ...defaultCta,
      ...projectCta,
      tagline: hasTagline(projectCta?.tagline) ? projectCta?.tagline : defaultCta?.tagline,
      headline: hasHeadline(projectCta?.headline) ? projectCta?.headline : defaultCta?.headline,
      button: hasButton(projectCta?.button) ? projectCta?.button : defaultCta?.button,
    }
  }
  return defaultCta?.headline ? defaultCta : null
}
