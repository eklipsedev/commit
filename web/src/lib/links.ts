type InternalRef = {
  _type?: string
  _ref?: string
  _id?: string
  slug?: {current?: string}
}

export type LinkValue = {
  label?: string
  linkType?: 'internal' | 'external' | 'email' | 'phone'
  internalLink?: InternalRef
  href?: string
  email?: string
  phone?: string
  openInNewTab?: boolean
}

function singletonHref(idOrType?: string | null) {
  if (!idOrType) return null
  const value = idOrType.replace(/^drafts\./, '')
  if (value === 'homePage') return '/'
  if (value === 'contactPage') return '/contact'
  return null
}

export function resolveInternalHref(ref?: InternalRef | null) {
  if (!ref) return null

  const fromSingleton =
    singletonHref(ref._type) || singletonHref(ref._ref) || singletonHref(ref._id)
  if (fromSingleton) return fromSingleton

  switch (ref._type) {
    case 'legalPage':
      return ref.slug?.current ? `/legal/${ref.slug.current}` : null
    case 'page':
      return ref.slug?.current ? `/${ref.slug.current}` : null
    default:
      return null
  }
}

export function resolveLinkHref(link?: LinkValue | null) {
  if (!link) return null

  switch (link.linkType) {
    case 'external':
      return link.href ?? null
    case 'email':
      return link.email ? `mailto:${link.email}` : null
    case 'phone': {
      if (!link.phone) return null
      const digits = link.phone.replace(/\D/g, '')
      return digits ? `tel:${digits}` : null
    }
    case 'internal':
    default:
      return resolveInternalHref(link.internalLink)
  }
}

export function resolveLinkLabel(link?: LinkValue | null, fallback?: string) {
  return link?.label || fallback || ''
}
