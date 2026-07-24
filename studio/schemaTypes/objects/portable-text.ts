import {defineArrayMember, defineType} from 'sanity'

/** Simple rich text for section headlines that need italic spans. */
export const richHeadlineType = defineType({
  name: 'richHeadline',
  title: 'Rich headline',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [],
      lists: [],
      marks: {
        decorators: [{title: 'Italic', value: 'em'}],
        annotations: [],
      },
    }),
  ],
})

/** Body portable text for legal pages and story sections. */
export const portableTextType = defineType({
  name: 'portableText',
  title: 'Portable text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'link',
            title: 'Link',
          }),
        ],
      },
    }),
  ],
})
