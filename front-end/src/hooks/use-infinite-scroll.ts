import { useEffect, useRef, useCallback } from 'react'

import { debounce } from 'lodash'

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
  const isLoadingRef = useRef(false)

  const loadMore = useCallback(
    (element: HTMLElement) => {
      let timer: ReturnType<typeof setTimeout>
      const { scrollHeight, clientHeight, scrollTop } = element
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + distance

      if (!isLoadingRef.current && isNearBottom && hasMore && onLoadMore) {
        isLoadingRef.current = true
        onLoadMore()
        timer = setTimeout(() => {
          isLoadingRef.current = false
        }, 100) // Debounce time to prevent multiple calls
      }

      return () => clearTimeout(timer)
    },
    [distance, hasMore, onLoadMore]
  )

  useEffect(() => {
    if (!scrollContainerRef.current || !isEnabled || !hasMore) return
    const scrollContainerNode = scrollContainerRef.current

    loadMore(scrollContainerNode)

    const debouncedCheckIfNearBottom = debounce((e: Event) => {
      const element = e.target as HTMLElement
      loadMore(element)
    }, 100)

    scrollContainerNode.addEventListener('scroll', debouncedCheckIfNearBottom)

    return () => {
      scrollContainerNode.removeEventListener('scroll', debouncedCheckIfNearBottom)
    }
  }, [scrollContainerRef, isEnabled, hasMore, loadMore])

  return scrollContainerRef
}

export type UseInfiniteScrollReturn = ReturnType<typeof useInfiniteScroll>
