import {defineField, defineType} from 'sanity'
import {ImagesIcon} from '../../lib/icons'
import {brandColorField, headingSizeField, sectionSpacingFields, headingSizeLabel} from '../shared/section-fields'

export const gridMixedType = defineType({
  name: 'gridMixed',
  title: 'Grid mixed',
  type: 'object',
  icon: ImagesIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      rows: 3,
      description: 'Press Enter to control line breaks as designed in Figma.',
      group: 'content',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'gridMixedImages',
      description: 'Seven fixed slots in the collage layout.',
      group: 'content',
      validation: (rule) => rule.required(),
      initialValue: {_type: 'gridMixedImages'},
    }),
    defineField({
      name: 'button',
      title: 'Button',
      type: 'button',
      group: 'content',
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...headingSizeField({group: 'style'}), group: 'style'},
    {...brandColorField('backgroundColor', 'Background color'), group: 'style'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style'},
  ],
  preview: {
    select: {
      heading: 'heading',
      headingSize: 'headingSize',
      media: 'images.topLeft',
    },
    prepare({heading, headingSize, media}) {
      return {
        title: heading || 'Grid mixed',
        subtitle: `Grid mixed · 7 slots · ${headingSizeLabel(headingSize)}`,
        media: media || ImagesIcon,
      }
    },
  },
})
