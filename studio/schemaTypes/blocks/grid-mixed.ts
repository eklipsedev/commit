import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImagesIcon} from '../../lib/icons'
import {imageAltField, imageFieldOptions} from '../shared/image-fields'
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
  description:
    'Seven-slot photo collage. Image order maps to layout slots (top row → tall/squares → bottom).',
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
      type: 'array',
      description:
        'Up to 7 images in collage order: top left, top right, left tall, center square, right square, bottom left, bottom wide. Drag to reorder.',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'image',
          options: imageFieldOptions(),
          fields: [
            imageAltField({
              description: 'Accessibility text — generate with AI Assist.',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
              description: 'Hover label on the collage (e.g. “Logo”, “Website”).',
            }),
          ],
          preview: {
            select: {
              media: 'asset',
              description: 'description',
              alt: 'alt',
            },
            prepare({media, description, alt}) {
              return {
                title: description || alt || 'Image',
                subtitle: alt && description ? alt : undefined,
                media,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(7),
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
      media: 'images.0',
      images: 'images',
    },
    prepare({heading, headingSize, headingFont, media, images}) {
      const count = Array.isArray(images) ? images.length : 0
      return {
        title: heading || 'Image collage',
        subtitle: `Image collage · ${count || 0} image${count === 1 ? '' : 's'} · ${headingSizeLabel(headingSize)} · ${headingFontLabel(headingFont)}`,
        media: media || ImagesIcon,
      }
    },
  },
})
