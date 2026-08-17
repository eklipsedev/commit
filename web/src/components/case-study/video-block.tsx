'use client'

import Image from 'next/image'
import {useState} from 'react'
import {SanityImage} from '@/components/ui/sanity-image'
import {MuxVideo} from '@/components/ui/mux-video'
import {cn} from '@/lib/cn'
import {muxPosterUrl} from '@/lib/mux'
import type {MuxVideoAsset, SanityImage as SanityImageType} from '@/sanity/types'

export function CaseStudyVideoBlock({
  video,
  poster,
  title,
  loop = false,
  className,
}: {
  video?: MuxVideoAsset | null
  poster?: SanityImageType | null
  title?: string
  /** Autoplay muted loop with no controls — ambient / GIF-like. */
  loop?: boolean
  className?: string
}) {
  const playbackId = video?.playbackId
  const [playing, setPlaying] = useState(false)

  if (!playbackId) return null

  const muxPoster = muxPosterUrl(playbackId)
  const hasSanityPoster = Boolean(poster?.asset)

  if (loop) {
    return (
      <div
        className={cn(
          'relative aspect-[1296/730] w-full overflow-hidden bg-neutral-100',
          className,
        )}
      >
        <MuxVideo
          playbackId={playbackId}
          background
          objectFit="cover"
          title={title}
          className="absolute inset-0 h-full w-full"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative aspect-[1296/730] w-full overflow-hidden bg-neutral-100',
        className,
      )}
    >
      {playing ? (
        <div className="absolute inset-0">
          <MuxVideo
            playbackId={playbackId}
            poster={hasSanityPoster ? undefined : muxPoster}
            title={title}
            autoPlay
            className="h-full w-full"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 block w-full cursor-pointer"
          aria-label={title ? `Play ${title}` : 'Play video'}
        >
          {hasSanityPoster ? (
            <SanityImage
              image={poster}
              alt={poster?.alt ?? title ?? 'Video cover'}
              fill
              sizes="(min-width: 1320px) 1320px, 100vw"
              className="object-cover"
            />
          ) : (
            <Image
              src={muxPoster}
              alt={title ?? 'Video cover'}
              fill
              sizes="(min-width: 1320px) 1320px, 100vw"
              className="object-cover"
              unoptimized
            />
          )}
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="size-12 fill-white md:size-14" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}
