import {defineField, defineType} from 'sanity'
import {TextIcon} from '../../lib/icons'
import {brandColorField, collapseLineBreaksOnMobileField, sectionSpacingFields} from '../shared/section-fields'

export const textColumnsType = defineType({
  name: 'textColumns',
  title: 'Text columns',
  type: 'object',
  icon: TextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
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
    {...brandColorField('backgroundColor', 'Background color'), group: 'style'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style'},
    {...brandColorField('bodyColor', 'Body color'), group: 'style'},
  ],
  preview: {
    select: {tagline: 'tagline', body: 'body'},
    prepare({tagline, body}) {
      return {
        title: tagline || body?.slice(0, 48) || 'Text columns',
        subtitle: 'Text columns',
        media: TextIcon,
      }
    },
  },
})
