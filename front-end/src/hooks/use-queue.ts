import { useEffect } from 'react'

import { MaybePromise, maybePromise } from '@/lib/promise'

import { useArrayState } from './use-array-state'

export function useQueue<T>(action: MaybePromise<(item: T) => void>, disable?: boolean) {
  const [queue, actions, setQueue] = useArrayState<T>([])

  useEffect(() => {
    if (!disable) {
      for (let i = 0; i < queue.length; i++) {
        const item = queue[i]
        maybePromise(action, item).finally(() => actions.remove(i))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, disable])

  return { ...actions, queue, setQueue }
}
