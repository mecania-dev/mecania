import { NextResponse, type NextRequest } from 'next/server'

const authPrefixes = ['/sign-in', '/sign-up', '/forgot-password']

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  if (!authPrefixes.some(prefix => pathname.startsWith(prefix))) {
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
