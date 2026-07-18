import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockContentIcon} from '../../lib/icons'
import {brandColorField, sectionSpacingFields} from '../shared/section-fields'

/**
 * Flexible section composed of nested modules.
 * Recreates the “custom” Figma layouts by stacking taglines, headlines,
 * splits, text grids, lists, attributes, steps, and buttons.
 */
export const customSectionType = defineType({
  name: 'customSection',
  title: 'Custom',
  type: 'object',
  icon: BlockContentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
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
    {...brandColorField('backgroundColor', 'Background color'), group: 'style'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style'},
    {...brandColorField('bodyColor', 'Body color'), group: 'style'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style'},
    {...brandColorField('accentColor', 'Accent color'), group: 'style'},
  ],
  preview: {
    select: {modules: 'modules'},
    prepare({modules}) {
      const count = modules?.length ?? 0
      const first = modules?.[0]?._type?.replace(/^module/, '') || 'Custom'
      return {
        title: `Custom · ${count} module${count === 1 ? '' : 's'}`,
        subtitle: first,
        media: BlockContentIcon,
      }
    },
  },
})
