import { maybePromise, MaybePromise } from '@/lib/promise'

import { auth } from './auth'
import { AppAbility } from './casl'

export type AuthRoute =
  | '/sign-in'
  | '/sign-up'
  | '/forgot-password'
  | '/profile'
  | '/profile/addresses'
  | '/profile/requests'
  | '/profile/services'
  | '/profile/vehicles'
  | '/chat'
  | '/mechanics'
  | '/services'

export type AuthRouteOption = {
  can?: Parameters<AppAbility['can']> | Parameters<AppAbility['can']>[]
  canLogicType?: 'and' | 'or'
  onAuthorized?: MaybePromise<(isAuthenticated: boolean, ability?: AppAbility) => any>
  onUnauthorized?: MaybePromise<(isAuthenticated: boolean, ability?: AppAbility) => any>
}

export type AuthRoutes = {
  [key in AuthRoute]?: AuthRouteOption
}

// The order is important: from the most specific to the least specific
// Example: '/profile/addresses' should be before '/profile'
export const authRoutes: { unauthorized: AuthRoutes; authorized: AuthRoutes } = {
  unauthorized: {
    '/sign-in': {},
    '/sign-up': {},
    '/forgot-password': {}
  },
  authorized: {
    '/profile/addresses': {
      can: ['create', 'Address']
    },
    '/profile/vehicles': {
      can: ['create', 'Vehicle']
    },
    '/profile/requests': {
      can: [
        ['message_mechanic', 'Chat'],
        ['message_user', 'Chat']
      ]
    },
    '/profile/services': {
      can: ['provide', 'Service']
    },
    '/profile': {},
    '/chat': {
      can: ['ask_ai', 'Chat']
    },
    '/mechanics': {
      can: ['manage', 'User']
    },
    '/services': {
      can: ['manage', 'Service']
    }
  }
} as const

export function getAuthRoute(
  pathname: string,
  options: AuthRoutes & {
    unauthorized?: Pick<AuthRouteOption, 'onAuthorized' | 'onUnauthorized'>
    authorized?: Pick<AuthRouteOption, 'onAuthorized' | 'onUnauthorized'>
  } = {}
) {
  let isAthorizedRoute = false
  let route: AuthRouteOption | undefined

  for (const [routeType, routes] of Object.entries(authRoutes)) {
    for (const [routeName, routeOptions] of Object.entries(routes)) {
      if (pathname.startsWith(routeName)) {
        const routeOptionsArg = options[routeName as AuthRoute]
        isAthorizedRoute = routeType === 'authorized'
        route = Object.assign(
          {},
          routeOptions,
          Object.assign({}, isAthorizedRoute ? options.authorized : options.unauthorized, routeOptionsArg)
        )
        break
      }
    }
  }

  return { isAthorizedRoute, route }
}

export async function isAuthorizedRoute(
  pathname: string,
  isAuthenticated: boolean,
  ability?: AppAbility,
  options: Parameters<typeof getAuthRoute>[1] = {}
) {
  const { isAthorizedRoute, route } = getAuthRoute(pathname, options)

  if (!route) return true

  let isAuthorized = isAthorizedRoute ? isAuthenticated : !isAuthenticated

  if (isAthorizedRoute && route.can) {
    const can = Array.isArray(route.can[0]) ? route.can : [route.can]
    if (route.canLogicType === 'and') {
      isAuthorized = can.every(c => !!ability?.can(...(c as any)))
    } else {
      isAuthorized = can.some(c => !!ability?.can(...(c as any)))
    }
  }

  if (!isAuthorized) {
    await maybePromise(route.onUnauthorized, isAuthenticated, ability)
    return false
  }

  await maybePromise(route.onAuthorized, isAuthenticated, ability)
  return true
}

export async function getIsAuthorizedRoute(pathname: string, options: Parameters<typeof getAuthRoute>[1] = {}) {
  return auth({
    custom: ({ isAuthenticated, ability }) => isAuthorizedRoute(pathname, isAuthenticated, ability, options)
  })
}
