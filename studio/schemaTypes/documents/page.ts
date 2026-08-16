import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {DocumentIcon} from '../../lib/icons'
import {brandColorField, COLORS_FIELDSET} from '../shared/section-fields'

export const pageType = defineType({
  name: 'page',
  title: 'Landing page',
  type: 'document',
  icon: DocumentIcon,
  orderings: [orderRankOrdering],
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'card', title: 'Sales card'},
    {name: 'footer', title: 'Footer'},
    {name: 'seo', title: 'SEO'},
  ],
  fieldsets: [COLORS_FIELDSET],
  fields: [
    orderRankField({type: 'page', newItemPosition: 'before'}),
    defineField({
      name: 'kind',
      title: 'Page kind',
      type: 'string',
      options: {
        list: [
          {title: 'Landing page', value: 'general'},
          {title: 'Sales page', value: 'sales'},
        ],
        layout: 'radio',
      },
      initialValue: 'general',
      description:
        'Sales pages appear in the Sales Pages library, Offerings cards, and the Offerings nav dropdown.',
      group: 'content',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'pageBuilder',
      group: 'content',
    }),

    // —— Sales card / nav presentation (only for kind == sales) ——
    defineField({
      name: 'navLabel',
      title: 'Nav label',
      type: 'string',
      description: 'Label in the Offerings dropdown. Defaults to the card title.',
      hidden: ({document}) => document?.kind !== 'sales',
      group: 'card',
    }),
    defineField({
      name: 'cardTitle',
      title: 'Card title',
      type: 'text',
      rows: 2,
      description: 'Title on Offerings cards. Press Enter for line breaks.',
      hidden: ({document}) => document?.kind !== 'sales',
      group: 'card',
    }),
    defineField({
      name: 'cardBody',
      title: 'Card body',
      type: 'text',
      rows: 3,
      hidden: ({document}) => document?.kind !== 'sales',
      group: 'card',
    }),
    defineField({
      name: 'cardButtonLabel',
      title: 'Card button label',
      type: 'string',
      initialValue: 'Learn More',
      hidden: ({document}) => document?.kind !== 'sales',
      group: 'card',
    }),
    {
      ...brandColorField('cardBackgroundColor', 'Card background', {fieldset: 'colors'}),
      group: 'card',
      hidden: ({document}) => document?.kind !== 'sales',
    },
    {
      ...brandColorField('cardHeadingColor', 'Card title color', {fieldset: 'colors'}),
      group: 'card',
      hidden: ({document}) => document?.kind !== 'sales',
    },
    {
      ...brandColorField('cardBodyColor', 'Card body color', {fieldset: 'colors'}),
      group: 'card',
      hidden: ({document}) => document?.kind !== 'sales',
    },
    {
      ...brandColorField('buttonTextColor', 'Button resting text / border', {fieldset: 'colors'}),
      group: 'card',
      hidden: ({document}) => document?.kind !== 'sales',
    },
    {
      ...brandColorField('buttonHoverBackgroundColor', 'Button hover fill', {fieldset: 'colors'}),
      group: 'card',
      hidden: ({document}) => document?.kind !== 'sales',
    },
    {
      ...brandColorField('buttonHoverTextColor', 'Button hover text', {fieldset: 'colors'}),
      group: 'card',
      hidden: ({document}) => document?.kind !== 'sales',
    },

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
    select: {
      title: 'title',
      slug: 'slug.current',
      kind: 'kind',
    },
    prepare({title, slug, kind}) {
      const kindLabel = kind === 'sales' ? 'Sales' : 'Landing'
      return {
        title: title || 'Untitled',
        subtitle: `${kindLabel} · /${slug || ''}`,
      }
    },
  },
})
