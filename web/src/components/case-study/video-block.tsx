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
  className,
}: {
  video?: MuxVideoAsset | null
  poster?: SanityImageType | null
  title?: string
  className?: string
}) {
  const playbackId = video?.playbackId
  const [playing, setPlaying] = useState(false)

  if (!playbackId) return null

  const muxPoster = muxPosterUrl(playbackId)
  const hasSanityPoster = Boolean(poster?.asset)

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
          className="group absolute inset-0 block w-full cursor-pointer"
          aria-label={title ? `Play ${title}` : 'Play video'}
        >
          {hasSanityPoster ? (
            <SanityImage
              image={poster}
              alt={poster?.alt ?? title ?? 'Video cover'}
              fill
              sizes="(min-width: 1320px) 1200px, calc(100vw - 3rem)"
              className="object-cover"
            />
          ) : (
            <Image
              src={muxPoster}
              alt={title ?? 'Video cover'}
              fill
              sizes="(min-width: 1320px) 1200px, calc(100vw - 3rem)"
              className="object-cover"
              unoptimized
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
            <span className="flex size-16 items-center justify-center rounded-full bg-brand-white text-brand-charcoal shadow-sm md:size-20">
              <svg
                viewBox="0 0 24 24"
                className="ml-1 size-7 fill-current md:size-8"
                aria-hidden
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
