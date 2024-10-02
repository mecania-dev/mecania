import { useEffect, useState } from 'react'

import { PaginationAction, PaginationState, UsePaginationProps } from './types'

export * from './types'

const initialState: PaginationState<any> = {
  items: [],
  next: null,
  previous: null,
  last: null,
  hasMore: true,
  isMounted: false,
  isLoading: false
}

function reducer<T>(state: PaginationState<T>, action: PaginationAction<T>): PaginationState<T> {
  switch (action.type) {
    case 'LOAD_MORE':
      return { ...state, isLoading: true }
    case 'LOAD_MORE_SUCCESS':
      return {
        ...state,
        items: action.payload.reset ? action.payload.items : [...state.items, ...action.payload.items],
        next: action.payload.next,
        previous: action.payload.previous,
        last: action.payload.last,
        hasMore: !!action.payload.next,
        isMounted: true,
        isLoading: false
      }
    case 'LOAD_MORE_FAILURE':
      return { ...state, isLoading: false, error: action.error }
    case 'RESET':
      return { ...initialState, ...action.payload }
    default:
      return state
  }
}

let listeners: Array<(state: PaginationState<any>) => void> = []
let memoryState = initialState

function dispatch<T>(action: PaginationAction<T>) {
  memoryState = reducer(memoryState, action)
  listeners.forEach(listener => {
    listener(memoryState)
  })
}

export function usePagination<T>({ load, onStateChange }: UsePaginationProps<T>) {
  const [state, setState] = useState<PaginationState<T>>(memoryState)

  useEffect(() => {
    if (memoryState.isMounted && onStateChange) {
      onStateChange(memoryState)
    }
    listeners.push(setState)
    return () => {
      listeners = []
    }
  }, [state, onStateChange])

  async function loadMore() {
    if (memoryState.isLoading || !memoryState.hasMore || memoryState.error || !load) return

    dispatch({ type: 'LOAD_MORE' })
    try {
      const newProps = await load({ items: memoryState.items, next: memoryState.next })
      dispatch({ type: 'LOAD_MORE_SUCCESS', payload: newProps })
    } catch (error) {
      dispatch({ type: 'LOAD_MORE_FAILURE', error })
    }
  }

  function reset(defaultValues?: Partial<PaginationState<T>>) {
    dispatch({ type: 'RESET', payload: defaultValues })
  }

  return [memoryState, loadMore, reset] as const
}
