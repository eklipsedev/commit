import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '../../lib/icons'
import {LegalSlugInput} from '../../components/prefixed-slug-input'
import {collapseLineBreaksOnMobileField} from '../shared/section-fields'

export const legalPageType = defineType({
  name: 'legalPage',
  title: 'Legal page',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'footer', title: 'Footer'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Page heading',
      type: 'richHeadline',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    collapseLineBreaksOnMobileField({group: 'content'}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {maxLength: 96},
      components: {input: LegalSlugInput},
      validation: (rule) => rule.required(),
      description: 'URL path after /legal/',
      group: 'content',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
      validation: (rule) => rule.required(),
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
    select: {slug: 'slug.current'},
    prepare({slug}) {
      return {
        title: slug ? slug.replace(/-/g, ' ') : 'Legal page',
        subtitle: slug ? `/legal/${slug}` : undefined,
      }
    },
  },
})
