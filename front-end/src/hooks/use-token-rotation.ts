'use client'

import { useCallback, useEffect, useState } from 'react'

import { api } from '@/lib/api'
import { clientCookies } from '@/lib/cookies/client'
import { TokenResponse } from '@/types/auth'
import { differenceInMilliseconds } from 'date-fns'

import { useAsyncState } from './use-async-state'

let tokenRotationTimer: NodeJS.Timeout

async function getTokensOrRotate() {
  const tokens = clientCookies.get('tokens')
  if (!tokens) return
  if (isTokenValid(tokens.access)) return tokens
  return await rotate(tokens)
}

export function useTokenRotation() {
  const [isValidating, setValidating] = useState(true)
  const [tokens, setTokensState, { isMounted }] = useAsyncState(async () => {
    return await getTokensOrRotate().finally(() => setValidating(false))
  })

  const setTokens = useCallback(
    (tokens?: TokenResponse) => {
      setTokensState(tokens)
      setCookies(tokens)
    },
    [setTokensState]
  )

  useEffect(() => {
    if (!tokens) return
    const delay = calculateRotationTime(tokens.access)
    console.log('Token rotation delay:', delay / 1000);
    

    if(tokenRotationTimer) clearTimeout(tokenRotationTimer)

    tokenRotationTimer = setTimeout(() => {
      setValidating(true)
      rotate(tokens, false)
        .then(setTokens)
        .finally(() => setValidating(false))
    }, delay)

    return () => clearTimeout(tokenRotationTimer)
  }, [setTokens, tokens])

  function clearTokens() {
    setTokens(undefined)
  }

  const response = {
    ...tokens,
    isMounted,
    isValidating,
    isValid: !!tokens
  }

  return [response, setTokens, clearTokens] as const
}

async function rotate(tokens: TokenResponse, save = true) {
  let newTokens: TokenResponse | undefined

  if (isTokenValid(tokens.refresh)) {
    const res = await api.post<TokenResponse>('auth/token/refresh/', { refresh: tokens.refresh.token })
    newTokens = res.ok ? res.data : undefined
  }

  save && setCookies(newTokens)
  return newTokens
}

function setCookies(tokens?: TokenResponse) {
  tokens ? clientCookies.set('tokens', tokens) : clientCookies.delete('tokens')
}

function calculateRotationTime(token?: TokenResponse['access'], gap: number = 30) {
  if (!token) return 0
  gap += 60 // Add 1 minute because the server is 1 minute ahead for some reason
  const currentDate = Date.now() + gap * 1000 // Rotate gap seconds before expiration
  return differenceInMilliseconds(token.expires, currentDate)
}

function isTokenValid(token?: TokenResponse['access'], gap?: number) {
  return calculateRotationTime(token, gap) > 0
}
