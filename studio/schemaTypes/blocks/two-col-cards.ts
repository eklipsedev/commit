import {defineArrayMember, defineField, defineType} from 'sanity'
import {ThLargeIcon} from '../../lib/icons'
import {brandColorField, headingSizeField, sectionSpacingFields, headingSizeLabel} from '../shared/section-fields'

export const twoColCardsType = defineType({
  name: 'twoColCards',
  title: '2-col cards',
  type: 'object',
  icon: ThLargeIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fields: [
    defineField({
      name: 'showHeader',
      title: 'Show header',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off for a grid-only layout (work index style)',
      group: 'content',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      hidden: ({parent}) => parent?.showHeader === false,
      group: 'content',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      rows: 3,
      description: 'Press Enter to control line breaks as designed in Figma.',
      hidden: ({parent}) => parent?.showHeader === false,
      group: 'content',
    }),
    defineField({
      name: 'button',
      title: 'Header button',
      type: 'button',
      hidden: ({parent}) => parent?.showHeader === false,
      group: 'content',
    }),
    defineField({
      name: 'projectsSource',
      title: 'Projects source',
      type: 'string',
      options: {
        list: [
          {title: 'All projects (Studio order)', value: 'all'},
          {title: 'Hand-picked', value: 'manual'},
        ],
        layout: 'radio',
      },
      initialValue: 'manual',
      description:
        '“All projects” pulls every published project in the order set under Projects (drag to reorder). Use hand-picked for curated subsets (home, audience pages).',
      group: 'content',
    }),
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'project'}]})],
      hidden: ({parent}) => parent?.projectsSource === 'all',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {projectsSource?: string} | undefined
          if (parent?.projectsSource === 'all') return true
          return value?.length ? true : 'Add at least one project'
        }),
      group: 'content',
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {
      ...headingSizeField({
        group: 'style',
        initialValue: 'md',
        hidden: ({parent}) => parent?.showHeader === false,
      }),
      group: 'style',
    },
    {...brandColorField('backgroundColor', 'Background color'), group: 'style'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style'},
  ],
  preview: {
    select: {
      heading: 'heading',
      projects: 'projects',
      projectsSource: 'projectsSource',
      headingSize: 'headingSize',
    },
    prepare({heading, projects, projectsSource, headingSize}) {
      const source =
        projectsSource === 'all' ? 'all projects' : `${projects?.length ?? 0} hand-picked`
      return {
        title: heading || 'Project cards',
        subtitle: `2-col cards · ${source} · ${headingSizeLabel(headingSize)}`,
        media: ThLargeIcon,
      }
    },
  },
})
