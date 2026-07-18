import {SanityImage} from '@/components/ui/sanity-image'
import {MuxVideo} from '@/components/ui/mux-video'
import {Container} from '@/components/ui/container'
import {getImageDimensions} from '@/lib/media-dimensions'
import {muxPosterUrl} from '@/lib/mux'
import type {MuxVideoAsset, SanityImage as SanityImageType} from '@/sanity/types'

export function CaseStudyHero({
  mediaType,
  image,
  video,
  title,
}: {
  mediaType?: 'image' | 'video' | null
  image?: SanityImageType | null
  video?: MuxVideoAsset | null
  title?: string
}) {
  const useVideo = mediaType === 'video' && Boolean(video?.playbackId)
  const useImage = !useVideo && Boolean(image?.asset)

  if (!useVideo && !useImage) return null

  const imageSize = getImageDimensions(image)

  return (
    <Container className="mt-6">
      {useVideo && video?.playbackId ? (
        <MuxVideo
          playbackId={video.playbackId}
          background
          poster={muxPosterUrl(video.playbackId)}
          title={title}
          aspectRatio={video.aspectRatio}
          className="block w-full"
        />
      ) : (
        <SanityImage
          image={image}
          alt={image?.alt ?? title}
          width={imageSize.width}
          height={imageSize.height}
          sizes="(min-width: 1320px) 1200px, calc(100vw - 3rem)"
          priority
          className="h-auto w-full"
          style={{width: '100%', height: 'auto'}}
        />
      )}
    </Container>
  )
}
