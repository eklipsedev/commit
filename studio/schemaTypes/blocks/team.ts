import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '../../lib/icons'
import {brandColorField, headingSizeField, sectionSpacingFields, headingSizeLabel} from '../shared/section-fields'

export const teamType = defineType({
  name: 'team',
  title: 'Team',
  type: 'object',
  icon: UsersIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'text',
      rows: 3,
      description: 'Press Enter to control line breaks as designed in Figma.',
      group: 'content',
    }),
    defineField({
      name: 'people',
      title: 'People',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'person'}],
          options: {
            filter: 'kind == "employee"',
          },
        }),
      ],
      validation: (rule) => rule.min(1),
      group: 'content',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [
          {title: '2', value: 2},
          {title: '3', value: 3},
          {title: '4', value: 4},
        ],
      },
      initialValue: 3,
      group: 'content',
    }),
    defineField({
      name: 'photoStyle',
      title: 'Photo style',
      type: 'string',
      options: {
        list: [
          {title: 'Centered / round', value: 'round'},
          {title: 'Anchored to bottom', value: 'anchored'},
        ],
        layout: 'radio',
      },
      initialValue: 'round',
      group: 'content',
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...headingSizeField({group: 'style'}), group: 'style'},
    {...brandColorField('backgroundColor', 'Background color'), group: 'style'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style'},
  ],
  preview: {
    select: {headline: 'headline', people: 'people', headingSize: 'headingSize'},
    prepare({headline, people, headingSize}) {
      return {
        title: headline || 'Team',
        subtitle: `Team · ${people?.length ?? 0} people · ${headingSizeLabel(headingSize)}`,
        media: UsersIcon,
      }
    },
  },
})
