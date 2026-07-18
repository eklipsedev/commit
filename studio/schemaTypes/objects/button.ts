import {defineField, defineType} from 'sanity'
import {ChevronRightIcon} from '../../lib/icons'
import {brandColorField} from '../shared/section-fields'

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
  description: 'Leave blank if this section should have no button',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          {title: 'Primary (filled)', value: 'primary'},
          {title: 'Secondary (outlined)', value: 'secondary'},
          {title: 'Dot (pill with sliding dot)', value: 'dot'},
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
    }),
    brandColorField('backgroundColor', 'Background color', {
      description: 'Default fill (primary) or hover fill (secondary)',
    }),
    brandColorField('textColor', 'Text color', {
      description: 'Label color in the default state',
    }),
    brandColorField('hoverBackgroundColor', 'Hover background color'),
    brandColorField('hoverTextColor', 'Hover text color'),
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
    select: {title: 'label', subtitle: 'variant'},
    prepare({title, subtitle}) {
      return {
        title: title || 'Button',
        subtitle: title ? subtitle : 'Not set',
      }
    },
  },
})
