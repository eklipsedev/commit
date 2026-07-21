import {defineArrayMember, defineField, defineType} from 'sanity'
import {ComposeIcon} from '../../lib/icons'

/** Labeled columns of string lists — used in custom sections / split rows. */
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
      name: 'itemSize',
      title: 'Item text size',
      type: 'string',
      options: {
        list: [
          {title: 'Small — 20px', value: 'sm'},
          {title: 'Medium — 32px', value: 'md'},
        ],
        layout: 'radio',
      },
      initialValue: 'sm',
      description: 'Applies to all group items in this grid.',
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
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'textGridItem',
                  title: 'One-off item',
                  fields: [
                    defineField({
                      name: 'text',
                      title: 'Text',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: {
                    select: {title: 'text'},
                    prepare({title}) {
                      return {title: title || 'Untitled item'}
                    },
                  },
                }),
                defineArrayMember({
                  type: 'reference',
                  to: [{type: 'service'}],
                  title: 'Service',
                }),
              ],
              validation: (rule) => rule.min(1),
              description:
                'Mix one-off lines and shared Services in any order. Create services under Services in the desk.',
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
    select: {groups: 'groups', itemSize: 'itemSize'},
    prepare({groups, itemSize}) {
      const sizeLabel = itemSize === 'md' ? '32px' : '20px'
      return {
        title: 'Text grid',
        subtitle: `${groups?.length ?? 0} groups · ${sizeLabel}`,
        media: ComposeIcon,
      }
    },
  },
})
