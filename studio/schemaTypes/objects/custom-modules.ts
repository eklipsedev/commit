import {defineArrayMember, defineField, defineType} from 'sanity'
import {
  BlockContentIcon,
  BoltIcon,
  BulletOutlineIcon,
  NumberIcon,
  TextIcon,
} from '../../lib/icons'
import {buttonHasContent} from './button'
import {headingSizeField, headingSizeLabel} from '../shared/section-fields'

export const moduleTaglineType = defineType({
  name: 'moduleTagline',
  title: 'Tagline',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Tagline',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Mono label above a divider',
    }),
  ],
  preview: {
    select: {title: 'text'},
    prepare({title}) {
      return {title: title || 'Tagline', subtitle: 'Tagline', media: TextIcon}
    },
  },
})

export const moduleHeadlineType = defineType({
  name: 'moduleHeadline',
  title: 'Headline',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Headline',
      type: 'richHeadline',
      validation: (rule) => rule.required(),
    }),
    headingSizeField({initialValue: 'md'}),
    defineField({
      name: 'fullWidth',
      title: 'Full width',
      type: 'boolean',
      initialValue: false,
      description: 'Off = max-width 4xl (default). On = span the full content width.',
    }),
  ],
  preview: {
    select: {headingSize: 'headingSize', fullWidth: 'fullWidth'},
    prepare({headingSize, fullWidth}) {
      return {
        title: 'Headline',
        subtitle: `${headingSizeLabel(headingSize)}${fullWidth ? ' · Full width' : ''}`,
        media: BlockContentIcon,
      }
    },
  },
})

export const moduleBodyType = defineType({
  name: 'moduleBody',
  title: 'Body',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Body',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'text'},
    prepare({title}) {
      return {
        title: title?.slice(0, 60) || 'Body',
        subtitle: 'Body',
        media: TextIcon,
      }
    },
  },
})

export const moduleSplitType = defineType({
  name: 'moduleSplit',
  title: 'Split row',
  type: 'object',
  icon: BlockContentIcon,
  description: 'Headline on the left, body or list on the right',
  fields: [
    defineField({
      name: 'headline',
      title: 'Left headline',
      type: 'richHeadline',
    }),
    headingSizeField({initialValue: 'md'}),
    defineField({
      name: 'rightType',
      title: 'Right content',
      type: 'string',
      options: {
        list: [
          {title: 'Body text', value: 'body'},
          {title: 'String list', value: 'list'},
          {title: 'Text grid', value: 'textGrid'},
        ],
        layout: 'radio',
      },
      initialValue: 'body',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      hidden: ({parent}) => parent?.rightType !== 'body',
    }),
    defineField({
      name: 'listItems',
      title: 'List items',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      hidden: ({parent}) => parent?.rightType !== 'list',
    }),
    defineField({
      name: 'listColumns',
      title: 'List columns',
      type: 'number',
      options: {
        list: [
          {title: '1', value: 1},
          {title: '2', value: 2},
        ],
      },
      initialValue: 2,
      hidden: ({parent}) => parent?.rightType !== 'list',
    }),
    defineField({
      name: 'textGrid',
      title: 'Text grid',
      type: 'textGrid',
      hidden: ({parent}) => parent?.rightType !== 'textGrid',
    }),
    defineField({
      name: 'button',
      title: 'Button (optional)',
      type: 'button',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Split row', subtitle: 'Split', media: BlockContentIcon}
    },
  },
})

export const moduleStringListType = defineType({
  name: 'moduleStringList',
  title: 'String list',
  type: 'object',
  icon: BulletOutlineIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Optional mono label above the list',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [
          {title: '2', value: 2},
          {title: '3', value: 3},
        ],
      },
      initialValue: 2,
    }),
    defineField({
      name: 'showRules',
      title: 'Show horizontal rules',
      type: 'boolean',
      initialValue: false,
      description: 'List-text style dividers between rows',
    }),
    defineField({
      name: 'button',
      title: 'Button (optional)',
      type: 'button',
    }),
    defineField({
      name: 'buttonPlacement',
      title: 'Button placement',
      type: 'string',
      options: {
        list: [
          {title: 'Below list', value: 'below'},
          {title: 'Right of list', value: 'beside'},
        ],
        layout: 'radio',
      },
      initialValue: 'below',
      hidden: ({parent}) => !parent?.button?.label,
      description: 'Place the button under the list, or aligned to the right of it.',
    }),
  ],
  preview: {
    select: {label: 'label', items: 'items'},
    prepare({label, items}) {
      return {
        title: label || 'String list',
        subtitle: `${items?.length ?? 0} items`,
        media: BulletOutlineIcon,
      }
    },
  },
})

export const moduleStepsType = defineType({
  name: 'moduleSteps',
  title: 'Numbered steps',
  type: 'object',
  icon: NumberIcon,
  fields: [
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'moduleStep',
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
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {steps: 'steps'},
    prepare({steps}) {
      return {
        title: 'Numbered steps',
        subtitle: `${steps?.length ?? 0} steps`,
        media: NumberIcon,
      }
    },
  },
})

export const moduleButtonType = defineType({
  name: 'moduleButton',
  title: 'Button',
  type: 'object',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'button',
      title: 'Button',
      type: 'button',
      validation: (rule) =>
        rule.custom((value) => {
          if (!buttonHasContent(value as Parameters<typeof buttonHasContent>[0])) {
            return 'Button is required'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {title: 'button.label'},
    prepare({title}) {
      return {title: title || 'Button', subtitle: 'Button', media: BoltIcon}
    },
  },
})
