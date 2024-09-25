import { NextResponse, type NextRequest } from 'next/server'

import { auth } from './auth'

const authPrefixes = ['/sign-in', '/sign-up', '/forgot-password']

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const callbackUrl = req.cookies.get('callback-url')?.value

  const isAuthorized = await auth({
    redirect: false,
    custom({ isAuthenticated, ability }) {
      // AUTH
      if (authPrefixes.some(p => pathname.startsWith(p))) {
        return !isAuthenticated
      }

      // CHAT
      if (pathname.startsWith('/chat')) {
        return !!ability?.can('ask_ai', 'Chat')
      }

      // MECHANICS
      if (pathname.startsWith('/mechanics')) {
        // REGISTER MECHANICS
        if (pathname.startsWith('/mechanics/register')) {
          return !!ability?.can('manage', 'User')
        }

        return isAuthenticated
      }

      // PROFILE
      if (pathname.startsWith('/profile')) {
        // ADDRESSES
        if (pathname.startsWith('/profile/addresses')) {
          return !!ability?.can('create', 'Address')
        }

        // REQUESTS
        if (pathname.startsWith('/profile/requests')) {
          return !!ability?.can('message_mechanic', 'Chat') || !!ability?.can('message_user', 'Chat')
        }

        // VEHICLES
        if (pathname.startsWith('/profile/vehicles')) {
          return !!ability?.can('create', 'Vehicle')
        }

        return isAuthenticated
      }

      // SERVICES
      if (pathname.startsWith('/services')) {
        return !!ability?.can('manage', 'Service')
      }

      return true
    }
  })

  if (!isAuthorized) {
    return NextResponse.redirect(new URL(callbackUrl ?? '/', req.nextUrl))
  }

  const response = NextResponse.next()

  if (pathname === '/') {
    response.cookies.delete('callback-url')
  } else {
    response.cookies.set('callback-url', pathname)
  }

  return response
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
