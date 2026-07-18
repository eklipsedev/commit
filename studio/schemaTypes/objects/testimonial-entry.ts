import {defineField, defineType} from 'sanity'
import {CommentIcon} from '../../lib/icons'
import {brandColorField} from '../shared/section-fields'

/** Inline / one-off testimonial — person supplies name, role, photo. */
export const testimonialEntryType = defineType({
  name: 'testimonialEntry',
  title: 'One-off testimonial',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'person',
      title: 'Person',
      type: 'reference',
      to: [{type: 'person'}],
      options: {
        filter: 'kind == "testimonial"',
      },
      description: 'Photo, name, and role come from this person',
      validation: (rule) => rule.required(),
    }),
    brandColorField('backgroundColor', 'Background color'),
    brandColorField('textColor', 'Text color'),
  ],
  preview: {
    select: {
      title: 'person.name',
      subtitle: 'person.role',
      media: 'person.photo',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'One-off testimonial',
        subtitle: subtitle ? `${subtitle} · One-off` : 'One-off',
        media: media ?? CommentIcon,
      }
    },
  },
})
