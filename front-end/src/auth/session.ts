import { cookies } from '@/lib/cookies'
import { User } from '@/types/entities/user'

export async function getSession() {
  const sessionJson = await cookies('session')
  if (sessionJson) {
    try {
      return JSON.parse(sessionJson) as User
    } catch {}
  }
}

export async function setSession(user?: User) {
  if (user) {
    await cookies.set({ session: user })
  }
}

export async function clearSession() {
  await cookies.delete('session')
}
