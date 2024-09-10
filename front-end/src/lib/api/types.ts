import { ToastProps } from '@/components/toast'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

import { LiteralUnion, Primitive } from '@/types/utils'
import { MaybePromise } from '../promise';

type Message = { title?: string; description?: string; type?: ToastProps['type'] } | string | null | undefined

export interface ApiRequestConfig<T = any> extends AxiosRequestConfig<T> {
  successMessage?: Message | ((res: AxiosResponse<T>) => Message)
  errorMessage?: Message | ((error: any) => Message)
  successMessageKey?: T extends Primitive ? T : LiteralUnion<keyof T, string>
  raiseToast?: boolean
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
