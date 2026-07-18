import {defineArrayMember, defineField, defineType} from 'sanity'
import {ComposeIcon} from '../../lib/icons'

/** Labeled columns of string lists — used in custom sections. */
export const textGridType = defineType({
  name: 'textGrid',
  title: 'Text grid',
  type: 'object',
  icon: ComposeIcon,
  fields: [
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
      initialValue: 2,
    }),
    defineField({
      name: 'groups',
      title: 'Groups',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'textGridGroup',
          fields: [
            defineField({
              name: 'title',
              title: 'Group title',
              type: 'string',
              description: 'Optional — omit for a flat unlabeled list',
            }),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
              validation: (rule) => rule.min(1),
            }),
          ],
          preview: {
            select: {title: 'title', items: 'items'},
            prepare({title, items}) {
              return {
                title: title || 'Untitled group',
                subtitle: `${items?.length ?? 0} items`,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {groups: 'groups'},
    prepare({groups}) {
      return {
        title: 'Text grid',
        subtitle: `${groups?.length ?? 0} groups`,
        media: ComposeIcon,
      }
    },
  },
})
