import {defineField, defineType} from 'sanity'
import {SearchIcon} from '../../lib/icons'
import {
  SeoDescriptionInput,
  SeoTitleInput,
} from '../../components/seo-character-count-input'

const SEO_TITLE_MAX = 60
const SEO_DESCRIPTION_MAX = 160

/**
 * Site-wide SEO defaults. Pages/projects override title, description, image, and noIndex.
 */
export const defaultSeoType = defineType({
  name: 'defaultSeo',
  title: 'Default SEO',
  type: 'document',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
      description:
        'Appended to page titles in search results and the browser tab (e.g. “About | Commit”).',
      initialValue: 'Commit',
      validation: (rule) => rule.required().max(SEO_TITLE_MAX),
    }),
    defineField({
      name: 'title',
      title: 'Default SEO title',
      type: 'string',
      description: `Fallback when a page has no SEO title (often used for Home). Keep under ${SEO_TITLE_MAX} characters.`,
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
      title: 'Default SEO description',
      type: 'text',
      rows: 3,
      description: `Fallback meta description when a page leaves it blank. Keep under ${SEO_DESCRIPTION_MAX} characters.`,
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
      title: 'Default Open Graph image',
      type: 'image',
      description:
        'Used for social sharing when a page does not set its own Open Graph image. Recommended ~1200×630.',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {siteName: 'siteName', description: 'description', media: 'image'},
    prepare({siteName, description, media}) {
      return {
        title: 'Default SEO',
        subtitle: siteName || description || 'Site-wide search & social defaults',
        media: media || SearchIcon,
      }
    },
  },
})
