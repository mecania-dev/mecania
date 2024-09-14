'use server'
import { cookies } from '@/lib/cookies'
import { User } from '@/types/entities/user'
import { redirect } from 'next/navigation'

import { clearSession, clearTokens, setSession, setTokens } from '.'

export async function setCredentialsAction(props: { access: string; refresh: string; user: User }) {
  const { access, refresh, user } = props
  const callbackUrl = await cookies('callback-url')

  if (!user) {
    throw new Error('User should be returned from the server')
  }

  await setSession(user, access)
  await setTokens(access, refresh)
  redirect(callbackUrl || '/profile')
}

export async function signOutAction(shouldRedirect = true) {
  await clearSession()
  await clearTokens()
  shouldRedirect && redirect('/sign-in')
}
