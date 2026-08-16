/**
 * Promote the four audience landing pages into Sales Pages and
 * point Offerings cards at that shared ordered source.
 *
 * Usage (from studio/):
 *   node --env-file=.env.local scripts/migrate-sales-pages.mjs
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
})

const SALES_PAGES = [
  {
    _id: '56d872d4-b5e2-415c-9a5b-da7389117970',
    orderRank: '0|a00000:',
    navLabel: 'Founders & Entrepreneurs',
    cardTitle: 'Founders &\nEntrepreneurs',
    cardBody:
      'You have a vision and need a brand that makes people believe in it too. We help you get clear, get visual, and get moving.',
    cardBackgroundColor: 'light-blue',
    cardHeadingColor: 'charcoal',
    cardBodyColor: 'charcoal',
    cardButtonLabel: 'Learn More',
    buttonTextColor: 'charcoal',
    buttonHoverBackgroundColor: 'deep-blue',
    buttonHoverTextColor: 'white',
  },
  {
    _id: '53300438-c5fc-4691-916e-560267c1d66b',
    orderRank: '0|a00010:',
    navLabel: 'Solopreneurs & Consultants',
    cardTitle: 'Solopreneurs &\nConsultants',
    cardBody:
      'You are the brand. We help you present yourself online as sharp as you actually are.',
    cardBackgroundColor: 'pink',
    cardHeadingColor: 'charcoal',
    cardBodyColor: 'charcoal',
    cardButtonLabel: 'Learn More',
    buttonTextColor: 'charcoal',
    buttonHoverBackgroundColor: 'deep-blue',
    buttonHoverTextColor: 'white',
  },
  {
    _id: '368ec985-969d-46ce-ace3-63281901acf4',
    orderRank: '0|a00020:',
    navLabel: 'Leaders in Social Impact',
    cardTitle: 'Leaders in\nSocial Impact',
    cardBody:
      'Your mission is incredible. Your brand should be too. Communicate it with clarity, credibility, and conviction.',
    cardBackgroundColor: 'brown',
    cardHeadingColor: 'white',
    cardBodyColor: 'white',
    cardButtonLabel: 'Learn More',
    buttonTextColor: 'white',
    buttonHoverBackgroundColor: 'yellow',
    buttonHoverTextColor: 'charcoal',
  },
  {
    _id: '840c193c-4674-40f7-b2ec-7dbf9b7b97a6',
    orderRank: '0|a00030:',
    navLabel: 'Board-ready Executives',
    cardTitle: 'Board-ready\nExecutives',
    cardBody:
      'The next chapter requires a different kind of visibility. We get you there.',
    cardBackgroundColor: 'lavender',
    cardHeadingColor: 'charcoal',
    cardBodyColor: 'charcoal',
    cardButtonLabel: 'Learn More',
    buttonTextColor: 'charcoal',
    buttonHoverBackgroundColor: 'deep-blue',
    buttonHoverTextColor: 'white',
  },
]

const salesIds = new Set(SALES_PAGES.map((page) => page._id))
const tx = client.transaction()

for (const page of SALES_PAGES) {
  const {_id, ...fields} = page
  tx.patch(_id, (patch) => patch.set({kind: 'sales', ...fields}))
}

// Mark remaining landing pages as general when unset.
const generalPages = await client.fetch(
  `*[_type == "page" && !(_id in $ids) && !defined(kind)]._id`,
  {ids: [...salesIds]},
)
for (const id of generalPages) {
  tx.patch(id, (patch) => patch.set({kind: 'general'}))
}

const offeringsPage = await client.fetch(
  `*[_type == "page" && slug.current == "offerings"][0]{
    _id,
    pageBuilder[_type == "cardsText"][0]{_key}
  }`,
)
if (offeringsPage?._id && offeringsPage.pageBuilder?._key) {
  const key = offeringsPage.pageBuilder._key
  tx.patch(offeringsPage._id, (patch) =>
    patch
      .set({
        [`pageBuilder[_key=="${key}"].cardsSource`]: 'salesPages',
      })
      .unset([`pageBuilder[_key=="${key}"].cards`]),
  )
}

// Keep Overview in the Offerings dropdown; drop hard-coded sales children.
const navigation = await client.fetch(
  `*[_id == "navigation"][0]{items}`,
)
if (navigation?.items) {
  const items = navigation.items.map((item) => {
    const href = item.link?.internalLink?._ref
    const isOfferings =
      item.label?.toLowerCase() === 'offerings' || href === '2e93e424-edd3-4d1f-9f54-65b1428c72da'
    if (!isOfferings || !item.children) return item
    return {
      ...item,
      children: item.children.filter((child) => {
        const id = child.link?.internalLink?._ref
        return !id || !salesIds.has(id)
      }),
    }
  })
  tx.patch('navigation', (patch) => patch.set({items}))
}

await tx.commit({autoGenerateArrayKeys: true})
console.log('Migrated Sales Pages, Offerings cards source, and Offerings nav children.')
