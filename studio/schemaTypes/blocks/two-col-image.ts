import {defineField, defineType} from 'sanity'
import {InlineIcon} from '../../lib/icons'
import {imageAltField, imageFieldOptions} from '../shared/image-fields'
import {
  brandColorField,
  collapseLineBreaksOnMobileField,
  headingFontField,
  headingFontLabel,
  headingSizeField,
  sectionSpacingFields,
  headingSizeLabel,
  COLORS_FIELDSET,
} from '../shared/section-fields'

export const twoColImageType = defineType({
  name: 'twoColImage',
  title: 'Image + story',
  type: 'object',
  icon: InlineIcon,
  description: 'Image beside heading and body copy (editorial split).',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fieldsets: [COLORS_FIELDSET],
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: imageFieldOptions(),
      fields: [imageAltField()],
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
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
    {...headingSizeField({group: 'content', initialValue: 'md'}), title: 'Text size', group: 'content'},
    {...headingFontField({group: 'content'}), title: 'Heading font', group: 'content'},
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
      group: 'content',
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...collapseLineBreaksOnMobileField({group: 'style'}), group: 'style'},
    {...brandColorField('backgroundColor', 'Background color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('bodyColor', 'Body color'), group: 'style', fieldset: 'colors'},
  ],
  preview: {
    select: {title: 'heading', media: 'image', headingSize: 'headingSize', headingFont: 'headingFont'},
    prepare({title, media, headingSize, headingFont}) {
      return {
        title: title || 'Image + story',
        subtitle: `Image + story · ${headingSizeLabel(headingSize)} · ${headingFontLabel(headingFont)}`,
        media: media ?? InlineIcon,
      }
    },
  },
})
