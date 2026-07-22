import {defineField, defineType} from 'sanity'
import {ChevronRightIcon} from '../../lib/icons'
import {brandColorField, COLORS_FIELDSET} from '../shared/section-fields'

type LinkValue = {
  label?: string
  linkType?: string
  internalLink?: unknown
  href?: string
  email?: string
  phone?: string
}

type ButtonValue = {
  label?: string
  link?: LinkValue
  backgroundColor?: string
  textColor?: string
  hoverBackgroundColor?: string
  hoverTextColor?: string
}

function linkHasDestination(link?: LinkValue | null) {
  if (!link) return false
  if (link.label) return true
  if (link.linkType === 'internal' && link.internalLink) return true
  if (link.linkType === 'external' && link.href) return true
  if (link.linkType === 'email' && link.email) return true
  if (link.linkType === 'phone' && link.phone) return true
  return false
}

/** True when the editor has started configuring a button (not just schema defaults). */
export function buttonHasContent(button?: ButtonValue | null) {
  if (!button) return false
  return Boolean(
    button.label ||
      linkHasDestination(button.link) ||
      button.backgroundColor ||
      button.textColor ||
      button.hoverBackgroundColor ||
      button.hoverTextColor,
  )
}

export const buttonType = defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  icon: ChevronRightIcon,
  description:
    'Outlined at rest, filled on hover. Leave blank if this section should have no button.',
  fieldsets: [COLORS_FIELDSET],
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
    }),
    brandColorField('textColor', 'Resting text / border', {
      description: 'Label and outline color at rest. Defaults to Charcoal.',
      fieldset: 'colors',
      initialValue: 'charcoal',
    }),
    brandColorField('hoverBackgroundColor', 'Hover fill', {
      description: 'Background (and border) on hover.',
      fieldset: 'colors',
    }),
    brandColorField('hoverTextColor', 'Hover text', {
      description: 'Label color on hover. Defaults to resting text / charcoal when unset.',
      fieldset: 'colors',
    }),
    // Legacy alias — older docs used this as primary fill or secondary hover fill.
    // Hidden in Studio; frontend still reads it when hoverBackgroundColor is empty.
    defineField({
      name: 'backgroundColor',
      title: 'Hover fill (legacy)',
      type: 'string',
      hidden: true,
      fieldset: 'colors',
    }),
  ],
  validation: (rule) =>
    rule.custom((button) => {
      const value = button as ButtonValue | undefined
      if (!buttonHasContent(value)) return true
      if (!value?.label) return 'Label is required when a button is configured'
      if (!linkHasDestination(value?.link)) {
        return 'Link is required when a button is configured'
      }
      return true
    }),
  preview: {
    select: {title: 'label'},
    prepare({title}) {
      return {
        title: title || 'Button',
        subtitle: title ? 'Outline → fill' : 'Not set',
      }
    },
  },
})
