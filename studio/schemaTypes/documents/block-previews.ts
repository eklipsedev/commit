import {defineField, defineType} from 'sanity'
import {ImagesIcon} from '../../lib/icons'

/**
 * Page-builder block types that can show insert-menu thumbnails.
 * Keep in sync with `page-builder.ts` members.
 */
export const BLOCK_PREVIEW_FIELDS = [
  {name: 'hero', title: 'Hero'},
  {name: 'textColumns', title: 'Tagline + statement'},
  {name: 'cta', title: 'CTA'},
  {name: 'twoColCards', title: 'Project cards'},
  {name: 'cardsText', title: 'Offerings cards'},
  {name: 'gridMixed', title: 'Image collage'},
  {name: 'listText', title: 'Ruled list'},
  {name: 'gridText', title: 'Linked text cards'},
  {name: 'twoColImage', title: 'Image + story'},
  {name: 'team', title: 'Team'},
  {name: 'sliderTestimonials', title: 'Testimonials'},
  {name: 'logos', title: 'Logos'},
  {name: 'customSection', title: 'Flexible section'},
] as const

export type BlockPreviewType = (typeof BLOCK_PREVIEW_FIELDS)[number]['name']

/**
 * Singleton: authors upload section screenshots used in the page-builder insert menu.
 */
export const blockPreviewsType = defineType({
  name: 'blockPreviews',
  title: 'Section previews',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'note',
      title: 'About',
      type: 'string',
      readOnly: true,
      initialValue:
        'These images appear as thumbnails when inserting page-builder sections (grid view).',
    }),
    ...BLOCK_PREVIEW_FIELDS.map((block) =>
      defineField({
        name: block.name,
        title: block.title,
        type: 'image',
        options: {hotspot: false},
        description: `Screenshot for “${block.title}” in the insert menu.`,
      }),
    ),
  ],
  preview: {
    prepare() {
      return {
        title: 'Section previews',
        subtitle: 'Page builder insert menu thumbnails',
        media: ImagesIcon,
      }
    },
  },
})
