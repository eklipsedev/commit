import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImageIcon} from '../../lib/icons'
import {brandColorField, sectionSpacingFields} from '../shared/section-fields'

function refKey(id: string) {
  return id.replace(/^drafts\./, '').replace(/[^a-zA-Z0-9]/g, '').slice(-12) || 'logo'
}

/**
 * Logos section — references reusable `logo` documents.
 * New blocks pre-fill logos marked “Include in default logo set”.
 */
export const logosType = defineType({
  name: 'logos',
  title: 'Logos',
  type: 'object',
  icon: ImageIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          {title: 'Full width (marquee)', value: 'fullWidth'},
          {title: 'Limited (wrap at 6)', value: 'limited'},
        ],
        layout: 'radio',
      },
      initialValue: 'fullWidth',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      description:
        'Pre-filled from logos marked “Include in default logo set”. Reorder, remove, or add freely.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'logo'}],
          options: {disableNew: false},
        }),
      ],
      validation: (rule) => rule.min(1),
      group: 'content',
      initialValue: async (_params, context) => {
        const client = context.getClient({apiVersion: '2025-01-01'})
        const ids = await client.fetch<string[]>(
          `*[_type == "logo" && includeInDefaultSet == true && !(_id in path("drafts.**"))] | order(name asc)._id`,
        )
        if (!ids?.length) return []
        return ids.map((id) => ({
          _type: 'reference' as const,
          _ref: id,
          _key: refKey(id),
        }))
      },
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...brandColorField('backgroundColor', 'Background color'), group: 'style'},
  ],
  preview: {
    select: {variant: 'variant', logos: 'logos'},
    prepare({variant, logos}) {
      return {
        title: `${logos?.length ?? 0} logos`,
        subtitle: `Logos · ${variant === 'limited' ? 'Limited' : 'Full width'}`,
        media: ImageIcon,
      }
    },
  },
})
