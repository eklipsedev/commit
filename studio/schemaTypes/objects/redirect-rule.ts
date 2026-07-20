import {defineField, defineType} from 'sanity'
import {LinkIcon} from '../../lib/icons'

function isInternalPath(value: string | undefined) {
  if (!value) return 'Required'
  const path = value.trim()
  if (!path.startsWith('/')) return 'Path must start with /'
  if (path.startsWith('//')) return 'Use a site path like /old-page, not a URL'
  if (/^[a-z]+:/i.test(path)) return 'External URLs are not allowed'
  if (/\s/.test(path)) return 'Path cannot contain spaces'
  return true
}

export const redirectRuleType = defineType({
  name: 'redirectRule',
  title: 'Redirect',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'from',
      title: 'From',
      type: 'string',
      description: 'Old path visitors hit, e.g. /old-services',
      placeholder: '/old-path',
      validation: (rule) => rule.required().custom(isInternalPath),
    }),
    defineField({
      name: 'to',
      title: 'To',
      type: 'string',
      description: 'New path on this site, e.g. /services',
      placeholder: '/new-path',
      validation: (rule) => rule.required().custom(isInternalPath),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent',
      type: 'boolean',
      description: 'On = 308 (SEO-preferred permanent). Off = 307 temporary.',
      initialValue: true,
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      from: 'from',
      to: 'to',
      permanent: 'permanent',
      enabled: 'enabled',
    },
    prepare({from, to, permanent, enabled}) {
      const status = enabled === false ? 'Disabled · ' : ''
      const kind = permanent === false ? '307' : '308'
      return {
        title: `${from || '…'} → ${to || '…'}`,
        subtitle: `${status}${kind}`,
        media: LinkIcon,
      }
    },
  },
})
