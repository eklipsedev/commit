'use client'

import Image, {type ImageLoader} from 'next/image'
import {imageLoader} from 'next-sanity/image'
import {cn} from '@/lib/cn'
import {urlFor} from '@/sanity/image'
import type {SanityImage as SanityImageType} from '@/sanity/types'

type SanityImageProps = {
  image?: SanityImageType | null
  alt?: string
  className?: string
  style?: React.CSSProperties
  sizes?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  quality?: number
  /**
   * Force GIF handling (resize via Sanity, keep `fm=gif`).
   * When omitted, GIF assets are detected from the asset ref.
   */
  preserveFormat?: boolean
}

function isGifAsset(image: SanityImageType) {
  const ref = image.asset?._ref
  return typeof ref === 'string' && ref.endsWith('-gif')
}

/**
 * Resize animated GIFs on Sanity's CDN without `auto=format`, which can
 * flatten animation to a single WebP frame.
 */
const gifImageLoader: ImageLoader = ({src, width, quality}) => {
  const url = new URL(src)
  url.searchParams.set('fm', 'gif')
  if (!url.searchParams.has('fit')) {
    url.searchParams.set('fit', url.searchParams.has('h') ? 'min' : 'max')
  }
  if (url.searchParams.has('h') && url.searchParams.has('w')) {
    const originalHeight = Number.parseInt(url.searchParams.get('h')!, 10)
    const originalWidth = Number.parseInt(url.searchParams.get('w')!, 10)
    url.searchParams.set(
      'h',
      Math.round((originalHeight / originalWidth) * width).toString(),
    )
  }
  url.searchParams.set('w', width.toString())
  if (quality) url.searchParams.set('q', quality.toString())
  url.searchParams.delete('auto')
  return url.href
}

/**
 * Renders a Sanity image via next/image, using Sanity's CDN loader so
 * `sizes` / srcset map to `?w=` transforms instead of full-resolution assets.
 */
export function SanityImage({
  image,
  alt,
  className,
  style,
  sizes = '100vw',
  fill,
  width,
  height,
  priority,
  quality = 100,
  preserveFormat,
}: SanityImageProps) {
  if (!image?.asset) return null

  const isGif = preserveFormat ?? isGifAsset(image)
  const src = urlFor(image).url()
  const imageAlt = alt ?? image.alt ?? ''
  const loader = isGif ? gifImageLoader : imageLoader

  if (fill) {
    return (
      <Image
        src={src}
        alt={imageAlt}
        fill
        className={cn('object-cover', className)}
        style={style}
        sizes={sizes}
        priority={priority}
        quality={quality}
        loader={loader}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={imageAlt}
      width={width ?? 1200}
      height={height ?? 800}
      className={className}
      style={style}
      sizes={sizes}
      priority={priority}
      quality={quality}
      loader={loader}
    />
  )
}
