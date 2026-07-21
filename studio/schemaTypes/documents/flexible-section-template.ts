import {defineField, defineType} from 'sanity'
import {BlockContentIcon} from '../../lib/icons'
import {
  COLORS_FIELDSET,
  flexibleSectionContentFields,
} from '../shared/flexible-section-fields'

/**
 * Library of Flexible section presets.
 * Inserting into the page builder copies modules + styles onto a new `customSection`
 * (not a live link) so each page can diverge.
 */
export const flexibleSectionTemplateType = defineType({
  name: 'flexibleSectionTemplate',
  title: 'Flexible section template',
  type: 'document',
  icon: BlockContentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fieldsets: [COLORS_FIELDSET],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal label shown when picking a template (e.g. “Services intro”).',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Optional helper text in the template picker.',
      group: 'content',
    }),
    defineField({
      name: 'previewImage',
      title: 'Preview image',
      type: 'image',
      options: {hotspot: false},
      description: 'Optional thumbnail shown in the template picker.',
      group: 'content',
    }),
    ...flexibleSectionContentFields({modulesRequired: true}),
  ],
  preview: {
    select: {title: 'title', modules: 'modules', media: 'previewImage'},
    prepare({title, modules, media}) {
      const count = modules?.length ?? 0
      return {
        title: title || 'Untitled template',
        subtitle: `${count} module${count === 1 ? '' : 's'}`,
        media: media || BlockContentIcon,
      }
    },
  },
})
