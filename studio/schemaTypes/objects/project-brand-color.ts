import {defineField, defineType} from 'sanity'
import {ColorWheelIcon} from '../../lib/icons'
import {HexColorInput} from '../../components/hex-color-input'

/**
 * Named hex color for a single project's palette (outside the global brand tokens).
 */
export const projectBrandColorType = defineType({
  name: 'projectBrandColor',
  title: 'Project brand color',
  type: 'object',
  icon: ColorWheelIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. “Primary”, “Accent”, “Navy”',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hex',
      title: 'Hex',
      type: 'string',
      description: 'Include # — e.g. #1A2B3C',
      components: {input: HexColorInput},
      validation: (rule) =>
        rule
          .required()
          .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
            name: 'hex',
            invert: false,
          })
          .error('Use a hex color like #FEE064'),
    }),
  ],
  preview: {
    select: {title: 'label', hex: 'hex'},
    prepare({title, hex}) {
      return {
        title: title || 'Color',
        subtitle: hex,
      }
    },
  },
})
