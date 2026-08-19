/**
 * Set How-we-work split rows (steps in the right column) to wide column spacing.
 *
 * Usage (from studio/):
 *   node --env-file=.env.local scripts/set-how-we-work-column-gap.mjs
 */
import {createClient} from '@sanity/client'

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '9khzz3db',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2026-02-01',
  token,
  useCdn: false,
  perspective: 'raw',
})

function markWideSplits(modules) {
  if (!Array.isArray(modules)) return {modules, changed: false}
  let changed = false
  const next = modules.map((mod) => {
    const hasSteps = (mod.right ?? []).some((item) => item._type === 'moduleSteps')
    if (mod?._type === 'moduleSplit' && mod.layout === 2 && hasSteps && mod.columnGap !== 'lg') {
      changed = true
      return {...mod, columnGap: 'lg'}
    }
    return mod
  })
  return {modules: next, changed}
}

const docs = await client.fetch(
  `*[_type in ["page", "homePage", "offering", "flexibleSectionTemplate"]]{
    _id, _type, title, pageBuilder, modules
  }`,
)

let updated = 0
for (const doc of docs) {
  const patches = {}
  if (Array.isArray(doc.modules)) {
    const result = markWideSplits(doc.modules)
    if (result.changed) patches.modules = result.modules
  }
  if (Array.isArray(doc.pageBuilder)) {
    let pageChanged = false
    const pageBuilder = doc.pageBuilder.map((block) => {
      if (block?._type !== 'customSection') return block
      const result = markWideSplits(block.modules)
      if (!result.changed) return block
      pageChanged = true
      return {...block, modules: result.modules}
    })
    if (pageChanged) patches.pageBuilder = pageBuilder
  }
  if (!Object.keys(patches).length) continue
  updated += 1
  console.log(`patch ${doc._type} ${doc.title || doc._id}`)
  await client.patch(doc._id).set(patches).commit({autoGenerateArrayKeys: false})
}

console.log(`Updated ${updated} document(s)`)
