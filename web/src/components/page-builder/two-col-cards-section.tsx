import Link from 'next/link'
import {Container} from '@/components/ui/container'
import {CmsButton} from '@/components/ui/cms-button'
import {FadeIn} from '@/components/ui/fade-in'
import {Heading} from '@/components/ui/heading'
import {SanityImage} from '@/components/ui/sanity-image'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import {headingSizeFromBlock} from '@/lib/heading-styles'
import type {PageBuilderBlock, ProjectCard} from '@/sanity/types'

type TwoColCardsBlock = PageBuilderBlock & {
  showHeader?: boolean
  tagline?: string
  heading?: string
  button?: import('@/sanity/types').ButtonValue
  projects?: ProjectCard[]
}

function chunkPairs<T>(items: T[]): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2))
  }
  return rows
}

function ProjectCardItem({project}: {project: ProjectCard}) {
  const slug = project.slug?.current
  const href = slug ? `/work/${slug}` : '#'

  return (
    <Link href={href} className="group block space-y-4">
      <div className="relative aspect-[636/358] overflow-hidden bg-neutral-100">
        {project.thumbnail && (
          <SanityImage
            image={project.thumbnail}
            alt={project.thumbnail.alt ?? project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex items-start justify-between gap-4 text-sm md:text-base">
        <p className="font-medium" style={{color: 'var(--section-heading)'}}>
          {project.title}
        </p>
        {project.categories?.length ? (
          <p className="text-right font-mono text-xs tracking-normal text-brand-charcoal md:text-sm">
            {project.categories.join(' / ')}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

export function TwoColCardsSection({block}: {block: TwoColCardsBlock}) {
  const showHeader = block.showHeader !== false
  const rows = chunkPairs(block.projects ?? [])

  return (
    <Section {...block}>
      <Container className="space-y-10 md:space-y-14">
        {showHeader && (
          <div className="space-y-8">
            {block.tagline && <Tagline>{block.tagline}</Tagline>}
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start md:gap-12">
              {block.heading && (
                <Heading
                  size={headingSizeFromBlock(block)}
                  style={{color: 'var(--section-heading)'}}
                >
                  {block.heading}
                </Heading>
              )}
              {block.button && <CmsButton button={block.button} className="shrink-0" />}
            </div>
          </div>
        )}
        <div className="space-y-8 md:space-y-12">
          {rows.map((row, rowIndex) => (
            <FadeIn
              key={row.map((project) => project._id).join('-')}
              className="grid gap-8 md:grid-cols-2 md:gap-x-10"
              delay={rowIndex === 0 ? 0 : 40}
            >
              {row.map((project) => (
                <ProjectCardItem key={project._id} project={project} />
              ))}
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  )
}
