import { ToastProps } from '@/components/toast'
import { toast } from '@/hooks/use-toast'
import { apiClient } from '@/http/api-client'
import { ApiRequestConfig, ApiResponse, apiRequestConfigKeys } from './types'
import { AxiosResponse } from 'axios'

import { maybePromise } from '../promise'
import { mapPropsVariants } from '../variants'
import { isObject } from '../assertions'

interface RaiseToastProps<T> {
  message: ApiRequestConfig<T>['successMessage'] | ApiRequestConfig<T>['errorMessage']
  messageParam: any
  type?: ToastProps['type']
  raiseToast?: boolean
}

async function baseRequest<T>(promise: Promise<AxiosResponse<T>>, config: ApiRequestConfig<T> = {}) {
  try {
    const res = await promise
    return handleSuccess<T>(res, config)
  } catch (error: any) {
    return handleError(error, config)
  }
}

async function get<T>(url: string, config: ApiRequestConfig<T> = {}): Promise<ApiResponse<T>> {
  const [axiosConfig, apiConfig] = mapPropsVariants(config, apiRequestConfigKeys)
  return await baseRequest(apiClient.get<T>(url, axiosConfig), apiConfig)
}

async function post<T>(url: string, data: any, config: ApiRequestConfig<T> = {}): Promise<ApiResponse<T>> {
  const [axiosConfig, apiConfig] = mapPropsVariants(config, apiRequestConfigKeys)
  return await baseRequest(apiClient.post<T>(url, data, axiosConfig), apiConfig)
}

async function put<T>(url: string, data: any, config: ApiRequestConfig<T> = {}): Promise<ApiResponse<T>> {
  const [axiosConfig, apiConfig] = mapPropsVariants(config, apiRequestConfigKeys)
  return await baseRequest(apiClient.put<T>(url, data, axiosConfig), apiConfig)
}

async function patch<T>(url: string, data: any, config: ApiRequestConfig<T> = {}): Promise<ApiResponse<T>> {
  const [axiosConfig, apiConfig] = mapPropsVariants(config, apiRequestConfigKeys)
  return await baseRequest(apiClient.patch<T>(url, data, axiosConfig), apiConfig)
}

async function remove<T>(url: string, config: ApiRequestConfig<T> = {}): Promise<ApiResponse<T>> {
  const [axiosConfig, apiConfig] = mapPropsVariants(config, apiRequestConfigKeys)
  return await baseRequest(apiClient.delete<T>(url, axiosConfig), apiConfig)
}

export const api = { get, post, put, patch, delete: remove }

function raiseToastFeedback<T>({ messageParam, message, type, raiseToast }: RaiseToastProps<T>) {
  if (typeof message === 'function') {
    message = message(messageParam)
  }
  const title = typeof message === 'string' ? undefined : message?.title
  const actualMessage = typeof message === 'string' ? message : message?.description
  const actualType = typeof message === 'string' ? type || 'info' : message?.type || 'info'

  if (raiseToast && actualMessage) {
    toast({ title, message: actualMessage, type: actualType })
  }
}

async function handleSuccess<T>(res: AxiosResponse<T>, config: ApiRequestConfig<T>) {
  await maybePromise(config.onSuccess, res)

  raiseToastFeedback({
    messageParam: res,
    message: config.successMessage || getSuccessMessage(res, config.successMessageKey),
    raiseToast: config.raiseToast,
    type: 'success'
  })

  return { ok: true, ...res }
}

async function handleError<T>(error: any, config: ApiRequestConfig<T>) {
  const status = error.response?.status || 400
  const errorMessage = getErrorMessage(error)

  await maybePromise(config.onError, error)

  raiseToastFeedback({
    messageParam: error,
    message: config.errorMessage || errorMessage,
    raiseToast: config.raiseToast,
    type: 'error'
  })

  return { ok: false, data: error, status, statusText: errorMessage }
}

function getSuccessMessage<T>(res: any = {}, successMessageKey?: ApiRequestConfig<T>['successMessageKey']) {
  if (!successMessageKey) return
  return res.data?.[successMessageKey]
}

function getErrorMessage(error: any) {
  const resData = error.response?.data
  const status = error.response?.status || 400
  let errorMessage = resData || error.message
  errorMessage = isObject(errorMessage) ? errorMessage.message || errorMessage.error : String(errorMessage)
  return errorMessage || `[${status}]: Algo deu errado ao realizar a chamada`
}

export * from './types'