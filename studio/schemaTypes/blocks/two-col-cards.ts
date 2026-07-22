import {defineArrayMember, defineField, defineType} from 'sanity'
import {ThLargeIcon} from '../../lib/icons'
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

export const twoColCardsType = defineType({
  name: 'twoColCards',
  title: 'Project cards',
  type: 'object',
  icon: ThLargeIcon,
  description: 'Two-column project cards with thumbnail, title, and categories. Links to case studies.',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'style', title: 'Style'},
  ],
  fieldsets: [COLORS_FIELDSET],
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
    {
      ...showTaglineRuleField({group: 'content'}),
      group: 'content',
      hidden: ({parent}) => parent?.showHeader === false || !parent?.tagline,
    },
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
    {
      ...headingFontField({
        group: 'style',
        hidden: ({parent}) => parent?.showHeader === false,
      }),
      group: 'style',
    },
    {
      ...collapseLineBreaksOnMobileField({
        group: 'style',
        hidden: ({parent}) => parent?.showHeader === false,
      }),
      group: 'style',
    },
    {...brandColorField('backgroundColor', 'Background color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style', fieldset: 'colors'},
  ],
  preview: {
    select: {
      heading: 'heading',
      projects: 'projects',
      projectsSource: 'projectsSource',
      headingSize: 'headingSize',
      headingFont: 'headingFont',
    },
    prepare({heading, projects, projectsSource, headingSize, headingFont}) {
      const source =
        projectsSource === 'all' ? 'all projects' : `${projects?.length ?? 0} hand-picked`
      return {
        title: heading || 'Project cards',
        subtitle: `Project cards · ${source} · ${headingSizeLabel(headingSize)} · ${headingFontLabel(headingFont)}`,
        media: ThLargeIcon,
      }
    },
  },
})
