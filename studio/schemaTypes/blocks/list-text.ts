import {defineArrayMember, defineField, defineType} from 'sanity'
import {BulletOutlineIcon} from '../../lib/icons'
import {
  brandColorField,
  collapseLineBreaksOnMobileField,
  headingFontField,
  headingFontLabel,
  headingSizeField,
  sectionSpacingFields,
  headingSizeLabel,
  COLORS_FIELDSET,
} from '../shared/section-fields'

export const listTextType = defineType({
  name: 'listText',
  title: 'Ruled list',
  type: 'object',
  icon: BulletOutlineIcon,
  description: 'Multi-column benefit/outcome list with horizontal rules between items.',
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
      description: 'Sentence case — shown above the list without a full-width rule.',
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
    {...headingFontField({group: 'style'}), group: 'style'},
    {...collapseLineBreaksOnMobileField({group: 'style'}), group: 'style'},
    {...brandColorField('backgroundColor', 'Background color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('bodyColor', 'Body color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style', fieldset: 'colors'},
  ],
  preview: {
    select: {tagline: 'tagline', items: 'items', headingSize: 'headingSize', headingFont: 'headingFont'},
    prepare({tagline, items, headingSize, headingFont}) {
      return {
        title: tagline || 'Ruled list',
        subtitle: `Ruled list · ${items?.length ?? 0} items · ${headingSizeLabel(headingSize)} · ${headingFontLabel(headingFont)}`,
        media: BulletOutlineIcon,
      }
    },
  },
})
