/**
 * Vertical rhythm for stacked custom modules (page sections + overlays).
 * Tight after a tagline (rule → headline/list); looser between larger blocks
 * (e.g. big text → next tagline like “Our capabilities”).
 */
export function moduleStackGapClass(options: {
  tightToPrev?: boolean
  /** Nested split columns use a slightly smaller open gap. */
  nested?: boolean
}) {
  if (options.tightToPrev) return 'mt-7 md:mt-8'
  if (options.nested) return 'mt-8 md:mt-10'
  return 'mt-12 md:mt-16'
}
