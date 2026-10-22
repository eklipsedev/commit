'use client'

import Link from 'next/link'
import {stegaClean} from 'next-sanity'
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
import type {PageBuilderBlock, ProjectCard, ProjectCardPick} from '@/sanity/types'

type TwoColCardsBlock = PageBuilderBlock & {
  showHeader?: boolean
  tagline?: string
  heading?: string
  button?: import('@/sanity/types').ButtonValue
  projects?: Array<ProjectCard | ProjectCardPick>
}

function isProjectCardPick(entry: ProjectCard | ProjectCardPick): entry is ProjectCardPick {
  return 'project' in entry
}

/** Alternate thumbnail when a card picked one; otherwise the project default. */
function resolveProjectCard(entry: ProjectCard | ProjectCardPick): ProjectCard | null {
  if (!isProjectCardPick(entry)) return entry
  const project = entry.project
  if (!project) return null

  const thumbnailKey = stegaClean(entry.thumbnailKey)
  const alternate = thumbnailKey
    ? project.alternateThumbnails?.find((item) => stegaClean(item._key) === thumbnailKey)
    : undefined

  const useVideo =
    stegaClean(alternate?.mediaType) === 'video' && Boolean(alternate?.video?.playbackId)

  if (useVideo && alternate?.video) {
    return {
      ...project,
      thumbnail: alternate.image?.asset ? alternate.image : undefined,
      thumbnailMediaType: 'video',
      thumbnailVideo: alternate.video,
    }
  }

  if (alternate?.image?.asset) {
    return {
      ...project,
      thumbnail: alternate.image,
      thumbnailMediaType: 'image',
    }
  }

  return project
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

function ProjectCardCaption({
  title,
  categoryLine,
  className,
}: {
  title?: string
  categoryLine?: string | null
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 bg-brand-white px-4 py-3 text-sm md:px-5 md:py-3.5 md:text-base',
        className,
      )}
    >
      <p className="font-medium text-brand-charcoal">{title}</p>
      {categoryLine ? (
        <p className="text-right font-mono text-xs tracking-normal text-brand-charcoal md:text-sm">
          {categoryLine}
        </p>
      ) : null}
    </div>
  )
}

function ProjectCardItem({
  project,
  priority,
}: {
  project: ProjectCard
  priority?: boolean
}) {
  const slug = project.slug?.current
  const href = slug ? `/work/${slug}` : '#'
  const categoryLine = project.categories?.length
    ? [...new Set(project.categories)].join(' / ')
    : null

  return (
    <Link href={href} aria-label={project.title} className="group block">
      <div className="relative aspect-[636/358] overflow-hidden bg-neutral-100">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <ProjectCardMedia project={project} priority={priority} />
        </div>

        <ProjectCardCaption
          title={project.title}
          categoryLine={categoryLine}
          className={cn(
            'absolute inset-x-0 bottom-0 z-10 hidden py-2 md:flex md:py-2',
            'translate-y-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
            'group-hover:translate-y-0',
          )}
        />
      </div>

      <ProjectCardCaption
        title={project.title}
        categoryLine={categoryLine}
        className="md:hidden"
      />
    </Link>
  )
}

export function TwoColCardsSection({block}: {block: TwoColCardsBlock}) {
  const showHeader = block.showHeader !== false
  const projects = (block.projects ?? [])
    .map(resolveProjectCard)
    .filter((project): project is ProjectCard => Boolean(project?._id))
  const showButton = showHeader && Boolean(block.button?.label)
  const hasHeaderRow = showHeader && Boolean(block.tagline || block.heading || showButton)
  // Heading and button share the row under the tagline on desktop.
  const headerRow = block.tagline ? 'md:row-start-2' : 'md:row-start-1'

  return (
    <Section {...block}>
      {/*
        One button, placed by grid: beside the heading from md, after the cards
        on mobile. DOM order (heading → cards → button) matches the mobile read.
      */}
      <Container className="grid md:grid-cols-[1fr_auto] md:gap-x-12">
        {showHeader && block.tagline && (
          <FadeIn className="mb-8 md:col-span-2">
            <Tagline showRule={block.showTaglineRule !== false}>{block.tagline}</Tagline>
          </FadeIn>
        )}
        {showHeader && block.heading && (
          <FadeIn className={cn('md:col-start-1', headerRow)}>
            <Heading
              size={headingSizeFromBlock(block)}
              font={headingFontFromBlock(block)}
              style={{color: 'var(--section-heading)'}}
              keepLineBreaksOnMobile={block.keepLineBreaksOnMobile}
            >
              {block.heading}
            </Heading>
          </FadeIn>
        )}
        <div
          className={cn(
            'grid gap-8 md:col-span-2 md:grid-cols-2 md:gap-x-10 md:gap-y-12',
            hasHeaderRow && 'mt-10 md:mt-14',
          )}
        >
          {projects.map((project, index) => (
            <FadeIn key={project._id} delay={Math.min(index, 3) * FADE_IN_STAGGER_MS}>
              <ProjectCardItem
                project={project}
                priority={index < 2}
              />
            </FadeIn>
          ))}
        </div>
        {showButton && (
          <FadeIn className={cn('mt-10 md:col-start-2 md:mt-0', headerRow)}>
            <CmsButton button={block.button} className="shrink-0" />
          </FadeIn>
        )}
      </Container>
    </Section>
  )
}
