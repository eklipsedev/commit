import {defineField, defineType} from 'sanity'
import {CommentIcon} from '../../lib/icons'
import {brandColorField, COLORS_FIELDSET} from '../shared/section-fields'

/**
 * Reusable testimonial — quote + colors; person supplies name, role, photo.
 */
export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fieldsets: [COLORS_FIELDSET],
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
    brandColorField('backgroundColor', 'Background color', {fieldset: 'colors'}),
    brandColorField('textColor', 'Text color', {fieldset: 'colors'}),
  ],
  preview: {
    select: {
      title: 'person.name',
      subtitle: 'person.role',
      media: 'person.photo',
      quote: 'quote',
    },
    prepare({title, subtitle, media, quote}) {
      return {
        title: title || 'Testimonial',
        subtitle: subtitle || quote?.slice(0, 48),
        media: media ?? CommentIcon,
      }
    },
  },
})
