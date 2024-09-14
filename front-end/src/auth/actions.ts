'use server'
import { refreshToken, RefreshTokenRequest } from '@/http'
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

  await setSession(user)
  await setTokens(access, refresh)
  redirect(callbackUrl || '/profile')
}

export async function signOutAction() {
  await clearSession()
  await clearTokens()
  redirect('/sign-in')
}

export async function refreshTokenAction(payload: RefreshTokenRequest) {
  const res = await refreshToken(payload)

  if (!res.ok) {
    await clearSession()
    await clearTokens()
    return
  }

  const { access: newAccess, refresh: newRefresh } = res.data
  await setTokens(newAccess, newRefresh)
  return newAccess
}
