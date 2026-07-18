import {defineField, defineType} from 'sanity'
import {ImageIcon} from '../../lib/icons'
import {imageAltField, imageFieldOptions} from '../shared/image-fields'

/**
 * Reusable client / partner logo.
 * Referenced by logos page-builder sections. Optional project link
 * for case-study logos; otherwise optional external URL.
 */
export const logoType = defineType({
  name: 'logo',
  title: 'Logo',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Client or brand name (also used as image alt fallback)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Logo image',
      type: 'image',
      options: imageFieldOptions(),
      fields: [
        imageAltField({description: 'Defaults to the logo name if empty'}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'project',
      title: 'Case study',
      type: 'reference',
      to: [{type: 'project'}],
      description: 'Optional — when set, the logo links to this case study',
    }),
    defineField({
      name: 'href',
      title: 'External URL',
      type: 'url',
      description: 'Optional — used when there is no case study link',
      hidden: ({document}) => Boolean(document?.project),
      validation: (rule) =>
        rule.uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'includeInDefaultSet',
      title: 'Include in default logo set',
      type: 'boolean',
      description:
        'When on, this logo is pre-selected when an editor adds a new Logos section (they can still change the list).',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      projectTitle: 'project.title',
      inDefault: 'includeInDefaultSet',
    },
    prepare({title, media, projectTitle, inDefault}) {
      const parts = [
        projectTitle ? `Case study: ${projectTitle}` : null,
        inDefault === false ? 'Not in default set' : null,
      ].filter(Boolean)
      return {
        title: title || 'Logo',
        subtitle: parts.join(' · ') || 'Logo',
        media: media ?? ImageIcon,
      }
    },
  },
})
