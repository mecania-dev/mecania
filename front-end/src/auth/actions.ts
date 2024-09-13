'use server'

import { getValidAccessToken } from '.'

export async function getValidAccessTokenAction(accessToken?: string, refreshToken?: string) {
  return await getValidAccessToken(accessToken, refreshToken)
}
