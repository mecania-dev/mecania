import { api, ApiRequestConfig } from '../../api'
import { RefreshTokenRequest, RefreshTokenResponse } from './types'

export * from './types'

export async function refreshToken(
  payload: RefreshTokenRequest,
  config?: Omit<ApiRequestConfig<RefreshTokenResponse>, 'raw'>
) {
  return await api.post<RefreshTokenResponse>('auth/refresh/', payload, { raw: true, ...config })
}
