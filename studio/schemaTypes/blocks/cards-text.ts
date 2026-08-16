import {defineArrayMember, defineField, defineType} from 'sanity'
import {StackCompactIcon} from '../../lib/icons'
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

export const cardsTextType = defineType({
  name: 'cardsText',
  title: 'Offerings cards',
  type: 'object',
  icon: StackCompactIcon,
  description: 'Colored cards with supporting copy and an inline call to action.',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fieldsets: [COLORS_FIELDSET],
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'content',
    }),
    {...showTaglineRuleField({group: 'content'}), group: 'content'},
    defineField({
      name: 'heading',
      title: 'Section heading',
      type: 'text',
      rows: 3,
      description: 'Press Enter to control line breaks as designed in Figma.',
      group: 'content',
    }),
    defineField({
      name: 'cardsSource',
      title: 'Cards source',
      type: 'string',
      options: {
        list: [
          {title: 'All sales pages (Studio order)', value: 'salesPages'},
          {title: 'Hand-picked page cards', value: 'manual'},
          {title: 'Offering overlays', value: 'offerings'},
        ],
        layout: 'radio',
      },
      initialValue: 'salesPages',
      description:
        '“All sales pages” pulls every Sales Page in the order set under Sales Pages. Use hand-picked or offerings for curated/legacy sections.',
      group: 'content',
    }),
    defineField({
      name: 'cards',
      title: 'Page cards',
      type: 'array',
      description: 'Linked cards authored directly in this section.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'cardsTextCard',
          title: 'Card',
          fieldsets: [COLORS_FIELDSET],
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Supporting text',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'button',
              title: 'Button',
              type: 'button',
            }),
            brandColorField('backgroundColor', 'Card background', {
              required: true,
              fieldset: 'colors',
            }),
            brandColorField('headingColor', 'Title color', {fieldset: 'colors'}),
            brandColorField('bodyColor', 'Body color', {fieldset: 'colors'}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'body'},
          },
        }),
      ],
      hidden: ({parent}) => parent?.cardsSource !== 'manual',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {cardsSource?: string} | undefined
          if (parent?.cardsSource !== 'manual') return true
          return value?.length ? true : 'Add at least one card'
        }),
      group: 'content',
    }),
    defineField({
      name: 'offerings',
      title: 'Offerings',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'offering'}]})],
      description: 'Each card opens the shared offer overlay.',
      hidden: ({parent}) => parent?.cardsSource !== 'offerings',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {cardsSource?: string} | undefined
          if (parent?.cardsSource !== 'offerings') return true
          return value?.length ? true : 'Add at least one offering'
        }),
      group: 'content',
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...headingSizeField({group: 'style'}), group: 'style'},
    {...headingFontField({group: 'style'}), group: 'style'},
    {...collapseLineBreaksOnMobileField({group: 'style'}), group: 'style'},
    {...brandColorField('backgroundColor', 'Section background'), group: 'style', fieldset: 'colors'},
    {...brandColorField('headingColor', 'Section heading color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('bodyColor', 'Section body color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style', fieldset: 'colors'},
  ],
  preview: {
    select: {
      heading: 'heading',
      cardsSource: 'cardsSource',
      cards: 'cards',
      offerings: 'offerings',
      headingSize: 'headingSize',
      headingFont: 'headingFont',
    },
    prepare({heading, cardsSource, cards, offerings, headingSize, headingFont}) {
      const source =
        cardsSource === 'salesPages'
          ? 'all sales pages'
          : cardsSource === 'manual'
            ? `${cards?.length ?? 0} hand-picked`
            : `${offerings?.length ?? 0} offerings`
      return {
        title: heading || 'Offerings cards',
        subtitle: `Offerings cards · ${source} · ${headingSizeLabel(headingSize)} · ${headingFontLabel(headingFont)}`,
        media: StackCompactIcon,
      }
    },
  },
})
