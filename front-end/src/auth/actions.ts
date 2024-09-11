'use server'

import { signIn as serverSignIn, signOut as serverSignOut, validateTokens } from '.'

export async function signIn(props: Parameters<typeof serverSignIn>[0]) {
  const response = await serverSignIn(props)
  return response.ok
}

export async function signOut() {
  return await serverSignOut()
}

export async function validateAuthState() {
  const tokens = await validateTokens()
  return !!tokens
}
