export async function delay(ms: number = 1000) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

export async function promise(fn?: () => any, delay: number = 1000) {
  await new Promise(resolve =>
    setTimeout(() => {
      resolve(fn?.())
    }, delay)
  )
}

export async function all<T>(promises?: Promise<T>[]) {
  if (!promises) return []
  return await Promise.all(promises)
}

export async function maybePromise<T extends (...args: any[]) => any>(
  func?: T,
  ...args: Parameters<T>
): Promise<ReturnType<T>> {
  const res = func?.(...args)

  if (res instanceof Promise) await res

  return res
}

export * from './types'
