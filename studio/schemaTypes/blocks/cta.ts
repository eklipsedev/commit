import {defineField, defineType} from 'sanity'
import {BoltIcon} from '../../lib/icons'
import {CtaBlockPreview, CtaObjectInput} from '../../components/site-default-cta-preview'
import {
  brandColorField,
  collapseLineBreaksOnMobileField,
  headingFontField,
  headingFontLabel,
  headingSizeField,
  headingSizeLabel,
  sectionSpacingFields,
  showTaglineRuleField,
  COLORS_FIELDSET,
} from '../shared/section-fields'

export const ctaType = defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  icon: BoltIcon,
  description:
    'Closing call-to-action. Leave fields blank to inherit from Config → Default CTA; fill only what you want to override.',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fieldsets: [COLORS_FIELDSET],
  components: {
    input: CtaObjectInput,
    preview: CtaBlockPreview,
  },
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'content',
    }),
    {...showTaglineRuleField({group: 'content'}), group: 'content'},
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'richHeadline',
      validation: (rule) =>
        rule.custom((value, context) => {
          // Site default document must define a headline.
          if (context.document?._type === 'defaultCta') {
            const blocks = value as unknown[] | undefined
            return blocks?.length ? true : 'Required'
          }
          // Projects: required when the custom CTA panel is shown.
          if (context.document?._type === 'project') {
            const blocks = value as unknown[] | undefined
            return blocks?.length ? true : 'Required'
          }
          // Page builder: blank inherits site default.
          return true
        }),
      group: 'content',
    }),
    defineField({
      name: 'button',
      title: 'Button',
      type: 'button',
      group: 'content',
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...headingSizeField({group: 'style', initialValue: 'lg'}), group: 'style'},
    {...headingFontField({group: 'style', initialValue: 'display'}), group: 'style'},
    {...collapseLineBreaksOnMobileField({group: 'style'}), group: 'style'},
    {...brandColorField('backgroundColor', 'Background color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style', fieldset: 'colors'},
  ],
  preview: {
    select: {
      tagline: 'tagline',
      headingSize: 'headingSize',
      headingFont: 'headingFont',
      headlineSize: 'headlineSize',
    },
    prepare({tagline, headingSize, headingFont, headlineSize}) {
      const size = headingSize ?? headlineSize
      return {
        title: tagline || 'CTA',
        subtitle: `CTA · ${headingSizeLabel(size)} · ${headingFontLabel(headingFont ?? 'display')}`,
        media: BoltIcon,
        tagline,
      }
    },
  },
})
