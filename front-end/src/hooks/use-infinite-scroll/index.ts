import { useEffect, useRef, useCallback, useState } from 'react'

import { InfiniteScrollAction, InfiniteScrollState, UseInfiniteScrollProps } from './types'

export * from './types'

function reducer<T>(state: InfiniteScrollState<T>, action: InfiniteScrollAction<T>): InfiniteScrollState<T> {
  switch (action.type) {
    case 'LOAD_MORE':
      return { ...state, isLoading: true }
    case 'LOAD_MORE_SUCCESS':
      return {
        ...state,
        items: [...state.items, ...action.payload.items],
        next: action.payload.next,
        hasMore: !!action.payload.next,
        isMounted: true,
        isLoading: false
      }
    case 'LOAD_MORE_FAILURE':
      return { ...state, isLoading: false }
    default:
      return state
  }
}

let listeners: Array<(state: InfiniteScrollState<any>) => void> = []
let memoryState: InfiniteScrollState<any> = { items: [], next: null, hasMore: true, isMounted: false, isLoading: false }

function dispatch<T>(action: InfiniteScrollAction<T>) {
  memoryState = reducer(memoryState, action)
  listeners.forEach(listener => {
    listener(memoryState)
  })
}

export function useInfiniteScroll<T>(props: UseInfiniteScrollProps<T> = {}) {
  const { distance = 50, isEnabled = true, onLoadMore } = props
  const [state, setState] = useState<InfiniteScrollState<T>>(memoryState)
  const scrollContainerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      listeners = []
    }
  }, [state])

  const loadMore = useCallback(
    async (element: HTMLElement) => {
      const { scrollHeight, clientHeight, scrollTop } = element
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + distance

      if (!isEnabled || !onLoadMore) return

      if ((isNearBottom || !memoryState.isMounted) && !memoryState.isLoading) {
        dispatch({ type: 'LOAD_MORE' })
        try {
          const newProps = await onLoadMore({ items: memoryState.items, next: memoryState.next })
          dispatch({ type: 'LOAD_MORE_SUCCESS', payload: newProps })
        } catch (error) {
          dispatch({ type: 'LOAD_MORE_FAILURE' })
        }
      }
    },
    [distance, isEnabled, onLoadMore]
  )

  useEffect(() => {
    if (!scrollContainerRef.current) return
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
  }, [scrollContainerRef, loadMore])

  return [state, scrollContainerRef, dispatch] as const
}

export type UseInfiniteScrollReturn = ReturnType<typeof useInfiniteScroll>
