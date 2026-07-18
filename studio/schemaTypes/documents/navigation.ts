import {defineArrayMember, defineField, defineType} from 'sanity'
import {MenuIcon} from '../../lib/icons'
import {imageAltField, imageFieldOptions} from '../shared/image-fields'

export const navigationType = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Supports static images and animated GIFs',
      options: imageFieldOptions(),
      fields: [imageAltField()],
    }),
    defineField({
      name: 'items',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({type: 'navItem'})],
    }),
    defineField({
      name: 'button',
      title: 'CTA button',
      type: 'button',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Navigation'}
    },
  },
})
