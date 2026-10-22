/**
 * Vertical rhythm for stacked custom modules (page sections + overlays).
 * Tight after a tagline (rule → headline/list); looser between larger blocks
 * (e.g. big text → next tagline like “Our capabilities”).
 */
export function moduleStackGapClass(options: {
  tightToPrev?: boolean
  /** Paragraph straight under a headline reads as its intro, so it sits closer. */
  introToPrev?: boolean
  /** Block after that intro paragraph — a little closer than a full section gap. */
  afterIntro?: boolean
  /** Nested split columns use a slightly smaller open gap. */
  nested?: boolean
}) {
  if (options.tightToPrev) return 'mt-7 md:mt-8'
  if (options.introToPrev) return 'mt-6 md:mt-8'
  if (options.afterIntro) return 'mt-9 md:mt-12'
  if (options.nested) return 'mt-8 md:mt-10'
  return 'mt-12 md:mt-16'
}
