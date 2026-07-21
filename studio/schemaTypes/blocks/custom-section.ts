import {defineType} from 'sanity'
import {BlockContentIcon} from '../../lib/icons'
import {CustomSectionInput} from '../../components/custom-section-input'
import {
  COLORS_FIELDSET,
  flexibleSectionContentFields,
} from '../shared/flexible-section-fields'

/**
 * Flexible section composed of nested modules.
 * Recreates the “custom” Figma layouts by stacking taglines, headlines,
 * splits, text grids, lists, attributes, steps, and buttons.
 *
 * New sections can start blank or copy a Flexible section template
 * (Config → Flexible section templates). Copies are independent.
 */
export const customSectionType = defineType({
  name: 'customSection',
  title: 'Flexible section',
  type: 'object',
  icon: BlockContentIcon,
  description:
    'Compose from modules, or start from a Flexible section template (copy, then edit freely).',
  components: {
    input: CustomSectionInput,
  },
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fieldsets: [COLORS_FIELDSET],
  fields: flexibleSectionContentFields({modulesRequired: true}),
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
