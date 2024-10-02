import { api, ApiRequestConfig } from '../../api'
import { SignInRequest, SignInResponse } from './types'

export * from './types'

export async function signIn(payload: SignInRequest, config?: Omit<ApiRequestConfig<SignInResponse>, 'raw'>) {
  return await api.post<SignInResponse>('auth/login/', payload, { raw: true, ...config })
}
