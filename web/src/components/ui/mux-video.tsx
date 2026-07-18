'use client'

import MuxPlayer from '@mux/mux-player-react'
import {cn} from '@/lib/cn'
import {cssAspectRatio} from '@/lib/media-dimensions'

type MuxVideoProps = {
  playbackId?: string | null
  className?: string
  /** Looping muted background (hero). */
  background?: boolean
  /** Mux aspect ratio string e.g. `16:9` — sizes the player to the video. */
  aspectRatio?: string | null
  poster?: string
  title?: string
  autoPlay?: boolean
}

/**
 * Mux-backed video player. Use `background` for looping hero videos.
 */
export function MuxVideo({
  playbackId,
  className,
  background = false,
  aspectRatio,
  poster,
  title,
  autoPlay,
}: MuxVideoProps) {
  if (!playbackId) return null

  const ratio = cssAspectRatio(aspectRatio)

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
      className={cn(background && 'mux-background', className)}
      style={
        background
          ? ({
              width: '100%',
              height: 'auto',
              ...(ratio ? {aspectRatio: ratio} : {}),
              '--controls': 'none',
              '--media-object-fit': 'contain',
              '--media-object-position': 'center',
            } as React.CSSProperties)
          : {
              width: '100%',
              height: '100%',
              ...(ratio ? {aspectRatio: ratio} : {}),
            }
      }
    />
  )
}
