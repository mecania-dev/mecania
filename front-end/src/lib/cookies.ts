import { getCookie, getCookies, setCookie, deleteCookie } from 'cookies-next'
import { DefaultOptions, CookiesFn } from 'cookies-next/lib/types'

export async function test() {
  const {} = await cookies({ access: 'access' })
}

export async function cookies<T extends string | object | undefined = undefined>(
  cookie?: T,
  options?: Omit<DefaultOptions, 'cookies'>
): Promise<
  T extends string
    ? string | undefined
    : T extends object
      ? Partial<Record<keyof T, string>>
      : Partial<Record<string, string>>
> {
  let cookieStore: CookiesFn | undefined

  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')

    cookieStore = serverCookies
  }

  if (!cookie) {
    return getCookies({ cookies: cookieStore, ...options }) as any
  }

  if (typeof cookie === 'string') {
    return getCookie(cookie as string, { cookies: cookieStore }) as any
  }

  return Object.entries(cookie).reduce((acc, [key, value]) => {
    acc[key] = getCookie(value, { cookies: cookieStore, ...options })
    return acc
  }, {} as any)
}

async function setCookies(cookies: Record<string, string>, options?: Omit<DefaultOptions, 'cookies'>) {
  let cookieStore: CookiesFn | undefined

  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')

    cookieStore = serverCookies
  }

  Object.entries(cookies).forEach(([key, value]) => setCookie(key, value, { cookies: cookieStore, ...options }))
}
cookies.set = setCookies

async function deleteCookies(cookie: string | string[], options?: Omit<DefaultOptions, 'cookies'>) {
  let cookieStore: CookiesFn | undefined

  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')

    cookieStore = serverCookies
  }

  const cookies = Array.isArray(cookie) ? cookie : [cookie]
  cookies.forEach(c => deleteCookie(c, { cookies: cookieStore, ...options }))
}
cookies.delete = deleteCookies
