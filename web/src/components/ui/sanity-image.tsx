'use client'

import Image from 'next/image'
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
   * Force original-asset handling (no CDN resize/format).
   * When omitted, GIF assets are detected from the asset ref.
   */
  preserveFormat?: boolean
}

function isGifAsset(image: SanityImageType) {
  const ref = image.asset?._ref ?? image.asset?._id
  return typeof ref === 'string' && /-gif$/i.test(ref)
}

/**
 * Renders a Sanity image via next/image.
 *
 * Animated GIFs skip Sanity CDN transforms (`w`, `fm`, `q`, `auto=format`) —
 * resizing GIFs on the CDN often corrupts frames. The original asset is served
 * and layout sizing is handled in CSS.
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
  // Base URL with no width/format params — required for GIF originals.
  const src = urlFor(image).url()
  const imageAlt = alt ?? image.alt ?? ''

  if (fill) {
    return (
      <Image
        src={src}
        alt={imageAlt}
        fill
        className={cn('object-cover', className)}
        style={style}
        sizes={isGif ? undefined : sizes}
        priority={priority}
        quality={quality}
        loader={isGif ? undefined : imageLoader}
        unoptimized={isGif}
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
      sizes={isGif ? undefined : sizes}
      priority={priority}
      quality={quality}
      loader={isGif ? undefined : imageLoader}
      unoptimized={isGif}
    />
  )
}
