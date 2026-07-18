import {defineField, defineType} from 'sanity'
import {BoltIcon} from '../../lib/icons'

/**
 * Site-wide default CTA. Pages/projects can use this or override with custom copy.
 */
export const defaultCtaType = defineType({
  name: 'defaultCta',
  title: 'Default CTA',
  type: 'document',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Default CTA',
      hidden: true,
    }),
    defineField({
      name: 'cta',
      title: 'CTA',
      type: 'cta',
      description:
        'Used wherever a page or project chooses “Site default”. Edit once to update those placements.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {tagline: 'cta.tagline'},
    prepare({tagline}) {
      return {
        title: 'Default CTA',
        subtitle: tagline || 'Site-wide call to action',
        media: BoltIcon,
      }
    },
  },
})
