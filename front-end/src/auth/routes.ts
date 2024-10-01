import { auth } from './auth'
import { AppAbility } from './casl'

export type AuthRoute =
  | '/sign-in'
  | '/sign-up'
  | '/forgot-password'
  | '/profile'
  | '/profile/addresses'
  | '/profile/requests'
  | '/profile/vehicles'
  | '/chat'
  | '/mechanics'
  | '/services'

export type AuthRouteOption = {
  can?: Parameters<AppAbility['can']> | Parameters<AppAbility['can']>[]
  canLogicType?: 'and' | 'or'
  onAuthorized?: (isAuthenticated: boolean, ability?: AppAbility) => void
  onUnauthorized?: (isAuthenticated: boolean, ability?: AppAbility) => void
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

export async function isAuthorizedRoute(
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

  return await auth({
    custom({ isAuthenticated, ability }) {
      if (!route) {
        console.error(`Route ${pathname} is not found in authRoutes`)
        return true
      }

      if (!isAthorizedRoute) {
        if (isAuthenticated) {
          route.onUnauthorized?.(isAuthenticated, ability)
          return false
        }

        route.onAuthorized?.(isAuthenticated, ability)
        return true
      }

      let isAuthorized = isAuthenticated

      if (route.can) {
        const can = Array.isArray(route.can[0]) ? route.can : [route.can]
        if (route.canLogicType === 'and') {
          isAuthorized = can.every(c => !!ability?.can(...(c as any)))
        } else {
          isAuthorized = can.some(c => !!ability?.can(...(c as any)))
        }
      }

      if (!isAuthorized) {
        route.onUnauthorized?.(isAuthenticated, ability)
        return false
      }

      route.onAuthorized?.(isAuthenticated, ability)
      return true
    }
  })
}
