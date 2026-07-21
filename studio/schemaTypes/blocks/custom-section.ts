import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockContentIcon} from '../../lib/icons'
import {brandColorField, sectionSpacingFields, COLORS_FIELDSET} from '../shared/section-fields'

/**
 * Flexible section composed of nested modules.
 * Recreates the “custom” Figma layouts by stacking taglines, headlines,
 * splits, text grids, lists, attributes, steps, and buttons.
 */
export const customSectionType = defineType({
  name: 'customSection',
  title: 'Flexible section',
  type: 'object',
  icon: BlockContentIcon,
  description:
    'Compose a section from modules (tagline, headline, split, lists, attributes, steps, button).',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fieldsets: [COLORS_FIELDSET],
  fields: [
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      description:
        'Compose the section from reusable modules (tagline, headline, split, text grid, etc.)',
      of: [
        defineArrayMember({type: 'moduleTagline'}),
        defineArrayMember({type: 'moduleHeadline'}),
        defineArrayMember({type: 'moduleBody'}),
        defineArrayMember({type: 'moduleSplit'}),
        defineArrayMember({type: 'textGrid'}),
        defineArrayMember({type: 'moduleStringList'}),
        defineArrayMember({type: 'detailAttributes'}),
        defineArrayMember({type: 'moduleSteps'}),
        defineArrayMember({type: 'moduleButton'}),
      ],
      validation: (rule) => rule.min(1),
      group: 'content',
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...brandColorField('backgroundColor', 'Background color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('bodyColor', 'Body color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('accentColor', 'Accent color'), group: 'style', fieldset: 'colors'},
  ],
  preview: {
    select: {modules: 'modules'},
    prepare({modules}) {
      const count = modules?.length ?? 0
      const first = modules?.[0]?._type?.replace(/^module/, '') || 'Flexible'
      return {
        title: `Flexible section · ${count} module${count === 1 ? '' : 's'}`,
        subtitle: first,
        media: BlockContentIcon,
      }
    },
  },
})
