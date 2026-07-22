/**
 * Migrate offering overlay `body` + `details` into Flexible-style `modules`.
 *
 * Usage (from studio/):
 *   node --env-file=.env.local scripts/migrate-offering-modules.mjs
 *
 * Safe to re-run: offerings that already have `modules` are skipped.
 */
import {createClient} from '@sanity/client'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '9khzz3db'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-02-01',
  token,
  useCdn: false,
})

function newKey() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12)
}

function convertOverlayModule(module) {
  if (!module || typeof module !== 'object') return null
  const key = newKey()

  if (module._type === 'overlayLabeledList') {
    return {
      _type: 'moduleStringList',
      _key: key,
      label: module.title || undefined,
      items: (module.items ?? []).map((text) => ({
        _type: 'stringListItem',
        _key: newKey(),
        text,
      })),
      columns: 1,
      showRules: false,
    }
  }

  if (module._type === 'overlayStringList') {
    return {
      _type: 'moduleStringList',
      _key: key,
      label: module.label || undefined,
      items: (module.items ?? []).map((text) => ({
        _type: 'stringListItem',
        _key: newKey(),
        text,
      })),
      columns: module.columns ?? 2,
      showRules: false,
    }
  }

  if (module._type === 'overlayText') {
    if (module.style === 'caption') {
      return {
        _type: 'moduleTagline',
        _key: key,
        text: module.text,
      }
    }
    return {
      _type: 'moduleBody',
      _key: key,
      text: module.text,
    }
  }

  return null
}

function convertRow(row) {
  if (!row) return []

  if (row.layout === 'full') {
    return (row.modules ?? []).map(convertOverlayModule).filter(Boolean)
  }

  const left = (row.left ?? []).map(convertOverlayModule).filter(Boolean)
  const right = (row.right ?? []).map(convertOverlayModule).filter(Boolean)
  if (!left.length && !right.length) return []

  return [
    {
      _type: 'moduleSplit',
      _key: newKey(),
      layout: 2,
      left,
      right,
    },
  ]
}

function convertDetails(details) {
  if (!details?.attributes?.length) return null
  return {
    _type: 'detailAttributes',
    _key: newKey(),
    label: details.label || undefined,
    attributes: (details.attributes ?? []).map((attr) => ({
      _type: 'detailAttribute',
      _key: attr._key || newKey(),
      label: attr.label,
      values: attr.values ?? [],
    })),
  }
}

const offerings = await client.fetch(`*[_type == "offering"]{
  _id,
  title,
  modules,
  body,
  details
}`)

let migrated = 0
let skipped = 0

for (const offering of offerings) {
  if (offering.modules?.length) {
    skipped += 1
    continue
  }

  const modules = []
  for (const row of offering.body ?? []) {
    modules.push(...convertRow(row))
  }
  const detailsModule = convertDetails(offering.details)
  if (detailsModule) modules.push(detailsModule)

  if (!modules.length) {
    skipped += 1
    continue
  }

  const id = offering._id
  await client
    .patch(id)
    .set({modules})
    .unset(['body', 'details'])
    .commit({autoGenerateArrayKeys: false})

  console.log(`Migrated ${offering.title || id} → ${modules.length} modules`)
  migrated += 1
}

console.log(`Done. Migrated ${migrated}, skipped ${skipped}.`)
