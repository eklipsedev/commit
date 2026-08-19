/**
 * Convert Flexible Body `text` strings into simple portable text blocks
 * so paragraphs and links work in Studio + on the site.
 *
 * Usage (from studio/):
 *   node --env-file=.env.local scripts/migrate-module-body-portable-text.mjs
 *   node --env-file=.env.local scripts/migrate-module-body-portable-text.mjs --dry-run
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

const key = () => crypto.randomUUID().replace(/-/g, '').slice(0, 12)

function stringToBlocks(text) {
  if (typeof text !== 'string') return text
  const paragraphs = text.split(/\n{2,}/).map((part) => part.replace(/\r/g, ''))
  const nonempty = paragraphs.length ? paragraphs : ['']
  return nonempty.map((para) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: key(),
        marks: [],
        text: para,
      },
    ],
  }))
}

function convertBodyModule(module) {
  if (!module || module._type !== 'moduleBody') return {module, changed: false}
  if (Array.isArray(module.text)) return {module, changed: false}
  if (typeof module.text !== 'string') return {module, changed: false}
  return {
    module: {...module, text: stringToBlocks(module.text)},
    changed: true,
  }
}

function convertModuleList(modules) {
  if (!Array.isArray(modules)) return {modules, changed: false}
  let changed = false
  const next = modules.map((mod) => {
    if (mod?._type === 'moduleSplit') {
      const content = convertModuleList(mod.content)
      const left = convertModuleList(mod.left)
      const right = convertModuleList(mod.right)
      if (content.changed || left.changed || right.changed) {
        changed = true
        return {
          ...mod,
          content: content.modules,
          left: left.modules,
          right: right.modules,
        }
      }
      return mod
    }
    const result = convertBodyModule(mod)
    if (result.changed) changed = true
    return result.module
  })
  return {modules: next, changed}
}

function convertDocument(doc) {
  const patches = {}

  if (Array.isArray(doc.pageBuilder)) {
    let pageChanged = false
    const pageBuilder = doc.pageBuilder.map((block) => {
      if (block?._type !== 'customSection') return block
      const result = convertModuleList(block.modules)
      if (!result.changed) return block
      pageChanged = true
      return {...block, modules: result.modules}
    })
    if (pageChanged) patches.pageBuilder = pageBuilder
  }

  if (Array.isArray(doc.modules)) {
    const result = convertModuleList(doc.modules)
    if (result.changed) patches.modules = result.modules
  }

  return patches
}

const docs = await client.fetch(
  `*[_type in ["page", "homePage", "offering", "flexibleSectionTemplate"]]{
    _id,
    _type,
    pageBuilder,
    modules
  }`,
)

let updated = 0
for (const doc of docs) {
  const patches = convertDocument(doc)
  const keys = Object.keys(patches)
  if (!keys.length) continue
  updated += 1
  console.log(`${dryRun ? '[dry-run] ' : ''}patch ${doc._type} ${doc._id}`)
  if (!dryRun) {
    await client.patch(doc._id).set(patches).commit({autoGenerateArrayKeys: false})
  }
}

console.log(
  dryRun
    ? `Would update ${updated} document(s)`
    : `Updated ${updated} document(s)`,
)
