/**
 * Deep-clone Flexible section template payload into a page-builder `customSection`,
 * regenerating every `_key` so Sanity array items stay unique.
 */

type JsonValue = null | boolean | number | string | JsonObject | JsonValue[]
type JsonObject = {[key: string]: JsonValue}

function newKey() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 12)
  }
  return Math.random().toString(36).slice(2, 14)
}

function cloneValue(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return value.map((item) => {
      const cloned = cloneValue(item)
      if (cloned && typeof cloned === 'object' && !Array.isArray(cloned)) {
        return {...cloned, _key: newKey()}
      }
      return cloned
    })
  }
  if (value && typeof value === 'object') {
    const next: JsonObject = {}
    for (const [key, child] of Object.entries(value)) {
      if (key === '_key') continue
      next[key] = cloneValue(child)
    }
    return next
  }
  return value
}

export type FlexibleSectionTemplateSource = {
  modules?: unknown[]
  collapsePaddingTop?: boolean
  collapsePaddingBottom?: boolean
  backgroundColor?: string | null
  headingColor?: string | null
  bodyColor?: string | null
  taglineColor?: string | null
  accentColor?: string | null
}

/** Fields copied onto a new `customSection` (excludes template metadata). */
export type CustomSectionSeed = {
  _type: 'customSection'
  modules: unknown[]
  collapsePaddingTop?: boolean
  collapsePaddingBottom?: boolean
  backgroundColor?: string | null
  headingColor?: string | null
  bodyColor?: string | null
  taglineColor?: string | null
  accentColor?: string | null
}

export function cloneFlexibleSectionFromTemplate(
  template: FlexibleSectionTemplateSource,
): CustomSectionSeed {
  const modules = cloneValue((template.modules ?? []) as JsonValue) as unknown[]

  const seed: CustomSectionSeed = {
    _type: 'customSection',
    modules,
  }

  if (typeof template.collapsePaddingTop === 'boolean') {
    seed.collapsePaddingTop = template.collapsePaddingTop
  }
  if (typeof template.collapsePaddingBottom === 'boolean') {
    seed.collapsePaddingBottom = template.collapsePaddingBottom
  }
  if (template.backgroundColor != null) seed.backgroundColor = template.backgroundColor
  if (template.headingColor != null) seed.headingColor = template.headingColor
  if (template.bodyColor != null) seed.bodyColor = template.bodyColor
  if (template.taglineColor != null) seed.taglineColor = template.taglineColor
  if (template.accentColor != null) seed.accentColor = template.accentColor

  return seed
}
