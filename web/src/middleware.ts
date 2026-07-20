import {NextResponse, type NextRequest} from 'next/server'
import {getRedirectForPath} from '@/lib/redirects'

export async function middleware(request: NextRequest) {
  const match = await getRedirectForPath(request.nextUrl.pathname)
  if (!match) return NextResponse.next()

  const destination = new URL(match.to, request.nextUrl.origin)

  // Keep inbound query string unless the CMS destination already set one.
  if (!destination.search && request.nextUrl.search) {
    destination.search = request.nextUrl.search
  }

  return NextResponse.redirect(destination, match.permanent ? 308 : 307)
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next internals and common static assets.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)',
  ],
}
