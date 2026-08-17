import {defineArrayMember, defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {ImagesIcon} from '../../lib/icons'
import {WorkSlugInput} from '../../components/prefixed-slug-input'
import {imageAltField, imageFieldOptions} from '../shared/image-fields'
import {collapseLineBreaksOnMobileField} from '../shared/section-fields'

const caseStudyImageFields = [imageAltField()]

/**
 * Project card + structured case study detail page.
 */
export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: ImagesIcon,
  orderings: [orderRankOrdering],
  groups: [
    {name: 'card', title: 'Card', default: true},
    {name: 'caseStudy', title: 'Case study'},
    {name: 'footer', title: 'Footer'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    orderRankField({type: 'project', newItemPosition: 'before'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Client / project name shown on cards and under the hero',
      group: 'card',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      components: {input: WorkSlugInput},
      validation: (rule) => rule.required(),
      description: 'URL path after /work/',
      group: 'card',
    }),
    defineField({
      name: 'thumbnailMediaType',
      title: 'Card media',
      type: 'string',
      options: {
        list: [
          {title: 'Image / GIF', value: 'image'},
          {title: 'Video (looping)', value: 'video'},
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      description:
        'Card background on work grids. GIFs upload as images; MP4s use Mux and loop muted like a background.',
      group: 'card',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail image / GIF',
      type: 'image',
      options: imageFieldOptions(),
      fields: caseStudyImageFields,
      validation: (rule) => rule.required(),
      description:
        'Still or animated GIF. Required even for video cards (poster, SEO, and fallback).',
      group: 'card',
    }),
    defineField({
      name: 'thumbnailVideo',
      title: 'Thumbnail video',
      type: 'mux.video',
      description: 'Muted, looping, autoplaying card background (Mux).',
      hidden: ({parent}) => parent?.thumbnailMediaType !== 'video',
      group: 'card',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {thumbnailMediaType?: string} | undefined
          if (parent?.thumbnailMediaType !== 'video') return true
          return value ? true : 'Add a looping video for this card'
        }),
    }),
    defineField({
      name: 'categories',
      title: 'Categories / industries',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      description: 'e.g. “Investment Firm”, “Finance” — used on cards and under the hero',
      group: 'card',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'Short blurb for cards / listings',
      group: 'card',
    }),

    // —— Case study template ——
    defineField({
      name: 'heroMediaType',
      title: 'Hero media',
      type: 'string',
      options: {
        list: [
          {title: 'Image / GIF', value: 'image'},
          {title: 'Video (looping background)', value: 'video'},
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      group: 'caseStudy',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image / GIF',
      type: 'image',
      options: imageFieldOptions(),
      fields: caseStudyImageFields,
      hidden: ({parent}) => parent?.heroMediaType === 'video',
      group: 'caseStudy',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero video',
      type: 'mux.video',
      description: 'Plays muted, looping, and autoplaying as a background.',
      hidden: ({parent}) => parent?.heroMediaType !== 'video',
      group: 'caseStudy',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Optional mono line above the headline (e.g. “Case Study / Finance”)',
      group: 'caseStudy',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'text',
      rows: 3,
      description: 'Large display headline. Press Enter for line breaks.',
      group: 'caseStudy',
    }),
    {
      ...collapseLineBreaksOnMobileField(),
      group: 'caseStudy',
    },
    defineField({
      name: 'overviewBody',
      title: 'Overview body',
      type: 'portableText',
      description: 'Project story — shown on the right half under the “Project Overview” tagline',
      group: 'caseStudy',
    }),
    defineField({
      name: 'overviewCollapsible',
      title: 'Collapse overview body into a dropdown',
      type: 'boolean',
      initialValue: true,
      description:
        'On by default. Turn off for short overviews so the text is always visible without the (+) toggle.',
      group: 'caseStudy',
      hidden: ({document}) => !(document?.overviewBody as unknown[] | undefined)?.length,
    }),
    defineField({
      name: 'overviewServices',
      title: 'Overview services',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
      description:
        'Scope items shown as a two-column list. Create shared services under Services, or add new ones inline.',
      group: 'caseStudy',
    }),
    defineField({
      name: 'mediaRows',
      title: 'Media grid',
      type: 'array',
      description:
        'Full-width image/GIF, two columns, or a video block with cover image. Gap is 1.25rem.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'mediaRow',
          fields: [
            defineField({
              name: 'layout',
              title: 'Layout',
              type: 'string',
              options: {
                list: [
                  {title: 'Full width image / GIF', value: 'full'},
                  {title: 'Two columns', value: 'twoCol'},
                  {title: 'Video', value: 'video'},
                ],
                layout: 'radio',
              },
              initialValue: 'full',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image / GIF',
              type: 'image',
              options: imageFieldOptions(),
              fields: caseStudyImageFields,
              hidden: ({parent}) => parent?.layout !== 'full',
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as {layout?: string} | undefined
                  if (parent?.layout !== 'full') return true
                  return value ? true : 'Add an image for full-width rows'
                }),
            }),
            defineField({
              name: 'leftImage',
              title: 'Left image / GIF',
              type: 'image',
              options: imageFieldOptions(),
              fields: caseStudyImageFields,
              hidden: ({parent}) => parent?.layout !== 'twoCol',
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as {layout?: string} | undefined
                  if (parent?.layout !== 'twoCol') return true
                  return value ? true : 'Add a left image'
                }),
            }),
            defineField({
              name: 'rightImage',
              title: 'Right image / GIF',
              type: 'image',
              options: imageFieldOptions(),
              fields: caseStudyImageFields,
              hidden: ({parent}) => parent?.layout !== 'twoCol',
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as {layout?: string} | undefined
                  if (parent?.layout !== 'twoCol') return true
                  return value ? true : 'Add a right image'
                }),
            }),
            defineField({
              name: 'video',
              title: 'Video',
              type: 'mux.video',
              description: 'Optimized Mux video — plays when the visitor taps the cover.',
              hidden: ({parent}) => parent?.layout !== 'video',
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as {layout?: string} | undefined
                  if (parent?.layout !== 'video') return true
                  return value ? true : 'Add a video'
                }),
            }),
            defineField({
              name: 'videoLoop',
              title: 'Loop as background video',
              type: 'boolean',
              initialValue: false,
              description:
                'Autoplays muted on loop with no controls — for ambient / GIF-like clips. Off = click-to-play with controls.',
              hidden: ({parent}) => parent?.layout !== 'video',
            }),
            defineField({
              name: 'poster',
              title: 'Cover image',
              type: 'image',
              description: 'Shown before play. Falls back to a Mux frame if empty.',
              options: imageFieldOptions(),
              fields: caseStudyImageFields,
              hidden: ({parent}) => parent?.layout !== 'video' || Boolean(parent?.videoLoop),
            }),
          ],
          preview: {
            select: {
              layout: 'layout',
              full: 'image',
              left: 'leftImage',
              right: 'rightImage',
              poster: 'poster',
              videoLoop: 'videoLoop',
            },
            prepare({layout, full, left, right, poster, videoLoop}) {
              const title =
                layout === 'twoCol'
                  ? 'Two columns'
                  : layout === 'video'
                    ? videoLoop
                      ? 'Video (looping)'
                      : 'Video'
                    : 'Full width'
              const media =
                layout === 'twoCol' ? left || right : layout === 'video' ? poster : full
              return {
                title,
                subtitle: 'Media row',
                media,
              }
            },
          },
        }),
      ],
      group: 'caseStudy',
    }),
    defineField({
      name: 'brandPalette',
      title: 'Project brand palette',
      type: 'array',
      of: [defineArrayMember({type: 'projectBrandColor'})],
      description:
        'Custom colors for this project (beyond the Commit brand tokens). Available when overriding testimonial colors below.',
      group: 'caseStudy',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [defineArrayMember({type: 'projectTestimonial'})],
      description:
        'One item renders as a stand-alone quote; two or more become a slider. Reference existing testimonials and optionally override colors from Commit brand or this project’s palette.',
      group: 'caseStudy',
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial (legacy)',
      type: 'reference',
      to: [{type: 'testimonial'}],
      hidden: true,
      deprecated: {
        reason: 'Use the Testimonials array instead',
      },
      group: 'caseStudy',
    }),
    defineField({
      name: 'ctaMode',
      title: 'Closing CTA',
      type: 'string',
      options: {
        list: [
          {title: 'Site default', value: 'default'},
          {title: 'Custom', value: 'custom'},
          {title: 'Hide', value: 'hidden'},
        ],
        layout: 'radio',
      },
      initialValue: 'default',
      description:
        'Site default is edited under Settings → Default CTA. Choose Custom to set unique copy on this project.',
      group: 'caseStudy',
    }),
    defineField({
      name: 'cta',
      title: 'Custom CTA',
      type: 'cta',
      description: 'Only used when Closing CTA is set to Custom',
      hidden: ({parent}) => parent?.ctaMode !== 'custom',
      group: 'caseStudy',
    }),

    defineField({
      name: 'footerAppearance',
      title: 'Footer appearance',
      type: 'footerAppearance',
      description: 'Per-page overrides for the shared footer (e.g. subscribe hover colors)',
      group: 'footer',
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title', media: 'thumbnail', categories: 'categories'},
    prepare({title, media, categories}) {
      return {
        title,
        media,
        subtitle: Array.isArray(categories) ? categories.join(' / ') : undefined,
      }
    },
  },
})
