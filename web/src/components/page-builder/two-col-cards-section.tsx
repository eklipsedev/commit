'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'
import {Container} from '@/components/ui/container'
import {CmsButton} from '@/components/ui/cms-button'
import {FadeIn, FADE_IN_STAGGER_MS} from '@/components/ui/fade-in'
import {Heading} from '@/components/ui/heading'
import {MuxVideo} from '@/components/ui/mux-video'
import {SanityImage} from '@/components/ui/sanity-image'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import {cn} from '@/lib/cn'
import {headingFontFromBlock, headingSizeFromBlock} from '@/lib/heading-styles'
import {muxPosterUrl} from '@/lib/mux'
import {useInView} from '@/lib/use-in-view'
import type {PageBuilderBlock, ProjectCard} from '@/sanity/types'

type TwoColCardsBlock = PageBuilderBlock & {
  showHeader?: boolean
  tagline?: string
  heading?: string
  button?: import('@/sanity/types').ButtonValue
  projects?: ProjectCard[]
}

function useTouchWithoutHover() {
  const [touchWithoutHover, setTouchWithoutHover] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(hover: none), (pointer: coarse)')
    const sync = () => setTouchWithoutHover(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return touchWithoutHover
}

function ProjectCardMedia({
  project,
  priority,
}: {
  project: ProjectCard
  priority?: boolean
}) {
  const playbackId = project.thumbnailVideo?.playbackId
  const useVideo = project.thumbnailMediaType === 'video' && Boolean(playbackId)

  if (useVideo && playbackId) {
    return (
      <div className="absolute inset-0">
        {project.thumbnail?.asset ? (
          <SanityImage
            image={project.thumbnail}
            alt={project.thumbnail.alt ?? project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priority}
            className="object-cover"
          />
        ) : null}
        <MuxVideo
          playbackId={playbackId}
          background
          objectFit="cover"
          poster={
            project.thumbnail?.asset ? undefined : muxPosterUrl(playbackId, 1200)
          }
          title={project.title}
          className="absolute inset-0 h-full w-full"
        />
      </div>
    )
  }

  if (!project.thumbnail) return null

  return (
    <SanityImage
      image={project.thumbnail}
      alt={project.thumbnail.alt ?? project.title}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      priority={priority}
      className="object-cover"
    />
  )
}

function ProjectCardItem({
  project,
  priority,
  touchWithoutHover,
}: {
  project: ProjectCard
  priority?: boolean
  touchWithoutHover: boolean
}) {
  const slug = project.slug?.current
  const href = slug ? `/work/${slug}` : '#'
  const [ref, fullyInView] = useInView<HTMLAnchorElement>({
    threshold: 1,
    rootMargin: '0px',
    once: false,
  })
  const active = touchWithoutHover && fullyInView
  const categoryLine = project.categories?.length
    ? project.categories.join(' / ')
    : null

  return (
    <Link
      ref={ref}
      href={href}
      aria-label={project.title}
      className={cn('group block', active && 'is-active')}
    >
      <div className="relative aspect-[636/358] overflow-hidden bg-neutral-100">
        <div
          className={cn(
            'absolute inset-0 transition-transform duration-500 group-hover:scale-105',
            'group-[.is-active]:scale-105',
          )}
        >
          <ProjectCardMedia project={project} priority={priority} />
        </div>

        {/* Labels overlay the image — hidden at rest, slide up on hover */}
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 z-10 flex items-start justify-between gap-4 bg-brand-white px-4 py-3 text-sm md:px-5 md:py-3.5 md:text-base',
            'translate-y-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
            'group-hover:translate-y-0 group-[.is-active]:translate-y-0',
          )}
        >
          <p className="font-medium text-brand-charcoal">{project.title}</p>
          {categoryLine ? (
            <p className="text-right font-mono text-xs tracking-normal text-brand-charcoal md:text-sm">
              {categoryLine}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

export function TwoColCardsSection({block}: {block: TwoColCardsBlock}) {
  const showHeader = block.showHeader !== false
  const projects = block.projects ?? []
  const touchWithoutHover = useTouchWithoutHover()

  return (
    <Section {...block}>
      <Container className="space-y-10 md:space-y-14">
        {showHeader && (
          <FadeIn className="space-y-8">
            {block.tagline && (
              <Tagline showRule={block.showTaglineRule !== false}>{block.tagline}</Tagline>
            )}
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start md:gap-12">
              {block.heading && (
                <Heading
                  size={headingSizeFromBlock(block)}
                  font={headingFontFromBlock(block)}
                  style={{color: 'var(--section-heading)'}}
                  collapseLineBreaksOnMobile={block.collapseLineBreaksOnMobile}
                >
                  {block.heading}
                </Heading>
              )}
              {block.button && <CmsButton button={block.button} className="shrink-0" />}
            </div>
          </FadeIn>
        )}
        <div className="grid gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-12">
          {projects.map((project, index) => (
            <FadeIn key={project._id} delay={Math.min(index, 3) * FADE_IN_STAGGER_MS}>
              <ProjectCardItem
                project={project}
                priority={index < 2}
                touchWithoutHover={touchWithoutHover}
              />
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  )
}
