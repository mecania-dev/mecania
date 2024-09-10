import { cookies } from 'next/headers'

import { tryParseJSON } from '../object'
import { Cookie, CookieOptions, RequestCookie, defaultCookieOptions } from './client'

export function serverCookies(): RequestCookie[] {
  return cookies()
    .getAll()
    .map(({ name, value }) => ({ name, value: tryParseJSON(value) }))
}

function set(name: Cookie, value: any, options: CookieOptions = {}) {
  if (!options.expires) {
    defaultCookieOptions.maxAge = 60 * 60 * 24 * 30 // Default to 30 days
  }

  return cookies().set(name, typeof value === 'string' ? value : JSON.stringify(value), {
    ...defaultCookieOptions,
    ...options
  })
}

function get(name: Cookie, defaultValue?: any) {
  const value = cookies().get(name)?.value
  return tryParseJSON(value, defaultValue)
}

function destroy(name: Cookie) {
  return cookies().delete(name)
}

serverCookies.set = set
serverCookies.get = get
serverCookies.delete = destroy
