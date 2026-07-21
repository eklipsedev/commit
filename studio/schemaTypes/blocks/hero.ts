import {defineField, defineType} from 'sanity'
import {BlockContentIcon} from '../../lib/icons'
import {
  brandColorField,
  collapseLineBreaksOnMobileField,
  sectionSpacingFields,
  COLORS_FIELDSET,
} from '../shared/section-fields'

export const heroType = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: BlockContentIcon,
  description: 'Page intro with large headline and optional tagline.',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fieldsets: [COLORS_FIELDSET],
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Mono label above the divider (e.g. “We help you commit.”)',
      group: 'content',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'richHeadline',
      description: 'Use italic for emphasis (e.g. “faster.”)',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...collapseLineBreaksOnMobileField({group: 'style'}), group: 'style'},
    {...brandColorField('backgroundColor', 'Background color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('bodyColor', 'Body color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style', fieldset: 'colors'},
  ],
  preview: {
    select: {tagline: 'tagline'},
    prepare({tagline}) {
      return {
        title: tagline || 'Hero',
        subtitle: 'Hero',
        media: BlockContentIcon,
      }
    },
  },
})
