import {defineField, defineType} from 'sanity'
import {CommentIcon} from '../../lib/icons'
import {brandColorField, COLORS_FIELDSET} from '../shared/section-fields'

/**
 * Reuses a testimonial document with optional color overrides for this placement.
 */
export const testimonialReferenceType = defineType({
  name: 'testimonialReference',
  title: 'Existing testimonial',
  type: 'object',
  icon: CommentIcon,
  fieldsets: [COLORS_FIELDSET],
  fields: [
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'reference',
      to: [{type: 'testimonial'}],
      validation: (rule) => rule.required(),
    }),
    brandColorField('backgroundColor', 'Background color override', {
      fieldset: 'colors',
      description: 'Leave empty to use the testimonial’s own background color',
    }),
    brandColorField('textColor', 'Text color override', {
      fieldset: 'colors',
      description: 'Leave empty to use the testimonial’s own text color',
    }),
  ],
  preview: {
    select: {
      title: 'testimonial.person.name',
      subtitle: 'testimonial.person.role',
      media: 'testimonial.person.photo',
      backgroundColor: 'backgroundColor',
      textColor: 'textColor',
    },
    prepare({title, subtitle, media, backgroundColor, textColor}) {
      const overrides = [backgroundColor && 'bg', textColor && 'text'].filter(Boolean)
      return {
        title: title || 'Existing testimonial',
        subtitle: overrides.length
          ? `${subtitle || 'Referenced'} · override: ${overrides.join(', ')}`
          : subtitle || 'Referenced',
        media: media ?? CommentIcon,
      }
    },
  },
})
