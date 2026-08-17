'use client'

import MuxPlayer from '@mux/mux-player-react'
import {cn} from '@/lib/cn'
import {colorHex} from '@/lib/colors'
import {cssAspectRatio} from '@/lib/media-dimensions'

type MuxVideoProps = {
  playbackId?: string | null
  className?: string
  /** Looping muted background (hero / cards). */
  background?: boolean
  /** Mux aspect ratio string e.g. `16:9` — sizes the player to the video. */
  aspectRatio?: string | null
  poster?: string
  title?: string
  autoPlay?: boolean
  /** Background fit — cards use `cover`; heroes usually `contain`. */
  objectFit?: 'contain' | 'cover'
}

/**
 * Mux-backed video player. Use `background` for looping muted videos.
 */
export function MuxVideo({
  playbackId,
  className,
  background = false,
  aspectRatio,
  poster,
  title,
  autoPlay,
  objectFit = 'contain',
}: MuxVideoProps) {
  if (!playbackId) return null

  const ratio = cssAspectRatio(aspectRatio)
  const accentColor = colorHex('yellow')

  return (
    <MuxPlayer
      playbackId={playbackId}
      poster={poster}
      metadata={title ? {video_title: title} : undefined}
      autoPlay={background || autoPlay ? 'muted' : false}
      muted={background || undefined}
      loop={background || undefined}
      playsInline
      preload={background ? 'auto' : 'metadata'}
      accentColor={accentColor}
      className={cn(background && 'mux-background', className)}
      style={
        (background
          ? {
              width: '100%',
              height: objectFit === 'cover' ? '100%' : 'auto',
              ...(ratio && objectFit !== 'cover' ? {aspectRatio: ratio} : {}),
              '--controls': 'none',
              '--media-object-fit': objectFit,
              '--media-object-position': 'center',
            }
          : {
              width: '100%',
              height: '100%',
              ...(ratio ? {aspectRatio: ratio} : {}),
            }) as React.CSSProperties & Record<`--${string}`, string>
      }
    />
  )
}
