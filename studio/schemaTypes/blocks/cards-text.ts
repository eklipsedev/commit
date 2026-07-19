import {defineArrayMember, defineField, defineType} from 'sanity'
import {StackCompactIcon} from '../../lib/icons'
import {
  brandColorField,
  collapseLineBreaksOnMobileField,
  headingSizeField,
  sectionSpacingFields,
  headingSizeLabel,
} from '../shared/section-fields'

export const cardsTextType = defineType({
  name: 'cardsText',
  title: 'Cards text',
  type: 'object',
  icon: StackCompactIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Section heading',
      type: 'text',
      rows: 3,
      description: 'Press Enter to control line breaks as designed in Figma.',
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
    {...headingSizeField({group: 'style'}), group: 'style'},
    {...collapseLineBreaksOnMobileField({group: 'style'}), group: 'style'},
    {...brandColorField('backgroundColor', 'Section background'), group: 'style'},
    {...brandColorField('headingColor', 'Section heading color'), group: 'style'},
  ],
  preview: {
    select: {heading: 'heading', offerings: 'offerings', headingSize: 'headingSize'},
    prepare({heading, offerings, headingSize}) {
      return {
        title: heading || 'Cards text',
        subtitle: `Cards text · ${offerings?.length ?? 0} offerings · ${headingSizeLabel(headingSize)}`,
        media: StackCompactIcon,
      }
    },
  },
})
