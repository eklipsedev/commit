import type {ButtonValue, PageBuilderBlock, RichHeadline, SectionStyle} from '@/sanity/types'

export type CtaContent = SectionStyle & {
  tagline?: string
  headline?: RichHeadline
  button?: ButtonValue
  useSiteDefault?: boolean
}

/**
 * Merge site-default copy into page-builder CTA blocks that opted in.
 * Style fields on the block are preserved.
 */
export function resolvePageBuilderCtas(
  blocks: PageBuilderBlock[] | undefined,
  defaultCta?: CtaContent | null,
): PageBuilderBlock[] | undefined {
  if (!blocks?.length) return blocks

  return blocks.map((block) => {
    if (block._type !== 'cta') return block
    const cta = block as PageBuilderBlock & CtaContent
    if (!cta.useSiteDefault || !defaultCta) return block

    return {
      ...block,
      tagline: defaultCta.tagline,
      headline: defaultCta.headline,
      button: defaultCta.button,
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
    return projectCta?.headline ? projectCta : null
  }
  return defaultCta?.headline ? defaultCta : null
}
