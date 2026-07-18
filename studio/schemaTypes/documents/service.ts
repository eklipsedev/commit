import {defineField, defineType} from 'sanity'
import {BulletOutlineIcon} from '../../lib/icons'

/**
 * Reusable project scope / service label (e.g. “Brand Strategy”).
 * Referenced from case study overviews — not a standalone page.
 */
export const serviceType = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: BulletOutlineIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. “Brand Strategy”, “Visual Identity”',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {
        title: title || 'Service',
        media: BulletOutlineIcon,
      }
    },
  },
})
