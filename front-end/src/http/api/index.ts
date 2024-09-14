import { apiClient, rawApiClient } from '@/http'
import { mapPropsVariants } from '@/lib/variants'
import { AxiosResponse } from 'axios'

import { ApiRequestConfig, apiRequestConfigKeys } from './types'
import { handleError, handleSuccess } from './utils'

export * from './types'
export * from './client'
export const api = { get, post, put, patch, delete: remove }

async function baseRequest<T>(promise: Promise<AxiosResponse<T>>, config: ApiRequestConfig<T> = {}) {
  try {
    const res = await promise
    return await handleSuccess<T>(res, config)
  } catch (error: any) {
    return await handleError(error, config)
  }
}

function getApiClient(raw?: boolean) {
  return raw ? rawApiClient : apiClient
}

async function get<T>(url: string, { raw, ...config }: ApiRequestConfig<T> = {}) {
  const [axiosConfig, apiConfig] = mapPropsVariants(config, apiRequestConfigKeys)
  return await baseRequest(getApiClient(raw).get<T>(url, axiosConfig), apiConfig)
}

async function post<T>(url: string, data: any, { raw, ...config }: ApiRequestConfig<T> = {}) {
  const [axiosConfig, apiConfig] = mapPropsVariants(config, apiRequestConfigKeys)
  return await baseRequest(getApiClient(raw).post<T>(url, data, axiosConfig), apiConfig)
}

async function put<T>(url: string, data: any, { raw, ...config }: ApiRequestConfig<T> = {}) {
  const [axiosConfig, apiConfig] = mapPropsVariants(config, apiRequestConfigKeys)
  return await baseRequest(getApiClient(raw).put<T>(url, data, axiosConfig), apiConfig)
}

async function patch<T>(url: string, data: any, { raw, ...config }: ApiRequestConfig<T> = {}) {
  const [axiosConfig, apiConfig] = mapPropsVariants(config, apiRequestConfigKeys)
  return await baseRequest(getApiClient(raw).patch<T>(url, data, axiosConfig), apiConfig)
}

async function remove<T>(url: string, { raw, ...config }: ApiRequestConfig<T> = {}) {
  const [axiosConfig, apiConfig] = mapPropsVariants(config, apiRequestConfigKeys)
  return await baseRequest(getApiClient(raw).delete<T>(url, axiosConfig), apiConfig)
}
