import { useState } from 'react'

type FromPromise<T> = T extends PromiseLike<infer U> ? U : T

export function useIsLoading<T extends any[], R>(fn: (...args: T) => R) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleFn(...args: Parameters<typeof fn>) {
    const res = fn(...args)

    if (res instanceof Promise) {
      setIsLoading(true)
      await res
      setIsLoading(false)
    }

    return res as FromPromise<R>
  }

  return [handleFn, isLoading] as const
}
