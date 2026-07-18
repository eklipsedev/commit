/**
 * Migrates testimonial images/name/role onto `person` documents.
 *
 * - Sets existing people without `kind` to `employee`
 * - Creates a `person` (kind: testimonial) per testimonial with inline name/image
 * - Points each testimonial at that person and clears legacy name/role/image fields
 *
 * Usage (from studio/):
 *   node scripts/migrate-testimonial-people.mjs
 *
 * Dry run:
 *   DRY_RUN=1 node scripts/migrate-testimonial-people.mjs
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

function slugify(value = '') {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function publishedId(id) {
  return id.replace(/^drafts\./, '')
}

async function main() {
  console.log(
    `Migrating testimonial people on ${projectId}:${dataset}${dryRun ? ' (dry run)' : ''}`,
  )

  const peopleMissingKind = await client.fetch(
    `*[_type == "person" && !defined(kind)]{_id, name}`,
  )
  console.log(`\nPeople missing kind → employee: ${peopleMissingKind.length}`)

  for (const person of peopleMissingKind) {
    const id = publishedId(person._id)
    console.log(`  • ${person.name} (${id})`)
    if (!dryRun) {
      await client.patch(id).set({kind: 'employee'}).commit()
    }
  }

  const testimonials = await client.fetch(`*[_type == "testimonial"]{
    _id,
    name,
    role,
    image,
    person,
    "needsPerson": !defined(person) && (defined(name) || defined(image.asset)),
    "hasLegacyFields": defined(name) || defined(role) || defined(image)
  }`)

  const toCreate = testimonials.filter((t) => t.needsPerson)
  console.log(`\nTestimonials needing a person: ${toCreate.length}`)

  for (const testimonial of toCreate) {
    const id = publishedId(testimonial._id)
    const name = testimonial.name || 'Untitled'
    const slug = slugify(name) || id.slice(0, 8)
    const personId = `person-testimonial-${slug}`

    console.log(`  • ${name}`)
    console.log(`      person: ${personId}`)
    console.log(`      testimonial: ${id}`)

    if (dryRun) continue

    const personDoc = {
      _id: personId,
      _type: 'person',
      kind: 'testimonial',
      name,
      ...(testimonial.role ? {role: testimonial.role} : {}),
      ...(testimonial.image ? {photo: testimonial.image} : {}),
      slug: {_type: 'slug', current: slug},
    }

    await client.createOrReplace(personDoc)
    await client
      .patch(id)
      .set({person: {_type: 'reference', _ref: personId}})
      .unset(['name', 'role', 'image'])
      .commit()
  }

  const leftovers = testimonials.filter((t) => t.person && t.hasLegacyFields)
  console.log(`\nClearing leftover legacy fields: ${leftovers.length}`)
  for (const testimonial of leftovers) {
    const id = publishedId(testimonial._id)
    console.log(`  • ${id}`)
    if (!dryRun) {
      await client.patch(id).unset(['name', 'role', 'image']).commit()
    }
  }

  console.log('\nDone.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
