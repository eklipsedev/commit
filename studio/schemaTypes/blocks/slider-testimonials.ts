import {defineArrayMember, defineField, defineType} from 'sanity'
import {CommentIcon} from '../../lib/icons'
import {brandColorField, sectionSpacingFields, COLORS_FIELDSET} from '../shared/section-fields'

export const sliderTestimonialsType = defineType({
  name: 'sliderTestimonials',
  title: 'Testimonials',
  type: 'object',
  icon: CommentIcon,
  description: 'One testimonial stands alone; two or more become a slider.',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fieldsets: [COLORS_FIELDSET],
  fields: [
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      description:
        'One item renders stand-alone; two or more become a slider. Reference an existing testimonial (with optional color overrides), or add a one-off.',
      of: [
        defineArrayMember({
          type: 'testimonialReference',
          title: 'Existing testimonial',
        }),
        defineArrayMember({
          type: 'testimonialEntry',
          title: 'One-off testimonial',
        }),
      ],
      validation: (rule) => rule.min(1),
      group: 'content',
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...brandColorField('backgroundColor', 'Section background'), group: 'style', fieldset: 'colors'},
  ],
  preview: {
    select: {testimonials: 'testimonials'},
    prepare({testimonials}) {
      const count = testimonials?.length ?? 0
      return {
        title: 'Testimonials',
        subtitle:
          count === 1 ? 'Single testimonial' : `Slider · ${count} items`,
        media: CommentIcon,
      }
    },
  },
})
