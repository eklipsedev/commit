import {defineArrayMember, defineField, defineType} from 'sanity'
import {
  BlockContentIcon,
  BoltIcon,
  BulletOutlineIcon,
  NumberIcon,
  TextIcon,
} from '../../lib/icons'
import {buttonHasContent} from './button'
import {
  collapseLineBreaksOnMobileField,
  headingSizeField,
  headingSizeLabel,
} from '../shared/section-fields'

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
    collapseLineBreaksOnMobileField(),
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

const SPLIT_COLUMN_MODULES = [
  defineArrayMember({type: 'moduleTagline'}),
  defineArrayMember({type: 'moduleHeadline'}),
  defineArrayMember({type: 'moduleBody'}),
  defineArrayMember({type: 'textGrid'}),
  defineArrayMember({type: 'moduleStringList'}),
  defineArrayMember({type: 'detailAttributes'}),
  defineArrayMember({type: 'moduleSteps'}),
  defineArrayMember({type: 'moduleButton'}),
]

export const moduleSplitType = defineType({
  name: 'moduleSplit',
  title: 'Split row',
  type: 'object',
  icon: BlockContentIcon,
  description:
    'One or two columns. Add any modules to each column (except nested split rows).',
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'number',
      options: {
        list: [
          {title: '1 column', value: 1},
          {title: '2 columns', value: 2},
        ],
        layout: 'radio',
      },
      initialValue: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: SPLIT_COLUMN_MODULES,
      description: 'Stack modules in a single full-width column.',
      hidden: ({parent}) => parent?.layout !== 1,
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {layout?: number} | undefined
          if (parent?.layout !== 1) return true
          return value?.length ? true : 'Add at least one module'
        }),
    }),
    defineField({
      name: 'left',
      title: 'Left column',
      type: 'array',
      of: SPLIT_COLUMN_MODULES,
      description: 'Optional — leave empty to keep this column blank.',
      hidden: ({parent}) => parent?.layout !== 2,
    }),
    defineField({
      name: 'right',
      title: 'Right column',
      type: 'array',
      of: SPLIT_COLUMN_MODULES,
      description: 'Optional — leave empty to keep this column blank.',
      hidden: ({parent}) => parent?.layout !== 2,
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {
            layout?: number
            left?: unknown[]
          } | undefined
          if (parent?.layout !== 2) return true
          if (parent.left?.length || value?.length) return true
          return 'Add modules to at least one column'
        }),
    }),
  ],
  preview: {
    select: {layout: 'layout', content: 'content', left: 'left', right: 'right'},
    prepare({layout, content, left, right}) {
      const cols = layout === 1 ? 1 : 2
      const count =
        cols === 1
          ? (content?.length ?? 0)
          : (left?.length ?? 0) + (right?.length ?? 0)
      const emptyHint =
        cols === 2 && (!(left?.length) || !(right?.length)) && count > 0
          ? !(left?.length)
            ? ' · right only'
            : ' · left only'
          : ''
      return {
        title: 'Split row',
        subtitle: `${cols} column${cols === 1 ? '' : 's'} · ${count} module${count === 1 ? '' : 's'}${emptyHint}`,
        media: BlockContentIcon,
      }
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
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stringListItem',
          title: 'One-off item',
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
            prepare({title}) {
              return {title: title || 'Untitled item'}
            },
          },
        }),
        defineArrayMember({
          type: 'reference',
          to: [{type: 'service'}],
          title: 'Service',
        }),
      ],
      validation: (rule) => rule.min(1),
      description:
        'Mix one-off lines and shared Services in any order. Create services under Services in the desk.',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [
          {title: '1', value: 1},
          {title: '2', value: 2},
          {title: '3', value: 3},
        ],
      },
      initialValue: 2,
    }),
    defineField({
      name: 'itemSize',
      title: 'Item text size',
      type: 'string',
      options: {
        list: [
          {title: 'Small — 20px', value: 'sm'},
          {title: 'Medium — 32px', value: 'md'},
        ],
        layout: 'radio',
      },
      initialValue: 'sm',
      description: 'Applies to all list items.',
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
