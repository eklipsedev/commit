import {createClient} from '@sanity/client'
import {BLOCK_PREVIEW_FIELDS, type BlockPreviewType} from '../schemaTypes/documents/block-previews'

type PreviewUrlMap = Partial<Record<BlockPreviewType, string>>

let previewUrls: PreviewUrlMap = {}

const client = createClient({
  projectId: '9khzz3db',
  dataset: 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
})

const urlProjection = BLOCK_PREVIEW_FIELDS.map(
  (block) => `"${block.name}": ${block.name}.asset->url`,
).join(',\n  ')

function withPreviewParams(url?: string | null) {
  if (!url) return undefined
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}w=800&auto=format`
}

export function getBlockPreviewUrl(schemaTypeName: string) {
  return previewUrls[schemaTypeName as BlockPreviewType]
}

export async function hydrateBlockPreviewUrls() {
  try {
    const doc = await client.fetch<PreviewUrlMap | null>(
      `*[_id == "blockPreviews"][0]{
        ${urlProjection}
      }`,
    )

    const next: PreviewUrlMap = {}
    for (const block of BLOCK_PREVIEW_FIELDS) {
      next[block.name] = withPreviewParams(doc?.[block.name])
    }
    previewUrls = next
  } catch (error) {
    console.warn('[block-previews] Failed to load insert menu images', error)
  }
}

/** Keep Studio insert thumbnails in sync when authors update the singleton. */
export function listenForBlockPreviewUpdates() {
  return client.listen('*[_id == "blockPreviews"]').subscribe({
    next: () => {
      void hydrateBlockPreviewUrls()
    },
    error: (error) => {
      console.warn('[block-previews] Listen error', error)
    },
  })
}
