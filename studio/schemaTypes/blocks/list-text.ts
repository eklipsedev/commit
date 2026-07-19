import {defineArrayMember, defineField, defineType} from 'sanity'
import {BulletOutlineIcon} from '../../lib/icons'
import {
  brandColorField,
  collapseLineBreaksOnMobileField,
  headingSizeField,
  sectionSpacingFields,
  headingSizeLabel,
} from '../shared/section-fields'

export const listTextType = defineType({
  name: 'listText',
  title: 'List text',
  type: 'object',
  icon: BulletOutlineIcon,
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
      name: 'showTaglineRule',
      title: 'Show tagline rule',
      type: 'boolean',
      initialValue: true,
      description: 'When off, the line under the tagline is hidden and its spacing is removed.',
      hidden: ({parent}) => !parent?.tagline,
      group: 'content',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'richHeadline',
      description: 'Optional — used on sales pages that combine a hero line with a list',
      group: 'content',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
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
        ],
      },
      initialValue: 2,
      group: 'content',
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...headingSizeField({group: 'style'}), group: 'style'},
    {...collapseLineBreaksOnMobileField({group: 'style'}), group: 'style'},
    {...brandColorField('backgroundColor', 'Background color'), group: 'style'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style'},
    {...brandColorField('bodyColor', 'Body color'), group: 'style'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style'},
  ],
  preview: {
    select: {tagline: 'tagline', items: 'items', headingSize: 'headingSize'},
    prepare({tagline, items, headingSize}) {
      return {
        title: tagline || 'List text',
        subtitle: `List text · ${items?.length ?? 0} items · ${headingSizeLabel(headingSize)}`,
        media: BulletOutlineIcon,
      }
    },
  },
})
