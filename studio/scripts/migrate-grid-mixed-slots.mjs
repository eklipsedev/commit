/**
 * Migrates gridMixed `items[]` (flexible sizes) → fixed `images` slots.
 *
 * Mapping (by item order / size):
 *   wide, wide, tall, square, square, small|square, large
 *   → topLeft, topRight, leftTall, centerSquare, rightSquare, bottomLeft, bottomWide
 *
 * Usage (from studio/):
 *   node scripts/migrate-grid-mixed-slots.mjs
 *
 * Dry run:
 *   DRY_RUN=1 node scripts/migrate-grid-mixed-slots.mjs
 */

import {createClient} from '@sanity/client'
import {readFileSync, existsSync} from 'node:fs'
import {resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return
  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile(resolve(__dirname, '../.env.local'))
loadEnvFile(resolve(__dirname, '../.env'))

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '9khzz3db'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN
const dryRun = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true'

if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN (check studio/.env.local)')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
})

function pickImage(item) {
  return item?.image || undefined
}

function itemsToSlots(items = []) {
  const wides = items.filter((item) => item.size === 'wide')
  const tall = items.find((item) => item.size === 'tall')
  const large = items.find((item) => item.size === 'large')
  const thirds = items.filter(
    (item) => item.size === 'square' || item.size === 'small' || item.size === 'tall',
  )
  // Prefer explicit sizes; fall back to array order for the three ⅓ tiles after tall
  const afterTall = items.slice(items.findIndex((item) => item.size === 'tall') + 1)
  const squareish = afterTall.filter(
    (item) => item.size === 'square' || item.size === 'small',
  )

  return {
    _type: 'gridMixedImages',
    topLeft: pickImage(wides[0] || items[0]),
    topRight: pickImage(wides[1] || items[1]),
    leftTall: pickImage(tall || items[2]),
    centerSquare: pickImage(squareish[0] || thirds[0] || items[3]),
    rightSquare: pickImage(squareish[1] || thirds[1] || items[4]),
    bottomLeft: pickImage(squareish[2] || items[5]),
    bottomWide: pickImage(large || items[6]),
  }
}

async function main() {
  console.log(
    `Migrating gridMixed items → images on ${projectId}:${dataset}${dryRun ? ' (dry run)' : ''}`,
  )

  const docs = await client.fetch(`*[
    defined(pageBuilder) &&
    count(pageBuilder[_type == "gridMixed" && defined(items) && !defined(images)]) > 0
  ]{_id, _type, pageBuilder}`)

  const drafts = await client.fetch(`*[
    _id in path("drafts.**") &&
    defined(pageBuilder) &&
    count(pageBuilder[_type == "gridMixed" && defined(items) && !defined(images)]) > 0
  ]{_id, _type, pageBuilder}`)

  const all = [...docs, ...drafts]
  console.log(`Found ${all.length} document(s) to migrate`)

  for (const doc of all) {
    const nextBuilder = (doc.pageBuilder || []).map((block) => {
      if (block?._type !== 'gridMixed' || block.images || !block.items?.length) {
        return block
      }
      const {items, ...rest} = block
      return {
        ...rest,
        images: itemsToSlots(items),
      }
    })

    const changed = JSON.stringify(nextBuilder) !== JSON.stringify(doc.pageBuilder)
    if (!changed) {
      console.log(`- skip ${doc._id} (no changes)`)
      continue
    }

    console.log(`- update ${doc._id}`)
    if (!dryRun) {
      await client.patch(doc._id).set({pageBuilder: nextBuilder}).commit({autoGenerateArrayKeys: true})
    }
  }

  console.log('Done')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
