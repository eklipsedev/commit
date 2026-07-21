import {defineField, defineType} from 'sanity'
import {SearchIcon} from '../../lib/icons'
import {
  SeoDescriptionInput,
  SeoTitleInput,
} from '../../components/seo-character-count-input'

const SEO_TITLE_MAX = 60
const SEO_DESCRIPTION_MAX = 160

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'SEO title',
      type: 'string',
      description: `Overrides the page title in search results. Leave blank to use the page heading, then site Default SEO. Keep under ${SEO_TITLE_MAX} characters.`,
      components: {
        input: SeoTitleInput,
      },
      validation: (rule) =>
        rule
          .max(SEO_TITLE_MAX)
          .error(`SEO title must be ${SEO_TITLE_MAX} characters or fewer`),
    }),
    defineField({
      name: 'description',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      description: `Leave blank to use the site Default SEO description. Keep under ${SEO_DESCRIPTION_MAX} characters.`,
      components: {
        input: SeoDescriptionInput,
      },
      validation: (rule) =>
        rule
          .max(SEO_DESCRIPTION_MAX)
          .error(`SEO description must be ${SEO_DESCRIPTION_MAX} characters or fewer`),
    }),
    defineField({
      name: 'image',
      title: 'Open Graph image',
      type: 'image',
      description: 'Leave blank to use the site Default SEO Open Graph image.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
