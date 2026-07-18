import {defineArrayMember, defineField, defineType} from 'sanity'
import {LinkIcon} from '../../lib/icons'

export const navItemType = defineType({
  name: 'navItem',
  title: 'Nav item',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
    }),
    defineField({
      name: 'children',
      title: 'Nested links',
      type: 'array',
      of: [defineArrayMember({type: 'navItem'})],
    }),
  ],
  preview: {
    select: {title: 'label'},
  },
})

export const linkColumnType = defineType({
  name: 'linkColumn',
  title: 'Link column',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Column title',
      type: 'string',
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {title: 'title', links: 'links'},
    prepare({title, links}) {
      return {
        title: title || 'Link column',
        subtitle: `${links?.length ?? 0} links`,
      }
    },
  },
})
