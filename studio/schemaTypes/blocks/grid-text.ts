import {defineArrayMember, defineField, defineType} from 'sanity'
import {ComposeIcon} from '../../lib/icons'
import {brandColorField, sectionSpacingFields, COLORS_FIELDSET} from '../shared/section-fields'

export const gridTextType = defineType({
  name: 'gridText',
  title: 'Linked text cards',
  type: 'object',
  icon: ComposeIcon,
  description:
    'Title + body cards that link out (audience pages, topics). Columns follow item count (max 4).',
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
      group: 'content',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'gridTextItem',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'link',
              description: 'Powers the “Learn More” hover action',
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'body'},
          },
        }),
      ],
      validation: (rule) => rule.min(1),
      group: 'content',
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...brandColorField('backgroundColor', 'Background color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('bodyColor', 'Body color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('accentColor', 'Accent / button color'), group: 'style', fieldset: 'colors'},
  ],
  preview: {
    select: {tagline: 'tagline', items: 'items'},
    prepare({tagline, items}) {
      return {
        title: tagline || 'Linked text cards',
        subtitle: `Linked text cards · ${items?.length ?? 0} items`,
        media: ComposeIcon,
      }
    },
  },
})
