import { ToastProps } from '@/components/toast'
import { MaybePromise } from '@/lib/promise'
import { LiteralUnion } from '@/types/utils'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

type Message = { title?: string; description?: string; type?: ToastProps['type'] } | string | null | undefined

export interface RaiseToastProps<T> {
  message: ApiRequestConfig<T>['successMessage'] | ApiRequestConfig<T>['errorMessage']
  messageParam: any
  type?: ToastProps['type']
  raiseToast?: boolean
}

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
