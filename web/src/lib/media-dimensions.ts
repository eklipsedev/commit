import type {SanityImage} from '@/sanity/types'

/**
 * Reads pixel size from a Sanity image asset ref (`image-…-{w}x{h}-{fmt}`).
 */
export function getImageDimensions(image?: SanityImage | null) {
  const ref = image?.asset?._ref ?? image?.asset?._id
  if (!ref) return {width: 2400, height: 1350}

  const match = ref.match(/-(\d+)x(\d+)-/)
  if (!match) return {width: 2400, height: 1350}

  return {
    width: Number.parseInt(match[1], 10),
    height: Number.parseInt(match[2], 10),
  }
}

/** Mux `16:9` → CSS `16 / 9` */
export function cssAspectRatio(ratio?: string | null) {
  if (!ratio) return undefined
  const [w, h] = ratio.split(':').map((n) => Number.parseFloat(n.trim()))
  if (!w || !h) return undefined
  return `${w} / ${h}`
}
