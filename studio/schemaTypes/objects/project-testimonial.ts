import {defineField, defineType} from 'sanity'
import {CommentIcon} from '../../lib/icons'
import {ProjectBrandColorInput} from '../../components/project-brand-color-input'

function projectBrandColorField(name: string, title: string, description?: string) {
  return defineField({
    name,
    title,
    type: 'string',
    description,
    components: {
      input: ProjectBrandColorInput,
    },
  })
}

/**
 * Project-page testimonial placement: reference + optional colors from
 * Commit brand tokens or this project's brandPalette.
 */
export const projectTestimonialType = defineType({
  name: 'projectTestimonial',
  title: 'Testimonial',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'reference',
      to: [{type: 'testimonial'}],
      validation: (rule) => rule.required(),
    }),
    projectBrandColorField(
      'backgroundColor',
      'Background color override',
      'Leave empty to use the testimonial’s own background. Pick a Commit brand color or a color from this project’s palette.',
    ),
    projectBrandColorField(
      'textColor',
      'Text color override',
      'Leave empty to use the testimonial’s own text color. Pick a Commit brand color or a color from this project’s palette.',
    ),
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
        title: title || 'Testimonial',
        subtitle: overrides.length
          ? `${subtitle || 'Referenced'} · override: ${overrides.join(', ')}`
          : subtitle || 'Referenced',
        media: media ?? CommentIcon,
      }
    },
  },
})
