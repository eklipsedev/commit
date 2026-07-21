import {defineField, defineType} from 'sanity'
import {UserIcon} from '../../lib/icons'
import {imageAltField, imageFieldOptions} from '../shared/image-fields'
import {brandColorField, COLORS_FIELDSET} from '../shared/section-fields'

/**
 * Person — either a Commit employee (team + about overlay) or a
 * testimonial subject (photo / name / role referenced by testimonials).
 */
export const personType = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UserIcon,
  groups: [
    {name: 'card', title: 'Card', default: true},
    {name: 'overlay', title: 'Overlay'},
  ],
  fieldsets: [COLORS_FIELDSET],
  fields: [
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Employee', value: 'employee'},
          {title: 'Testimonial', value: 'testimonial'},
        ],
        layout: 'radio',
      },
      initialValue: 'employee',
      validation: (rule) => rule.required(),
      group: 'card',
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'card',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      group: 'card',
      hidden: ({document}) => document?.kind === 'testimonial',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Job title / affiliation shown on cards and testimonials',
      group: 'card',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: imageFieldOptions(),
      fields: [imageAltField()],
      group: 'card',
    }),
    {
      ...brandColorField('cardBackgroundColor', 'Card background'),
      group: 'card',
      fieldset: 'colors',
      hidden: ({document}) => document?.kind === 'testimonial',
    },
    {
      ...brandColorField('cardHoverBackgroundColor', 'Card hover / modal background', {
        fieldset: 'colors',
        description:
          'Shown in the corners on card hover, and used as the about modal background.',
      }),
      group: 'card',
      hidden: ({document}) => document?.kind === 'testimonial',
    },
    {
      ...brandColorField('buttonBackgroundColor', 'Button background color'),
      group: 'card',
      fieldset: 'colors',
      hidden: ({document}) => document?.kind === 'testimonial',
    },
    {
      ...brandColorField('buttonTextColor', 'Button text color'),
      group: 'card',
      fieldset: 'colors',
      hidden: ({document}) => document?.kind === 'testimonial',
    },

    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'portableText',
      description: 'About overlay body',
      group: 'overlay',
      hidden: ({document}) => document?.kind === 'testimonial',
    }),
    {
      ...brandColorField('textColor', 'Modal text color', {
        fieldset: 'colors',
        description: 'Text color inside the about modal',
      }),
      group: 'overlay',
      hidden: ({document}) => document?.kind === 'testimonial',
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo', kind: 'kind'},
    prepare({title, subtitle, media, kind}) {
      const kindLabel = kind === 'testimonial' ? 'Testimonial' : 'Employee'
      return {
        title: title || 'Person',
        subtitle: subtitle ? `${kindLabel} · ${subtitle}` : kindLabel,
        media,
      }
    },
  },
})
