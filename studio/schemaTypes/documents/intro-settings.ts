import {defineField, defineType} from 'sanity'
import {PlayIcon} from '../../lib/icons'
import {brandColorField} from '../shared/section-fields'

/** Easing presets for the logo's move into the navbar. Values map to curves in the web app. */
export const INTRO_EASINGS = [
  {title: 'Smooth — even ease in and out (default)', value: 'smooth'},
  {title: 'Gentle — softest start and landing', value: 'gentle'},
  {title: 'Expressive — slow start, quick middle, soft landing', value: 'expressive'},
  {title: 'Glide — quick start that settles slowly', value: 'glide'},
] as const

function durationField(name: string, title: string, description: string, initialValue: number) {
  return defineField({
    name,
    title,
    type: 'number',
    description,
    initialValue,
    fieldset: 'timing',
    validation: (rule) => rule.required().integer().min(0).max(3000),
  })
}

/**
 * Site-wide intro: the yellow screen with the COMMIT. wordmark that moves into the navbar.
 */
export const introSettingsType = defineType({
  name: 'introSettings',
  title: 'Intro animation',
  type: 'document',
  icon: PlayIcon,
  fieldsets: [{name: 'timing', title: 'Timing (milliseconds)', options: {columns: 2}}],
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show intro animation',
      type: 'boolean',
      description: 'Turn off to load the site straight to the page, with no intro.',
      initialValue: false,
    }),
    defineField({
      name: 'frequency',
      title: 'How often it plays',
      type: 'string',
      options: {
        list: [
          {title: 'Once per visit', value: 'session'},
          {title: 'Every page load (for testing)', value: 'always'},
        ],
        layout: 'radio',
      },
      initialValue: 'session',
      hidden: ({parent}) => !parent?.enabled,
    }),
    defineField({
      name: 'easing',
      title: 'Movement easing',
      type: 'string',
      description: 'How the logo speeds up and slows down as it moves into the navbar.',
      options: {list: [...INTRO_EASINGS], layout: 'radio'},
      initialValue: 'smooth',
      hidden: ({parent}) => !parent?.enabled,
    }),
    {
      ...brandColorField('backgroundColor', 'Background color', {
        initialValue: 'pale-yellow',
        description: 'Full-screen color behind the wordmark.',
      }),
      hidden: ({parent}: {parent?: {enabled?: boolean}}) => !parent?.enabled,
    },
    durationField('holdMs', 'Hold before moving', 'How long the large logo rests on screen.', 560),
    durationField('moveMs', 'Move into navbar', 'Length of the move into the navbar.', 900),
    durationField(
      'periodMs',
      'Period turns yellow',
      'Color change of the period, which starts as the logo moves.',
      540,
    ),
    durationField('fadeMs', 'Fade out', 'How long the background takes to dissolve.', 360),
  ],
  preview: {
    select: {enabled: 'enabled', easing: 'easing'},
    prepare({enabled, easing}) {
      return {
        title: 'Intro animation',
        subtitle: enabled ? `On · ${easing || 'smooth'} easing` : 'Off',
        media: PlayIcon,
      }
    },
  },
})
