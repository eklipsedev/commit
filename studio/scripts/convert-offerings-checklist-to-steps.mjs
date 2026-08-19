/**
 * Convert the Offerings “zero waste” checklist into numbered steps.
 *
 * Usage (from studio/):
 *   node --env-file=.env.local scripts/convert-offerings-checklist-to-steps.mjs
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

const key = () => crypto.randomUUID().replace(/-/g, '').slice(0, 12)

function convertChecklist(mod) {
  const steps = (mod.items ?? [])
    .map((item) => ({
      _type: 'moduleStep',
      _key: key(),
      text: typeof item === 'string' ? item : item.text,
    }))
    .filter((step) => step.text)
  return {
    _type: 'moduleSteps',
    _key: mod._key,
    arrangement: 'stack',
    steps,
  }
}

function walkModules(modules) {
  if (!Array.isArray(modules)) return {modules, changed: false}
  let changed = false
  const next = modules.map((mod) => {
    if (mod?._type === 'moduleSplit') {
      const left = walkModules(mod.left)
      const right = walkModules(mod.right)
      const content = walkModules(mod.content)
      if (left.changed || right.changed || content.changed) changed = true
      return {
        ...mod,
        left: left.modules,
        right: right.modules,
        content: content.modules,
      }
    }
    if (mod?._type === 'moduleChecklist') {
      changed = true
      return convertChecklist(mod)
    }
    return mod
  })
  return {modules: next, changed}
}

const docs = await client.fetch(
  `*[_id in ["2e93e424-edd3-4d1f-9f54-65b1428c72da", "drafts.2e93e424-edd3-4d1f-9f54-65b1428c72da"]]{
    _id,
    pageBuilder
  }`,
)

for (const doc of docs) {
  let pageChanged = false
  const pageBuilder = (doc.pageBuilder ?? []).map((block) => {
    if (block?._type !== 'customSection') return block
    const result = walkModules(block.modules)
    if (!result.changed) return block
    pageChanged = true
    return {...block, modules: result.modules}
  })
  if (!pageChanged) continue
  await client.patch(doc._id).set({pageBuilder}).commit({autoGenerateArrayKeys: false})
  console.log('patched', doc._id)
}
