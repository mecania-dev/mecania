import { NextResponse, type NextRequest } from 'next/server'

import * as auth from './auth'

const authPrefixes = ['/sign-in', '/sign-up', '/forgot-password']
const protectedPrefixes = ['/profile', '/chat']

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const isAuthenticated = await auth.isAuthenticated()

  // Redirect to home if authenticated user tries to access auth routes
  if (isAuthenticated && authPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Redirect to sign-in if unauthenticated user tries to access protected routes
  if (!isAuthenticated && protectedPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.svg|sitemap.xml|robots.txt).*)'
  ]
}
