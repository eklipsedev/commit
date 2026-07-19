import {notFound} from 'next/navigation'
import {CaseStudyHero} from '@/components/case-study/hero'
import {CaseStudyMediaGrid} from '@/components/case-study/media-grid'
import {CaseStudyOverview} from '@/components/case-study/overview'
import {CaseStudyProjectNav} from '@/components/case-study/project-nav'
import {CaseStudyTestimonial} from '@/components/case-study/project-testimonial'
import {SetFooterAppearance} from '@/components/layout/set-footer-appearance'
import {CtaSection} from '@/components/page-builder/cta-section'
import {Container} from '@/components/ui/container'
import {Heading} from '@/components/ui/heading'
import {resolveProjectCta, type CtaContent} from '@/lib/resolve-cta'
import {sanityFetch} from '@/sanity/live'
import {PROJECT_BY_SLUG_QUERY} from '@/sanity/queries'
import type {CaseStudyProject, PageBuilderBlock} from '@/sanity/types'

type PageProps = {
  params: Promise<{slug: string}>
}

export default async function WorkProjectPage({params}: PageProps) {
  const {slug} = await params
  const {data} = await sanityFetch({
    query: PROJECT_BY_SLUG_QUERY,
    params: {slug},
  })

  if (!data) notFound()

  const project = data as CaseStudyProject & {
    ctaMode?: 'default' | 'custom' | 'hidden'
    defaultCta?: CtaContent
  }
  const categoryLine = project.categories?.filter(Boolean).join(' / ')
  const hasOverview = Boolean(
    project.overviewBody?.length || project.overviewServices?.length,
  )


  const resolvedCta = resolveProjectCta(project.ctaMode, project.cta, project.defaultCta)
  const ctaBlock = resolvedCta
    ? ({
        _key: 'case-study-cta',
        _type: 'cta',
        ...resolvedCta,
      } as PageBuilderBlock & CtaContent)
    : null

  return (
    <>
      <SetFooterAppearance appearance={project.footerAppearance} />

      <article className="pb-16 md:pb-24">
        <CaseStudyHero
          mediaType={project.heroMediaType}
          image={project.heroImage}
          video={project.heroVideo}
          title={project.title}
        />

        <div className="space-y-16 pt-6 md:space-y-24 md:pt-8">
          <Container className="space-y-6 md:space-y-8">
            {(project.title || categoryLine) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {project.title && (
                  <Heading size="md" as="h5" className="text-brand-charcoal">
                    {project.title}
                  </Heading>
                )}
                {categoryLine && (
                  <p className="font-mono text-xs tracking-normal text-brand-charcoal md:text-sm">
                    {categoryLine}
                  </p>
                )}
              </div>
            )}

            {project.headline && (
              <Heading
                size="xl"
                as="h1"
                className="text-brand-charcoal"
                collapseLineBreaksOnMobile={project.collapseLineBreaksOnMobile}
              >
                {project.headline}
              </Heading>
            )}
          </Container>

          {hasOverview && (
            <CaseStudyOverview
              body={project.overviewBody}
              services={project.overviewServices}
            />
          )}

          {project.mediaRows?.length ? (
            <CaseStudyMediaGrid rows={project.mediaRows} />
          ) : null}

          <CaseStudyTestimonial
            testimonials={project.testimonials}
            legacyTestimonial={project.testimonial}
          />

          <CaseStudyProjectNav currentId={project._id} siblings={project.siblings} />

          {ctaBlock && <CtaSection block={ctaBlock} />}
        </div>
      </article>
    </>
  )
}
