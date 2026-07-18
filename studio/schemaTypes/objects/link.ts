import {defineField, defineType} from 'sanity'
import {LinkIcon} from '../../lib/icons'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?[\d\s().-]{7,20}$/

type LinkParent = {
  label?: string
  linkType?: string
  internalLink?: unknown
  href?: string
  email?: string
  phone?: string
  openInNewTab?: boolean
}

/** True when the editor has started configuring this link (not just defaults). */
function linkIsConfigured(link?: LinkParent | null) {
  if (!link) return false
  return Boolean(
    link.label ||
      link.internalLink ||
      link.href ||
      link.email ||
      link.phone ||
      (link.linkType && link.linkType !== 'internal') ||
      link.openInNewTab === true,
  )
}

export const linkType = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Optional when a parent field already supplies the display text',
    }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          {title: 'Internal page', value: 'internal'},
          {title: 'External URL', value: 'external'},
          {title: 'Email', value: 'email'},
          {title: 'Phone', value: 'phone'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal page',
      type: 'reference',
      to: [{type: 'page'}, {type: 'homePage'}, {type: 'contactPage'}, {type: 'legalPage'}],
      hidden: ({parent}) => parent?.linkType !== 'internal',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as LinkParent | undefined
          if (!linkIsConfigured(parent)) return true
          if (parent?.linkType === 'internal' && !value) {
            return 'Select a page'
          }
          return true
        }),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      validation: (rule) =>
        rule
          .uri({
            allowRelative: true,
            scheme: ['http', 'https', 'mailto', 'tel'],
          })
          .custom((value, context) => {
            const parent = context.parent as LinkParent | undefined
            if (!linkIsConfigured(parent)) return true
            if (parent?.linkType === 'external' && !value) {
              return 'URL is required'
            }
            return true
          }),
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      hidden: ({parent}) => parent?.linkType !== 'email',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as LinkParent | undefined
          if (!linkIsConfigured(parent)) return true
          if (parent?.linkType !== 'email') return true
          if (!value) return 'Email is required'
          if (!EMAIL_PATTERN.test(value.trim())) {
            return 'Enter a valid email address'
          }
          return true
        }),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      description: 'e.g. (210) 275-0162 or +1 210-275-0162',
      hidden: ({parent}) => parent?.linkType !== 'phone',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as LinkParent | undefined
          if (!linkIsConfigured(parent)) return true
          if (parent?.linkType !== 'phone') return true
          if (!value) return 'Phone number is required'
          const digits = value.replace(/\D/g, '')
          if (digits.length < 7 || digits.length > 15) {
            return 'Enter a valid phone number'
          }
          if (!PHONE_PATTERN.test(value.trim())) {
            return 'Use a valid phone format (digits, spaces, +, (), -)'
          }
          return true
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'linkType', email: 'email', phone: 'phone', href: 'href'},
    prepare({title, subtitle, email, phone, href}) {
      return {
        title: title || email || phone || href || 'Link',
        subtitle,
      }
    },
  },
})
