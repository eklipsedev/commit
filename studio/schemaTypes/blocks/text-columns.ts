import {defineField, defineType} from 'sanity'
import {TextIcon} from '../../lib/icons'
import {
  brandColorField,
  collapseLineBreaksOnMobileField,
  sectionSpacingFields,
  COLORS_FIELDSET,
} from '../shared/section-fields'

export const textColumnsType = defineType({
  name: 'textColumns',
  title: 'Tagline + statement',
  type: 'object',
  icon: TextIcon,
  description: 'Tagline with rule, then a large statement block on the right half.',
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
      description: 'Mono text above the divider',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      description: 'Primary copy on the right side of the split',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...collapseLineBreaksOnMobileField({group: 'style'}), group: 'style'},
    {...brandColorField('backgroundColor', 'Background color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('bodyColor', 'Body color'), group: 'style', fieldset: 'colors'},
  ],
  preview: {
    select: {tagline: 'tagline', body: 'body'},
    prepare({tagline, body}) {
      return {
        title: tagline || body?.slice(0, 48) || 'Tagline + statement',
        subtitle: 'Tagline + statement',
        media: TextIcon,
      }
    },
  },
})
