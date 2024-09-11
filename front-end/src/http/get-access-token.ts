'use server'

import { validateTokens } from '@/auth'

export async function getAccessToken() {
  const tokens = await validateTokens()
  if (!tokens) return undefined

  return tokens.access.token
}
