import { api, ApiRequestConfig } from '../api'
import { SignUpRequest, SignUpResponse } from './types'

export * from './types'

export async function signUp(payload: SignUpRequest, config?: Omit<ApiRequestConfig<SignUpResponse>, 'raw'>) {
  return await api.post<SignUpResponse>('users/', payload, { raw: true, ...config })
}
