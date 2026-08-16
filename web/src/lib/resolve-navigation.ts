import {resolveInternalHref, resolveLinkHref} from '@/lib/links'
import type {NavigationData, NavItem} from '@/sanity/types'

export type SalesPageNavItem = {
  _id: string
  title?: string
  slug?: {current?: string}
  navLabel?: string
  cardTitle?: string
}

function singleLine(value?: string | null) {
  return value?.replace(/\s*\n\s*/g, ' ').trim() || undefined
}

function isOfferingsNavItem(item: NavItem) {
  if (item.label?.toLowerCase() === 'offerings') return true
  const href = resolveLinkHref(item.link)
  return href === '/offerings'
}

function salesPageNavChildren(salesPages: SalesPageNavItem[]): NavItem[] {
  const children: NavItem[] = []

  for (const page of salesPages) {
    const href = resolveInternalHref({_type: 'page', slug: page.slug, _id: page._id})
    if (!href) continue
    children.push({
      _key: `sales-${page._id}`,
      label:
        singleLine(page.navLabel) ||
        singleLine(page.cardTitle) ||
        page.title ||
        'Sales page',
      link: {
        linkType: 'internal',
        internalLink: {
          _type: 'page',
          _id: page._id,
          slug: page.slug,
        },
      },
    })
  }

  return children
}

/**
 * Keep Overview (and any non-sales children) from Studio, then append
 * ordered Sales Pages so cards + dropdown share one source of truth.
 */
export function resolveNavigationWithSalesPages(
  navigation?: NavigationData | null,
  salesPages: SalesPageNavItem[] = [],
): NavigationData | null | undefined {
  if (!navigation?.items?.length || !salesPages.length) return navigation

  const salesChildren = salesPageNavChildren(salesPages)
  if (!salesChildren.length) return navigation

  const salesIds = new Set(salesPages.map((page) => page._id))

  return {
    ...navigation,
    items: navigation.items.map((item) => {
      if (!isOfferingsNavItem(item)) return item

      const overviewAndCustom =
        item.children?.filter((child) => {
          const id = child.link?.internalLink?._id || child.link?.internalLink?._ref
          // Drop previous hard-coded sales links; keep Overview / custom entries.
          return !id || !salesIds.has(id)
        }) ?? []

      return {
        ...item,
        children: [...overviewAndCustom, ...salesChildren],
      }
    }),
  }
}
