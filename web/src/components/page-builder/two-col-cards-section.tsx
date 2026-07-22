'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'
import {Container} from '@/components/ui/container'
import {CmsButton} from '@/components/ui/cms-button'
import {FadeIn} from '@/components/ui/fade-in'
import {Heading} from '@/components/ui/heading'
import {SanityImage} from '@/components/ui/sanity-image'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import {cn} from '@/lib/cn'
import {headingFontFromBlock, headingSizeFromBlock} from '@/lib/heading-styles'
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

  return (
    <Link ref={ref} href={href} className={cn('group block', active && 'is-active')}>
      <div className="relative aspect-[636/358] overflow-hidden bg-neutral-100">
        {project.thumbnail && (
          <SanityImage
            image={project.thumbnail}
            alt={project.thumbnail.alt ?? project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priority}
            className={cn(
              'transition-transform duration-500 group-hover:scale-105',
              'group-[.is-active]:scale-105',
            )}
          />
        )}
      </div>
      <div className="relative flex items-start justify-between gap-4 overflow-hidden px-4 py-3 text-sm md:px-5 md:py-3.5 md:text-base">
        {/* Yellow fill — same easing as Tagline Rule, slightly faster */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 origin-left scale-x-0 bg-brand-yellow transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100',
            'group-[.is-active]:scale-x-100',
          )}
        />
        <p className="relative z-10 font-medium" style={{color: 'var(--section-heading)'}}>
          {project.title}
        </p>
        {project.categories?.length ? (
          <p
            className={cn(
              'relative z-10 text-right font-mono text-xs tracking-normal text-brand-charcoal opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-hover:delay-500 md:text-sm',
              'group-[.is-active]:opacity-100 group-[.is-active]:delay-500',
            )}
          >
            {project.categories.join(' / ')}
          </p>
        ) : null}
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
          <div className="space-y-8">
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
          </div>
        )}
        <div className="grid gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-12">
          {projects.map((project, index) => (
            <FadeIn key={project._id} delay={Math.min(index, 3) * 40}>
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
