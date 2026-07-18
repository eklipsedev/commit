import {defineArrayMember, defineField, defineType} from 'sanity'
import {PackageIcon} from '../../lib/icons'
import {brandColorField} from '../shared/section-fields'

/**
 * Offerings open in a shared overlay pattern (see design/components/offer-overlay).
 * Overlay body uses rows: full-span or two-column stacks of labeled lists / text / captions.
 */
export const offeringType = defineType({
  name: 'offering',
  title: 'Offering',
  type: 'document',
  icon: PackageIcon,
  groups: [
    {name: 'card', title: 'Card', default: true},
    {name: 'overlay', title: 'Overlay'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Offer type',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'e.g. “Brand & Website”',
      group: 'card',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
      group: 'card',
    }),
    defineField({
      name: 'timeline',
      title: 'Card timeline',
      type: 'string',
      description: 'e.g. “(3+ Sprints)” — shown on cards',
      group: 'card',
    }),
    defineField({
      name: 'cardDescription',
      title: 'Card description',
      type: 'text',
      rows: 2,
      group: 'card',
    }),
    defineField({
      name: 'cardButtonLabel',
      title: 'Card button label',
      type: 'string',
      initialValue: 'Learn More',
      description: 'Opens the offer overlay',
      group: 'card',
    }),
    {
      ...brandColorField('cardBackgroundColor', 'Card background', {
        description: 'Also used as the offer overlay background',
      }),
      group: 'card',
    },
    {
      ...brandColorField('cardHeadingColor', 'Card heading / text', {
        description: 'Also used as the offer overlay text color',
      }),
      group: 'card',
    },
    {...brandColorField('cardBodyColor', 'Card body'), group: 'card'},
    {
      ...brandColorField('buttonBackgroundColor', 'Button background color'),
      group: 'card',
    },
    {...brandColorField('buttonTextColor', 'Button text color'), group: 'card'},

    defineField({
      name: 'snippet',
      title: 'Description / snippet',
      type: 'text',
      rows: 3,
      description: 'Mono line under the title (typical project scope note)',
      group: 'overlay',
    }),
    defineField({
      name: 'body',
      title: 'Overlay body',
      type: 'array',
      description:
        'Rows of content. Use two columns for side-by-side stacks, or full width to span both. Lists are fragmented line items.',
      of: [defineArrayMember({type: 'overlayRow'})],
      group: 'overlay',
    }),
    defineField({
      name: 'details',
      title: 'Attributes',
      type: 'detailAttributes',
      group: 'overlay',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'timeline'},
  },
})
