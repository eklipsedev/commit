import {defineArrayMember, defineType} from 'sanity'

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
      views: [{name: 'grid'}, {name: 'list'}],
    },
  },
})
