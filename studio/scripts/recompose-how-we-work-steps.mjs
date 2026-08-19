/**
 * Move “How we work” numbered steps into the split-row right column
 * and stack the body under the headline on the left.
 *
 * Usage (from studio/):
 *   node --env-file=.env.local scripts/recompose-how-we-work-steps.mjs
 *   node --env-file=.env.local scripts/recompose-how-we-work-steps.mjs --dry-run
 */
import {createClient} from '@sanity/client'

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN')
  process.exit(1)
}

const dryRun = process.argv.includes('--dry-run')
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '9khzz3db',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2026-02-01',
  token,
  useCdn: false,
  perspective: 'raw',
})

function recomposeModules(modules) {
  if (!Array.isArray(modules)) return {modules, changed: false}
  const next = []
  let changed = false

  for (let i = 0; i < modules.length; i++) {
    const mod = modules[i]
    const following = modules[i + 1]
    if (
      mod?._type === 'moduleSplit' &&
      mod.layout === 2 &&
      following?._type === 'moduleSteps'
    ) {
      const right = mod.right ?? []
      const bodyFromRight = right.filter((item) => item._type === 'moduleBody')
      const otherRight = right.filter((item) => item._type !== 'moduleBody')
      next.push({
        ...mod,
        left: [...(mod.left ?? []), ...bodyFromRight],
        right: [{...following, arrangement: 'stack'}, ...otherRight],
      })
      i += 1
      changed = true
      continue
    }
    next.push(mod)
  }

  return {modules: next, changed}
}

function convertDocument(doc) {
  const patches = {}

  if (Array.isArray(doc.modules)) {
    const result = recomposeModules(doc.modules)
    if (result.changed) patches.modules = result.modules
  }

  if (Array.isArray(doc.pageBuilder)) {
    let pageChanged = false
    const pageBuilder = doc.pageBuilder.map((block) => {
      if (block?._type !== 'customSection') return block
      const result = recomposeModules(block.modules)
      if (!result.changed) return block
      pageChanged = true
      return {...block, modules: result.modules}
    })
    if (pageChanged) patches.pageBuilder = pageBuilder
  }

  return patches
}

const docs = await client.fetch(
  `*[_type in ["page", "homePage", "offering", "flexibleSectionTemplate"]]{
    _id,
    _type,
    title,
    pageBuilder,
    modules
  }`,
)

let updated = 0
for (const doc of docs) {
  const patches = convertDocument(doc)
  if (!Object.keys(patches).length) continue
  updated += 1
  console.log(`${dryRun ? '[dry-run] ' : ''}patch ${doc._type} ${doc.title || doc._id}`)
  if (!dryRun) {
    await client.patch(doc._id).set(patches).commit({autoGenerateArrayKeys: false})
  }
}

console.log(
  dryRun ? `Would update ${updated} document(s)` : `Updated ${updated} document(s)`,
)
