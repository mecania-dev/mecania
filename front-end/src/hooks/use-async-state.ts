import { useState } from 'react'

import { useIsMounted } from './use-is-mounted'

export function useAsyncState<T extends Promise<any>>(fn: () => T) {
  const [state, setState] = useState<Awaited<T>>()

  const isMounted = useIsMounted(async () => {
    setState(await fn())
  })

  return [state, setState, { isMounted }] as const
}
