import { MaybePromise } from '@/lib/promise'
import { usePathname } from 'next/navigation'

import { useIsLoading } from './use-is-loading'
import { useIsMounted } from './use-is-mounted'

export function usePathnameChange(
  fn: MaybePromise<(pathname: string) => any> = () => {},
  deps: React.DependencyList = []
) {
  const pathname = usePathname()
  const [loadingFn, isLoading] = useIsLoading(fn)

  const isMounted = useIsMounted(async () => {
    await loadingFn(pathname)
  }, [pathname, ...deps])

  return { isMounted, isLoading }
}
