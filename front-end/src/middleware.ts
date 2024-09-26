import { NextResponse, type NextRequest } from 'next/server'

import { auth } from './auth'

const authPrefixes = ['/sign-in', '/sign-up', '/forgot-password'] as const
const protectedParentsPrefixes = ['/chat', '/mechanics', '/profile', '/services'] as const

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const callbackUrl = req.cookies.get('callback-url')?.value
  let authRedirectUrl: string | undefined

  function setRedirectUrlAndReturn(url: string, isAthorized: boolean) {
    authRedirectUrl = isAthorized ? undefined : url
    return isAthorized
  }

  await auth({
    custom({ isAuthenticated, ability }) {
      // AUTH
      if (authPrefixes.some(p => pathname.startsWith(p))) {
        return setRedirectUrlAndReturn(callbackUrl ?? '/', !isAuthenticated)
      }

      // PROTECTED PARENTS
      if (protectedParentsPrefixes.some(p => pathname.startsWith(p))) {
        if (!isAuthenticated) {
          return setRedirectUrlAndReturn('/sign-in', false)
        }

        /*----------IS AUTHENTICATED----------*/

        // CHAT
        if (pathname.startsWith('/chat')) {
          return setRedirectUrlAndReturn(callbackUrl ?? '/profile', !!ability?.can('ask_ai', 'Chat'))
        }

        // MECHANICS
        if (pathname.startsWith('/mechanics')) {
          return setRedirectUrlAndReturn(callbackUrl ?? '/profile', !!ability?.can('manage', 'User'))
        }

        // PROFILE
        if (pathname.startsWith('/profile')) {
          // ADDRESSES
          if (pathname.startsWith('/profile/addresses')) {
            return setRedirectUrlAndReturn(callbackUrl ?? '/profile', !!ability?.can('create', 'Address'))
          }

          // REQUESTS
          if (pathname.startsWith('/profile/requests')) {
            return setRedirectUrlAndReturn(
              callbackUrl ?? '/profile',
              !!ability?.can('message_mechanic', 'Chat') || !!ability?.can('message_user', 'Chat')
            )
          }

          // VEHICLES
          if (pathname.startsWith('/profile/vehicles')) {
            return setRedirectUrlAndReturn(callbackUrl ?? '/profile', !!ability?.can('create', 'Vehicle'))
          }
        }

        // SERVICES
        if (pathname.startsWith('/services')) {
          return setRedirectUrlAndReturn(callbackUrl ?? '/profile', !!ability?.can('manage', 'Service'))
        }
      }
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
