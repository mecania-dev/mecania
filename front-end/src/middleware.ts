import { NextResponse, type NextRequest } from 'next/server'

import { getIsAuthorizedRoute } from './auth'

const authPrefixes = ['/sign-in', '/sign-up', '/forgot-password'] as const

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const callbackUrl = req.cookies.get('callback-url')?.value
  let authRedirectUrl: string | undefined

  await getIsAuthorizedRoute(pathname, {
    unauthorized: {
      onUnauthorized: () => (authRedirectUrl = callbackUrl ?? '/')
    },
    authorized: {
      onUnauthorized: isAuthenticated => (authRedirectUrl = isAuthenticated ? '/profile' : '/sign-in')
    }
  })

  if (authRedirectUrl) {
    if (authPrefixes.some(p => authRedirectUrl?.startsWith(p))) {
      authRedirectUrl = '/'
    }

    if (pathname === authRedirectUrl) {
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL(authRedirectUrl, req.nextUrl))
  }

  if (!authPrefixes.some(p => pathname.startsWith(p))) {
    const response = NextResponse.next()

    if (pathname === '/') {
      response.cookies.delete('callback-url')
    } else {
      response.cookies.set('callback-url', pathname)
    }

    return response
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
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
}
