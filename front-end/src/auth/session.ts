import { env } from '@/env'
import { cookies } from '@/lib/cookies'
import { User } from '@/types/entities/user'

import { getTokenExpiration } from './token'

const sessionRequiredFields: (keyof User)[] = ['id', 'groups', 'isSuperuser']

export async function getSession() {
  const sessionJson = await cookies('session')
  if (sessionJson) {
    try {
      const session = JSON.parse(sessionJson) as User

      if (sessionRequiredFields.some(key => !(key in session))) {
        throw new Error('Invalid session')
      }

      return session
    } catch {}
  }
}

export async function setSession(user?: User, access?: string) {
  if (user && access) {
    await cookies.set(
      {
        session: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          isAi: user.isAi,
          isActive: user.isActive,
          isSuperuser: user.isSuperuser,
          isStaff: user.isStaff,
          groups: user.groups,
          permissions: user.permissions,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      },
      {
        maxAge: getTokenExpiration(access) - Date.now() / 1000,
        path: '/',
        secure: !env.NEXT_PUBLIC_DEVELOPMENT,
        sameSite: 'strict'
      }
    )
  }
}

export async function clearSession() {
  await cookies.delete('session')
}
