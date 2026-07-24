/**
 * Migrate Image collage `images` from fixed-slot object → reorderable array.
 *
 * For each slot image, copies existing `alt` into `description` (hover label)
 * so AI Assist can regenerate real accessibility alt text afterward.
 *
 * Usage (from studio/):
 *   pnpm migrate:grid-mixed-images
 *   # or: node --env-file=.env.local scripts/migrate-grid-mixed-images.mjs
 *
 * Safe to re-run: blocks whose `images` is already an array are skipped.
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

const SLOT_ORDER = [
  'topLeft',
  'topRight',
  'leftTall',
  'centerSquare',
  'rightSquare',
  'bottomLeft',
  'bottomWide',
]

function newKey() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12)
}

function slotObjectToArray(images) {
  if (!images || typeof images !== 'object' || Array.isArray(images)) return null

  const items = []
  for (const slot of SLOT_ORDER) {
    const image = images[slot]
    if (!image || typeof image !== 'object') continue
    if (!image.asset) continue

    const alt = typeof image.alt === 'string' ? image.alt : undefined
    items.push({
      ...image,
      _key: image._key || newKey(),
      // Hover label keeps the old short alt; real alt can be AI-generated next.
      description: image.description ?? alt,
      alt,
    })
  }

  return items.length ? items : null
}

function migrateBlocks(blocks) {
  if (!Array.isArray(blocks)) return {blocks, changed: false}

  let changed = false
  const next = blocks.map((block) => {
    if (!block || block._type !== 'gridMixed') return block
    if (Array.isArray(block.images)) return block

    const images = slotObjectToArray(block.images)
    if (!images) return block

    changed = true
    return {...block, images}
  })

  return {blocks: next, changed}
}

const QUERY = `*[
  count((pageBuilder[]._type)[@ == "gridMixed"]) > 0 ||
  count((sections[]._type)[@ == "gridMixed"]) > 0 ||
  count((blocks[]._type)[@ == "gridMixed"]) > 0
]{
  _id,
  _type,
  pageBuilder,
  sections,
  blocks
}`

const docs = await client.fetch(QUERY)
let patched = 0

for (const doc of docs) {
  const set = {}

  for (const field of ['pageBuilder', 'sections', 'blocks']) {
    if (!Array.isArray(doc[field])) continue
    const {blocks, changed} = migrateBlocks(doc[field])
    if (changed) set[field] = blocks
  }

  if (!Object.keys(set).length) continue

  await client.patch(doc._id).set(set).commit({autoGenerateArrayKeys: false})
  patched += 1
  console.log(`Patched ${doc._id} (${doc._type})`)
}

console.log(`Done. Migrated ${patched} document(s).`)
