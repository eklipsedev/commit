import {defineArrayMember, defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '../../lib/icons'

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'footer', title: 'Footer'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Page heading',
      type: 'richHeadline',
      description: 'e.g. “Let’s begin.”',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'e.g. “Reach out to get started”',
      group: 'content',
    }),
    defineField({
      name: 'attributes',
      title: 'Contact attributes',
      description: 'Editable rows (name, email, phone, etc.)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contactAttribute',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Optional — leave blank to show value only',
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'link',
              description:
                'Optional. For email/phone, set link type accordingly — validation applies there. Link label is optional when value is already set.',
            }),
          ],
          preview: {
            select: {title: 'value', subtitle: 'label'},
          },
        }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'footerAppearance',
      title: 'Footer appearance',
      type: 'footerAppearance',
      description: 'Per-page overrides for the shared footer (e.g. subscribe hover colors)',
      group: 'footer',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Contact'}
    },
  },
})
