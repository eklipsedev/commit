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
      name: 'showTaglineRule',
      title: 'Show label rule',
      type: 'boolean',
      initialValue: true,
      description: 'When off, the line under the section label is hidden.',
      hidden: ({parent}) => !parent?.label,
    }),
    defineField({
      name: 'valueSize',
      title: 'Value text size',
      type: 'string',
      options: {
        list: [
          {title: 'Small — 20px', value: 'sm'},
          {title: 'Medium — 32px (24px mobile)', value: 'md'},
        ],
        layout: 'radio',
      },
      initialValue: 'md',
      description: 'Applies to attribute values (not the mono labels). Medium uses 24px on mobile.',
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
    select: {label: 'label', attributes: 'attributes', valueSize: 'valueSize'},
    prepare({label, attributes, valueSize}) {
      const sizeLabel =
        valueSize === 'sm'
          ? 'Small (20px)'
          : valueSize === 'md' || valueSize === 'lg'
            ? 'Medium (32px)'
            : null
      return {
        title: label || 'Detail attributes',
        subtitle: [attributes?.length != null ? `${attributes.length} attributes` : null, sizeLabel]
          .filter(Boolean)
          .join(' · '),
        media: BulletOutlineIcon,
      }
    },
  },
})
