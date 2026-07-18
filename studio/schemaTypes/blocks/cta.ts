import {defineField, defineType} from 'sanity'
import {BoltIcon} from '../../lib/icons'
import {brandColorField, headingSizeField, headingSizeLabel, sectionSpacingFields} from '../shared/section-fields'

export const ctaType = defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  icon: BoltIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fields: [
    defineField({
      name: 'useSiteDefault',
      title: 'Use site default CTA',
      type: 'boolean',
      description:
        'Pulls tagline, headline, and button from Settings → Default CTA. Style options below still apply.',
      initialValue: false,
      group: 'content',
      // Singleton already *is* the default; projects pick custom via ctaMode.
      hidden: ({document}) =>
        document?._type === 'defaultCta' || document?._type === 'project',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'content',
      hidden: ({parent, document}) =>
        document?._type !== 'defaultCta' &&
        document?._type !== 'project' &&
        Boolean(parent?.useSiteDefault),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'richHeadline',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {useSiteDefault?: boolean} | undefined
          const document = context.document
          if (
            document?._type !== 'defaultCta' &&
            document?._type !== 'project' &&
            parent?.useSiteDefault
          ) {
            return true
          }
          const blocks = value as unknown[] | undefined
          return blocks?.length ? true : 'Required'
        }),
      group: 'content',
      hidden: ({parent, document}) =>
        document?._type !== 'defaultCta' &&
        document?._type !== 'project' &&
        Boolean(parent?.useSiteDefault),
    }),
    defineField({
      name: 'button',
      title: 'Button',
      type: 'button',
      group: 'content',
      hidden: ({parent, document}) =>
        document?._type !== 'defaultCta' &&
        document?._type !== 'project' &&
        Boolean(parent?.useSiteDefault),
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...headingSizeField({group: 'style', initialValue: 'lg'}), group: 'style'},
    {...brandColorField('backgroundColor', 'Background color'), group: 'style'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style'},
  ],
  preview: {
    select: {
      tagline: 'tagline',
      useSiteDefault: 'useSiteDefault',
      headingSize: 'headingSize',
      headlineSize: 'headlineSize',
    },
    prepare({tagline, useSiteDefault, headingSize, headlineSize}) {
      const size = headingSize ?? headlineSize
      return {
        title: useSiteDefault ? 'Site default CTA' : tagline || 'CTA',
        subtitle: `CTA · ${headingSizeLabel(size)}`,
        media: BoltIcon,
      }
    },
  },
})
