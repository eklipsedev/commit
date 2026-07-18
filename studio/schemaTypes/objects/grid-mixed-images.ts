import {defineField, defineType} from 'sanity'
import {
  GridMixedImagesInput,
  GridMixedSlotField,
} from '../../components/grid-mixed-images-input'
import {imageAltField, imageFieldOptions} from '../shared/image-fields'

function slotImage(name: string, title: string) {
  return defineField({
    name,
    title,
    type: 'image',
    options: imageFieldOptions(),
    fields: [imageAltField()],
    validation: (rule) => rule.required(),
    components: {field: GridMixedSlotField},
  })
}

/**
 * Fixed 7-image collage matching the Offerings “look at what you might get” layout.
 *
 * ┌──────────┬──────────┐
 * │ topLeft  │ topRight │
 * ├────┬─────┼────┬─────┤
 * │tall│ ctr │ rgt│
 * ├────┼─────┴────┴─────┤
 * │bot │   bottomWide   │
 * └────┴────────────────┘
 */
export const gridMixedImagesType = defineType({
  name: 'gridMixedImages',
  title: 'Grid mixed images',
  type: 'object',
  components: {input: GridMixedImagesInput},
  fields: [
    slotImage('topLeft', 'Top left'),
    slotImage('topRight', 'Top right'),
    slotImage('leftTall', 'Left tall'),
    slotImage('centerSquare', 'Center square'),
    slotImage('rightSquare', 'Right square'),
    slotImage('bottomLeft', 'Bottom left'),
    slotImage('bottomWide', 'Bottom wide'),
  ],
})
