import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockElementIcon} from '../../lib/icons'
import {imageAltField, imageFieldOptions} from '../shared/image-fields'
import {brandColorField, COLORS_FIELDSET} from '../shared/section-fields'

export const footerType = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: imageFieldOptions(),
      fields: [imageAltField()],
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright text',
      type: 'string',
      description: 'Year is set programmatically in the frontend (e.g. “Commit, All Rights Reserved”).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal links',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
    }),
    defineField({
      name: 'linkColumns',
      title: 'Link columns',
      type: 'array',
      of: [defineArrayMember({type: 'linkColumn'})],
    }),
    defineField({
      name: 'newsletter',
      title: 'Newsletter',
      type: 'object',
      fieldsets: [COLORS_FIELDSET],
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'text',
          rows: 3,
          description: 'Press Enter to control line breaks (e.g. “Sign up for news” / “and updates”).',
        }),
        defineField({
          name: 'placeholder',
          title: 'Placeholder text',
          type: 'string',
        }),
        defineField({
          name: 'buttonText',
          title: 'Button text',
          type: 'string',
          initialValue: 'Subscribe',
        }),
        defineField({
          name: 'buttonVariant',
          title: 'Button variant',
          type: 'string',
          options: {
            list: [
              {title: 'Primary (filled)', value: 'primary'},
              {title: 'Secondary (outlined)', value: 'secondary'},
            ],
            layout: 'radio',
          },
          initialValue: 'secondary',
        }),
        brandColorField('buttonBackgroundColor', 'Button background color', {
          fieldset: 'colors',
          description: 'Default subscribe button fill',
        }),
        brandColorField('buttonTextColor', 'Button text color', {
          fieldset: 'colors',
          description: 'Default subscribe button text',
        }),
        brandColorField('buttonHoverBackgroundColor', 'Button hover background', {
          fieldset: 'colors',
          description: 'Default hover fill — pages can still override this',
        }),
        brandColorField('buttonHoverTextColor', 'Button hover text', {
          fieldset: 'colors',
          description: 'Default hover text — pages can still override this',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Footer'}
    },
  },
})
