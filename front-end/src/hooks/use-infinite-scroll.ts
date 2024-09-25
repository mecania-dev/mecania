import { useEffect, useRef, useCallback } from 'react'

export interface UseInfiniteScrollProps {
  /**
   * Whether the infinite scroll is enabled.
   * @default true
   */
  isEnabled?: boolean
  /**
   * Whether there are more items to load, the observer will disconnect when there are no more items to load.
   */
  hasMore?: boolean
  /**
   * The distance in pixels before the end of the items that will trigger a call to load more.
   * @default 50
   */
  distance?: number
  /**
   * Callback to load more items.
   */
  onLoadMore?: () => void
}

export function useInfiniteScroll(props: UseInfiniteScrollProps = {}) {
  const { hasMore = true, distance = 50, isEnabled = true, onLoadMore } = props

  const scrollContainerRef = useRef<HTMLElement>(null)

  const loadMore = useCallback(
    (element: HTMLElement) => {
      const { scrollHeight, clientHeight, scrollTop } = element
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + distance

      if (isNearBottom && hasMore && onLoadMore) {
        onLoadMore()
      }
    },
    [distance, hasMore, onLoadMore]
  )

  useEffect(() => {
    if (!scrollContainerRef.current || !isEnabled || !hasMore) return
    const scrollContainerNode = scrollContainerRef.current

    loadMore(scrollContainerNode)

    function checkIfNearBottom(e: Event) {
      const element = e.target as HTMLElement
      loadMore(element)
    }

    scrollContainerNode.addEventListener('scroll', checkIfNearBottom)

    return () => {
      scrollContainerNode.removeEventListener('scroll', checkIfNearBottom)
    }
  }, [scrollContainerRef, isEnabled, hasMore, loadMore])

  return scrollContainerRef
}

export type UseInfiniteScrollReturn = ReturnType<typeof useInfiniteScroll>