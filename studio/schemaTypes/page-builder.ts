import {defineArrayMember, defineType} from 'sanity'
import {getBlockPreviewUrl} from '../lib/block-preview-urls'

export const pageBuilderType = defineType({
  name: 'pageBuilder',
  title: 'Page builder',
  type: 'array',
  of: [
    defineArrayMember({type: 'hero'}),
    defineArrayMember({type: 'cta'}),
    defineArrayMember({type: 'logos'}),
    defineArrayMember({type: 'twoColCards'}),
    defineArrayMember({type: 'twoColImage'}),
    defineArrayMember({type: 'textColumns'}),
    defineArrayMember({type: 'listText'}),
    defineArrayMember({type: 'cardsText'}),
    defineArrayMember({type: 'gridText'}),
    defineArrayMember({type: 'gridMixed'}),
    defineArrayMember({type: 'team'}),
    defineArrayMember({type: 'sliderTestimonials'}),
    defineArrayMember({type: 'customSection'}),
  ],
  options: {
    insertMenu: {
      filter: true,
      groups: [
        {
          name: 'intros',
          title: 'Intros & CTAs',
          of: ['hero', 'textColumns', 'cta'],
        },
        {
          name: 'workOffers',
          title: 'Work & offers',
          of: ['twoColCards', 'cardsText', 'gridMixed'],
        },
        {
          name: 'listsLinks',
          title: 'Lists & links',
          of: ['listText', 'gridText', 'twoColImage'],
        },
        {
          name: 'peopleProof',
          title: 'People & proof',
          of: ['team', 'sliderTestimonials', 'logos'],
        },
        {
          name: 'flexible',
          title: 'Flexible',
          of: ['customSection'],
        },
      ],
      views: [
        {
          name: 'grid',
          previewImageUrl: (type) => getBlockPreviewUrl(type),
        },
        {name: 'list'},
      ],
    },
  },
})
