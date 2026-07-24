import {defineArrayMember, defineField, defineType} from 'sanity'
import {StackCompactIcon} from '../../lib/icons'
import {
  brandColorField,
  sectionSpacingFields,
  COLORS_FIELDSET,
} from '../shared/section-fields'

export const cardsTextType = defineType({
  name: 'cardsText',
  title: 'Offerings cards',
  type: 'object',
  icon: StackCompactIcon,
  description: 'Colored offering cards that open the offer overlay on click.',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fieldsets: [COLORS_FIELDSET],
  fields: [
    defineField({
      name: 'heading',
      title: 'Section heading',
      type: 'text',
      rows: 3,
      description:
        'Small mono label above the cards (tagline size, sentence case, no rule). Press Enter for line breaks.',
      group: 'content',
    }),
    defineField({
      name: 'offerings',
      title: 'Offerings',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'offering'}]})],
      validation: (rule) => rule.min(1),
      description: 'Each card opens the shared offer overlay',
      group: 'content',
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...brandColorField('backgroundColor', 'Section background'), group: 'style', fieldset: 'colors'},
    {...brandColorField('headingColor', 'Section heading color'), group: 'style', fieldset: 'colors'},
  ],
  preview: {
    select: {heading: 'heading', offerings: 'offerings'},
    prepare({heading, offerings}) {
      return {
        title: heading || 'Offerings cards',
        subtitle: `Offerings cards · ${offerings?.length ?? 0} offerings`,
        media: StackCompactIcon,
      }
    },
  },
})
