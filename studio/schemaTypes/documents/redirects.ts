import {defineField, defineType} from 'sanity'
import {LinkIcon} from '../../lib/icons'

function normalizePath(path: string) {
  const trimmed = path.trim()
  if (!trimmed) return ''
  if (trimmed.length > 1 && trimmed.endsWith('/')) return trimmed.slice(0, -1)
  return trimmed
}

/**
 * Singleton: marketing/SEO redirects applied by the Next.js site middleware.
 */
export const redirectsType = defineType({
  name: 'redirects',
  title: 'Redirects',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Redirects',
      hidden: true,
    }),
    defineField({
      name: 'redirects',
      title: 'Redirects',
      type: 'array',
      description:
        'Path → path redirects for the marketing site. Changes go live shortly after publish (usually within a minute). Avoid redirect chains (A→B and B→C).',
      of: [{type: 'redirectRule'}],
      validation: (rule) =>
        rule.custom((items) => {
          if (!items?.length) return true

          const sources = new Map<string, number>()
          for (const [index, item] of items.entries()) {
            const row = item as {from?: string; to?: string} | undefined
            const from = normalizePath(row?.from || '')
            const to = normalizePath(row?.to || '')
            if (from && to && from === to) {
              return `Row ${index + 1}: From and To cannot be the same path`
            }
            if (!from) continue
            if (sources.has(from)) {
              return `Duplicate “From” path: ${from} (rows ${sources.get(from)} and ${index + 1})`
            }
            sources.set(from, index + 1)
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {redirects: 'redirects'},
    prepare({redirects}) {
      const count = Array.isArray(redirects) ? redirects.length : 0
      return {
        title: 'Redirects',
        subtitle: count ? `${count} rule${count === 1 ? '' : 's'}` : 'No redirects yet',
        media: LinkIcon,
      }
    },
  },
})
