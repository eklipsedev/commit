import {createElement} from 'react'
import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {OfferingColorMedia} from '../../components/offering-color-media'
import {PackageIcon} from '../../lib/icons'
import {DEFAULT_OFFERING_MODULES} from '../shared/offering-defaults'
import {FLEXIBLE_SECTION_MODULES} from '../shared/flexible-section-fields'
import {brandColorField, COLORS_FIELDSET} from '../shared/section-fields'

/**
 * Offerings open in a shared overlay pattern (see design/components/offer-overlay).
 * Overlay body uses the same modules as Flexible sections (split rows, lists, attributes, etc.).
 */
export const offeringType = defineType({
  name: 'offering',
  title: 'Offering',
  type: 'document',
  icon: PackageIcon,
  orderings: [orderRankOrdering],
  groups: [
    {name: 'card', title: 'Card', default: true},
    {name: 'overlay', title: 'Overlay'},
  ],
  fieldsets: [COLORS_FIELDSET],
  fields: [
    orderRankField({type: 'offering', newItemPosition: 'before'}),
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
        fieldset: 'colors',
        description: 'Also used as the offer overlay background',
      }),
      group: 'card',
    },
    {
      ...brandColorField('cardHeadingColor', 'Card heading / text', {
        fieldset: 'colors',
        description: 'Also used as the offer overlay text color',
      }),
      group: 'card',
    },
    {...brandColorField('cardBodyColor', 'Card body'), group: 'card', fieldset: 'colors'},
    {
      ...brandColorField('buttonBackgroundColor', 'Button background color'),
      group: 'card',
      fieldset: 'colors',
    },
    {...brandColorField('buttonTextColor', 'Button text color'), group: 'card', fieldset: 'colors'},

    defineField({
      name: 'snippet',
      title: 'Description / snippet',
      type: 'text',
      rows: 3,
      description: 'Mono line under the title (typical project scope note)',
      group: 'overlay',
    }),
    defineField({
      name: 'modules',
      title: 'Overlay content',
      type: 'array',
      description:
        'Same modules as Flexible sections — split rows, string lists, attributes, steps, etc.',
      of: FLEXIBLE_SECTION_MODULES,
      initialValue: DEFAULT_OFFERING_MODULES,
      group: 'overlay',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'timeline',
      background: 'cardBackgroundColor',
      foreground: 'cardHeadingColor',
    },
    prepare({title, subtitle, background, foreground}) {
      return {
        title: title || 'Offering',
        subtitle,
        media: createElement(OfferingColorMedia, {background, foreground}),
      }
    },
  },
})
