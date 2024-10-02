import { useEffect, useRef, useCallback } from 'react'

import { usePagination } from '../use-pagination'
import { UseInfiniteScrollProps } from './types'

export * from './types'

export function useInfiniteScroll<T>({
  distance = 50,
  isEnabled = true,
  onLoadMore,
  onStateChange
}: UseInfiniteScrollProps<T> = {}) {
  const [state, loadMore] = usePagination({ load: onLoadMore, onStateChange })
  const scrollContainerRef = useRef<HTMLElement>(null)

  const handleLoadMore = useCallback(
    async (element: HTMLElement) => {
      const { scrollHeight, clientHeight, scrollTop } = element
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + distance

      if (isEnabled && (isNearBottom || !state.isMounted)) {
        await loadMore()
      }
    },
    [distance, isEnabled, state.isMounted, loadMore]
  )

  useEffect(() => {
    if (!scrollContainerRef.current) return
    const scrollContainerNode = scrollContainerRef.current

    handleLoadMore(scrollContainerNode)

    function checkIfNearBottom(e: Event) {
      const element = e.target as HTMLElement
      handleLoadMore(element)
    }

    scrollContainerNode.addEventListener('scroll', checkIfNearBottom)

    return () => {
      scrollContainerNode.removeEventListener('scroll', checkIfNearBottom)
    }
  }, [scrollContainerRef, handleLoadMore])

  return [state, scrollContainerRef, handleLoadMore] as const
}

export type UseInfiniteScrollReturn = ReturnType<typeof useInfiniteScroll>
