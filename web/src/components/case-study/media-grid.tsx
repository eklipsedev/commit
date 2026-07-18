import {CaseStudyVideoBlock} from '@/components/case-study/video-block'
import {Container} from '@/components/ui/container'
import {FadeIn} from '@/components/ui/fade-in'
import {SanityImage} from '@/components/ui/sanity-image'
import {cn} from '@/lib/cn'
import type {CaseStudyMediaRow, SanityImage as SanityImageType} from '@/sanity/types'

function MediaFrame({
  image,
  sizes,
  aspectClassName,
  priority,
}: {
  image?: SanityImageType
  sizes: string
  aspectClassName: string
  priority?: boolean
}) {
  if (!image?.asset) return null
  return (
    <div className={cn('relative w-full overflow-hidden bg-neutral-100', aspectClassName)}>
      <SanityImage
        image={image}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  )
}

export function CaseStudyMediaGrid({
  rows,
}: {
  rows?: CaseStudyMediaRow[]
}) {
  if (!rows?.length) return null

  return (
    <Container>
      <div className="flex flex-col gap-5">
        {rows.map((row, index) => {
          const key = row._key ?? index
          const delay = index === 0 ? 0 : 40

          if (row.layout === 'video') {
            return (
              <FadeIn key={key} delay={delay}>
                <CaseStudyVideoBlock video={row.video} poster={row.poster} />
              </FadeIn>
            )
          }

          if (row.layout === 'twoCol') {
            return (
              <FadeIn key={key} delay={delay} className="grid gap-5 md:grid-cols-2">
                <MediaFrame
                  image={row.leftImage}
                  aspectClassName="aspect-[636/730]"
                  sizes="(min-width: 1320px) 590px, (min-width: 768px) calc(50vw - 3rem), calc(100vw - 3rem)"
                />
                <MediaFrame
                  image={row.rightImage}
                  aspectClassName="aspect-[636/730]"
                  sizes="(min-width: 1320px) 590px, (min-width: 768px) calc(50vw - 3rem), calc(100vw - 3rem)"
                />
              </FadeIn>
            )
          }

          return (
            <FadeIn key={key} delay={delay}>
              <MediaFrame
                image={row.image}
                aspectClassName="aspect-[1296/730]"
                sizes="(min-width: 1320px) 1200px, calc(100vw - 3rem)"
                priority={index === 0}
              />
            </FadeIn>
          )
        })}
      </div>
    </Container>
  )
}
