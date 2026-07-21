import {defineArrayMember, defineField, defineType} from 'sanity'
import {BulletOutlineIcon} from '../../lib/icons'

/**
 * Editable labeled attributes (Flat Fee, Timeline, Potential Team, Time Commitment, etc.).
 * Values support one or many lines (e.g. team roles).
 * Offerings seed a standard set via `DEFAULT_OFFERING_DETAILS` — this object stays
 * flexible so custom sections can use different labels.
 */
export const detailAttributesType = defineType({
  name: 'detailAttributes',
  title: 'Detail attributes',
  type: 'object',
  icon: BulletOutlineIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Section label',
      type: 'string',
      description: 'e.g. “The details.”',
      initialValue: 'The details.',
    }),
    defineField({
      name: 'attributes',
      title: 'Attributes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'detailAttribute',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'e.g. “Flat Fee”, “Timeline”',
            }),
            defineField({
              name: 'values',
              title: 'Values',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
              validation: (rule) => rule.min(1),
              description: 'One value, or multiple lines (e.g. team roles)',
            }),
          ],
          preview: {
            select: {title: 'label', values: 'values'},
            prepare({title, values}) {
              return {
                title,
                subtitle: Array.isArray(values) ? values.join(', ') : undefined,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {label: 'label', attributes: 'attributes'},
    prepare({label, attributes}) {
      return {
        title: label || 'Detail attributes',
        subtitle: `${attributes?.length ?? 0} attributes`,
        media: BulletOutlineIcon,
      }
    },
  },
})
