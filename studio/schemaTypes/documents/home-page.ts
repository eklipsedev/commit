import {defineField, defineType} from 'sanity'
import {HomeIcon} from '../../lib/icons'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'footer', title: 'Footer'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Home',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'pageBuilder',
      group: 'content',
    }),
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
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Home'}
    },
  },
})
