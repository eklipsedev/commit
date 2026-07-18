import {defineArrayMember, defineField, defineType} from 'sanity'
import {BulletOutlineIcon, ComposeIcon, TextIcon} from '../../lib/icons'

export const overlayLabeledListType = defineType({
  name: 'overlayLabeledList',
  title: 'Labeled list',
  type: 'object',
  icon: BulletOutlineIcon,
  fields: [
    defineField({
      name: 'title',
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
      description: 'One line per item (fragmented text)',
    }),
  ],
  preview: {
    select: {title: 'title', items: 'items'},
    prepare({title, items}) {
      return {
        title: title || 'Labeled list',
        subtitle: `${items?.length ?? 0} items`,
        media: BulletOutlineIcon,
      }
    },
  },
})

export const overlayTextType = defineType({
  name: 'overlayText',
  title: 'Text',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          {title: 'Body', value: 'body'},
          {title: 'Caption (mono / fragmented note)', value: 'caption'},
        ],
        layout: 'radio',
      },
      initialValue: 'body',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'text', style: 'style'},
    prepare({title, style}) {
      return {
        title: title?.slice(0, 64) || 'Text',
        subtitle: style === 'caption' ? 'Caption' : 'Body',
        media: TextIcon,
      }
    },
  },
})

export const overlayStringListType = defineType({
  name: 'overlayStringList',
  title: 'String list',
  type: 'object',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. “Capabilities”',
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
          {title: '1', value: 1},
          {title: '2', value: 2},
          {title: '3', value: 3},
        ],
      },
      initialValue: 2,
    }),
  ],
  preview: {
    select: {title: 'label', items: 'items'},
    prepare({title, items}) {
      return {
        title: title || 'String list',
        subtitle: `${items?.length ?? 0} items`,
        media: ComposeIcon,
      }
    },
  },
})

const overlayModuleMembers = [
  defineArrayMember({type: 'overlayLabeledList'}),
  defineArrayMember({type: 'overlayText'}),
  defineArrayMember({type: 'overlayStringList'}),
]

export const overlayRowType = defineType({
  name: 'overlayRow',
  title: 'Overlay row',
  type: 'object',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Full width (span both columns)', value: 'full'},
          {title: 'Two columns', value: 'twoColumn'},
        ],
        layout: 'radio',
      },
      initialValue: 'twoColumn',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: overlayModuleMembers,
      hidden: ({parent}) => parent?.layout !== 'full',
    }),
    defineField({
      name: 'left',
      title: 'Left column',
      type: 'array',
      of: overlayModuleMembers,
      hidden: ({parent}) => parent?.layout !== 'twoColumn',
    }),
    defineField({
      name: 'right',
      title: 'Right column',
      type: 'array',
      of: overlayModuleMembers,
      hidden: ({parent}) => parent?.layout !== 'twoColumn',
    }),
  ],
  preview: {
    select: {layout: 'layout', modules: 'modules', left: 'left', right: 'right'},
    prepare({layout, modules, left, right}) {
      if (layout === 'full') {
        return {
          title: 'Full-width row',
          subtitle: `${modules?.length ?? 0} modules`,
          media: ComposeIcon,
        }
      }
      return {
        title: 'Two-column row',
        subtitle: `L ${left?.length ?? 0} · R ${right?.length ?? 0}`,
        media: ComposeIcon,
      }
    },
  },
})
