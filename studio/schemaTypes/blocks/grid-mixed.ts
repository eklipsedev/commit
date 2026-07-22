import {defineField, defineType} from 'sanity'
import {ImagesIcon} from '../../lib/icons'
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

export const gridMixedType = defineType({
  name: 'gridMixed',
  title: 'Image collage',
  type: 'object',
  icon: ImagesIcon,
  description: 'Seven-slot photo collage with optional tagline, heading, and button.',
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
    {...headingFontField({group: 'style'}), group: 'style'},
    {...collapseLineBreaksOnMobileField({group: 'style'}), group: 'style'},
    {...brandColorField('backgroundColor', 'Background color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style', fieldset: 'colors'},
  ],
  preview: {
    select: {
      heading: 'heading',
      headingSize: 'headingSize',
      headingFont: 'headingFont',
      media: 'images.topLeft',
    },
    prepare({heading, headingSize, headingFont, media}) {
      return {
        title: heading || 'Image collage',
        subtitle: `Image collage · 7 slots · ${headingSizeLabel(headingSize)} · ${headingFontLabel(headingFont)}`,
        media: media || ImagesIcon,
      }
    },
  },
})
