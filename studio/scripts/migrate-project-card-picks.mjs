/**
 * Converts hand-picked project card references into project + thumbnail picks.
 *
 *   {_key, _type: "reference", _ref}
 *   → {_key, _type: "projectCardPick", project: {_type: "reference", _ref}}
 *
 * Existing cards keep the project's default thumbnail (no thumbnailKey).
 * Safe to re-run.
 *
 * Usage (from studio/):
 *   node --env-file=.env.local scripts/migrate-project-card-picks.mjs
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
  perspective: 'raw',
})

function toPick(item) {
  if (!item || item._type !== 'reference' || !item._ref) return item
  const {_key, _type, ...ref} = item
  return {
    _key,
    _type: 'projectCardPick',
    project: {_type: 'reference', ...ref},
  }
}

function migrateBlocks(blocks) {
  if (!Array.isArray(blocks)) return {blocks, changed: false}

  let changed = false
  const next = blocks.map((block) => {
    if (!block || block._type !== 'twoColCards' || !Array.isArray(block.projects)) return block
    if (!block.projects.some((item) => item?._type === 'reference')) return block
    changed = true
    return {...block, projects: block.projects.map(toPick)}
  })

  return {blocks: next, changed}
}

const docs = await client.fetch(`*[
  count(pageBuilder[_type == "twoColCards" && count(projects[_type == "reference"]) > 0]) > 0
]{_id, _type, pageBuilder}`)

let patched = 0
for (const doc of docs) {
  const {blocks, changed} = migrateBlocks(doc.pageBuilder)
  if (!changed) continue
  await client.patch(doc._id).set({pageBuilder: blocks}).commit({autoGenerateArrayKeys: false})
  patched += 1
  console.log(`Patched ${doc._id} (${doc._type})`)
}

console.log(`Done. Migrated ${patched} document(s).`)
