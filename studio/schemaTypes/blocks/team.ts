import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '../../lib/icons'
import {
  brandColorField,
  collapseLineBreaksOnMobileField,
  headingFontField,
  headingFontLabel,
  headingSizeField,
  sectionSpacingFields,
  headingSizeLabel,
  showTaglineRuleField,
  COLORS_FIELDSET,
} from '../shared/section-fields'

const personRef = defineArrayMember({
  type: 'reference',
  to: [{type: 'person'}],
  options: {
    filter: 'kind == "employee"',
  },
})

export const teamType = defineType({
  name: 'team',
  title: 'Team',
  type: 'object',
  icon: UsersIcon,
  description:
    'First two people in the list are large cards; the rest are smaller squares below. Click opens the person overlay.',
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
      name: 'headline',
      title: 'Headline',
      type: 'text',
      rows: 3,
      description: 'Press Enter to control line breaks as designed in Figma.',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Supportive text',
      type: 'text',
      rows: 4,
      description: 'Optional copy between the headline and people cards.',
      group: 'content',
    }),
    defineField({
      name: 'people',
      title: 'People',
      type: 'array',
      of: [personRef],
      description: 'First two appear as large cards; everyone after that is in the smaller grid.',
      group: 'content',
    }),
    // Legacy — hidden; no longer used in the UI.
    defineField({
      name: 'featuredPeople',
      title: 'Featured people',
      type: 'array',
      of: [personRef],
      hidden: true,
      group: 'content',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      hidden: true,
      group: 'content',
    }),
    defineField({
      name: 'photoStyle',
      title: 'Photo style',
      type: 'string',
      hidden: true,
      group: 'content',
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...headingSizeField({group: 'style'}), group: 'style'},
    {...headingFontField({group: 'style'}), group: 'style'},
    {...collapseLineBreaksOnMobileField({group: 'style'}), group: 'style'},
    {...brandColorField('backgroundColor', 'Background color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('bodyColor', 'Supportive text color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style', fieldset: 'colors'},
  ],
  preview: {
    select: {
      headline: 'headline',
      people: 'people',
      headingSize: 'headingSize',
      headingFont: 'headingFont',
    },
    prepare({headline, people, headingSize, headingFont}) {
      const count = people?.length ?? 0
      return {
        title: headline || 'Team',
        subtitle: `Team · ${count} people · ${headingSizeLabel(headingSize)} · ${headingFontLabel(headingFont)}`,
        media: UsersIcon,
      }
    },
  },
})
