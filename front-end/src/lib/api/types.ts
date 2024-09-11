import { ToastProps } from '@/components/toast'
import { LiteralUnion } from '@/types/utils'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

import { MaybePromise } from '../promise'

type Message = { title?: string; description?: string; type?: ToastProps['type'] } | string | null | undefined

export interface ApiRequestConfig<T = any> extends AxiosRequestConfig<T> {
  successMessage?: Message | ((res: AxiosResponse<T>) => Message)
  errorMessage?: Message | ((error: any) => Message)
  successMessageKey?: LiteralUnion<keyof T, string>
  raiseToast?: boolean
  raw?: boolean
  onSuccess?: MaybePromise<(res: AxiosResponse<T>) => void>
  onError?: MaybePromise<(error: any) => void>
}

export interface ApiResponse<T = any> extends Omit<AxiosResponse<T>, 'headers' | 'config'> {
  ok: boolean
  headers?: AxiosResponse<T>['headers']
  config?: AxiosResponse<T>['config']
}

type ApiRequestConfigField =
  | 'successMessage'
  | 'errorMessage'
  | 'successMessageKey'
  | 'raiseToast'
  | 'onSuccess'
  | 'onError'

export const apiRequestConfigKeys: ApiRequestConfigField[] = [
  'successMessage',
  'errorMessage',
  'successMessageKey',
  'raiseToast',
  'onSuccess',
  'onError'
]
