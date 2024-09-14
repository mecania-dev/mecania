import { toast } from '@/hooks/use-toast'
import { isObject } from '@/lib/assertions'
import { maybePromise } from '@/lib/promise'
import { AxiosResponse } from 'axios'

import { ApiRequestConfig, RaiseToastProps } from './types'

// Handle success response
function getSuccessMessage<T>(res: any = {}, successMessageKey?: ApiRequestConfig<T>['successMessageKey']) {
  if (!successMessageKey) return
  return res.data?.[successMessageKey]
}

export async function handleSuccess<T>(res: AxiosResponse<T>, config: ApiRequestConfig<T>) {
  await maybePromise(config.onSuccess, res)

  raiseToastFeedback({
    messageParam: res,
    message: config.successMessage || getSuccessMessage(res, config.successMessageKey),
    raiseToast: config.raiseToast,
    type: 'success'
  })

  return { ok: true as const, ...res }
}

// Handle error response
function getErrorMessage(error: any) {
  const resData = error.response?.data
  const status = error.response?.status || 400
  let errorMessage = resData || error.message
  errorMessage = isObject(errorMessage) ? errorMessage.message || errorMessage.error : String(errorMessage)
  return errorMessage || `[${status}]: Algo deu errado ao realizar a chamada`
}

export async function handleError<T>(error: any, config: ApiRequestConfig<T>) {
  const status = error.response?.status || 400
  const errorMessage = getErrorMessage(error)

  await maybePromise(config.onError, error)

  raiseToastFeedback({
    messageParam: error,
    message: config.errorMessage || errorMessage,
    raiseToast: config.raiseToast,
    type: 'error'
  })

  return { ok: false as const, data: error, status, statusText: errorMessage }
}

// Handle toast feedback
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
