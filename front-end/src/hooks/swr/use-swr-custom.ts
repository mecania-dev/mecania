import { useState } from 'react'

import { api, ApiRequestConfig, ApiResponse } from '@/http'
import useSWR from 'swr'

import { useQueue } from '../use-queue'
import { fetcher } from './fetcher'

export type SWRKey = (() => string | undefined | null) | string | undefined | null
export type SWRCustom<T = any> = ReturnType<typeof useSWRCustom<T>>
export type SWRRequestMutate<T, RES> = (props: { res: ApiResponse<RES>; state?: T }) => T
export type SWRCustomRequestConfig<T, RES> = ApiRequestConfig<RES> & { mutate?: SWRRequestMutate<T, RES> }

export type SWRCustomConfigs<T> = Parameters<typeof useSWR<T>>[2] & {
  fetcherConfig?: ApiRequestConfig<T>
}

export type MutationQueue<T, RES = any> = {
  mutate: SWRRequestMutate<T, RES>
  res: ApiResponse<RES>
}

export function useSWRCustom<T>(key: SWRKey, { fetcherConfig, ...config }: SWRCustomConfigs<T> = {}) {
  const [isGetLoading, setIsGetLoading] = useState(false)
  const [isPostLoading, setIsPostLoading] = useState(false)
  const [isPutLoading, setIsPutLoading] = useState(false)
  const [isRemoveLoading, setIsRemoveLoading] = useState(false)
  const state = useSWR(key, fetcher.get<T>(fetcherConfig), config)
  const { add: addMutation } = useQueue<MutationQueue<T>>(async ({ res, mutate }) => {
    await state.mutate(mutate({ res, state: state.data }))
  })
  const url = (typeof key === 'function' ? key() : key) || ''

  async function baseRequest<RES = T>(
    promise: Promise<ApiResponse<RES>>,
    setIsLoading: (isLoading: boolean) => void,
    mutate?: SWRRequestMutate<T, RES>
  ) {
    setIsLoading(true)

    const res = await promise
    if (res.ok && mutate) {
      addMutation({ mutate, res })
    } else {
      await state.mutate()
    }

    setIsLoading(false)
    return res
  }

  async function get<RES = T>(configs: SWRCustomRequestConfig<T, RES> = {}) {
    const { url: otherUrl, mutate, ...restConfigs } = configs
    return await baseRequest(api.get<RES>(otherUrl || url, restConfigs), setIsGetLoading, mutate)
  }
  get.isLoading = isGetLoading

  async function post<RES = T>(body: any, configs: SWRCustomRequestConfig<T, RES> = {}) {
    const { url: otherUrl, mutate, ...restConfigs } = configs
    return await baseRequest(api.post<RES>(otherUrl || url, body, restConfigs), setIsPostLoading, mutate)
  }
  post.isLoading = isPostLoading

  async function put<RES = T>(body: any, configs: SWRCustomRequestConfig<T, RES> = {}) {
    const { url: otherUrl, mutate, ...restConfigs } = configs
    return await baseRequest(api.put<RES>(otherUrl || url, body, restConfigs), setIsPutLoading, mutate)
  }
  put.isLoading = isPutLoading

  async function remove<RES = T>(configs: SWRCustomRequestConfig<T, RES> = {}) {
    const { url: otherUrl, mutate, ...restConfigs } = configs
    return await baseRequest(api.delete<RES>(otherUrl || url, restConfigs), setIsRemoveLoading, mutate)
  }
  remove.isLoading = isRemoveLoading

  return {
    state,
    get,
    post,
    put,
    remove,
    isAnyLoading: state.isLoading || isGetLoading || isPostLoading || isPutLoading || isRemoveLoading
  }
}
