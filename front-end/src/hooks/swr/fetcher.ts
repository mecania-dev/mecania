import { api, ApiRequestConfig } from '@/http'

export const fetcher = {
  get:
    <T = any>(config?: ApiRequestConfig<T>) =>
    (url: string) =>
      api.get<T>(url, config).then(res => {
        if (!res.ok) throw res.data
        return res.data
      }),
  post:
    <T = any>(config?: ApiRequestConfig<T>) =>
    (url: string, { arg }: { arg: any }) =>
      api.post<T>(url, arg, config).then(res => {
        if (!res.ok) throw res.data
        return res.data
      }),
  put:
    <T = any>(config?: ApiRequestConfig<T>) =>
    (url: string, { arg }: { arg: any }) =>
      api.put<T>(url, arg, config).then(res => {
        if (!res.ok) throw res.data
        return res.data
      }),
  patch:
    <T = any>(config?: ApiRequestConfig<T>) =>
    (url: string, { arg }: { arg: any }) =>
      api.patch<T>(url, arg, config).then(res => {
        if (!res.ok) throw res.data
        return res.data
      }),
  delete:
    <T = any>(config?: ApiRequestConfig<T>) =>
    (url: string) =>
      api.delete<T>(url, config).then(res => {
        if (!res.ok) throw res.data
        return res.data
      })
}
