import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from '@/sanity/env'

export type RedirectMatch = {
  to: string
  permanent: boolean
}

type RedirectRule = {
  from?: string | null
  to?: string | null
  permanent?: boolean | null
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

const REDIRECTS_QUERY = `*[_id == "redirects"][0].redirects[enabled != false]{
  from,
  to,
  "permanent": coalesce(permanent, true)
}`

/** Edge-instance cache so middleware isn't a Sanity round-trip on every request. */
const TTL_MS = 60_000
let cache: {expiresAt: number; map: Map<string, RedirectMatch>} | null = null

export function normalizePathname(pathname: string) {
  if (!pathname) return '/'
  let path = pathname.trim()
  if (!path.startsWith('/')) path = `/${path}`
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  return path || '/'
}

function ensurePath(path: string) {
  const trimmed = path.trim()
  if (!trimmed) return ''
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

async function getRedirectMap() {
  if (cache && cache.expiresAt > Date.now()) return cache.map

  const rules = await client.fetch<RedirectRule[] | null>(REDIRECTS_QUERY)
  const map = new Map<string, RedirectMatch>()

  for (const rule of rules || []) {
    const from = normalizePathname(rule.from || '')
    const to = ensurePath(rule.to || '')
    if (!from || from === '/' || !to) continue
    if (normalizePathname(to) === from) continue
    map.set(from, {
      to,
      permanent: rule.permanent !== false,
    })
  }

  cache = {expiresAt: Date.now() + TTL_MS, map}
  return map
}

export async function getRedirectForPath(pathname: string) {
  try {
    const map = await getRedirectMap()
    return map.get(normalizePathname(pathname)) ?? null
  } catch (error) {
    console.error('[redirects] Failed to load Sanity redirects', error)
    return null
  }
}
