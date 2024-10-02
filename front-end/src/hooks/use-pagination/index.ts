import { useEffect, useRef, useState } from 'react'

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

let memoryState = initialState
let setMemoryState: ((state: PaginationState<any>) => void) | undefined

function dispatch<T>(action: PaginationAction<T>) {
  memoryState = reducer(memoryState, action)
  setMemoryState?.(memoryState)
}

export function usePagination<T>({ load, onStateChange }: UsePaginationProps<T>) {
  const abortRef = useRef<AbortController | null>(null)
  const [state, setState] = useState<PaginationState<T>>(memoryState)

  useEffect(() => {
    onStateChange?.(memoryState)
    setMemoryState = setState

    return () => {
      setMemoryState = undefined
    }
  }, [state, onStateChange])

  async function loadMore() {
    if (memoryState.isLoading || !memoryState.hasMore || memoryState.error || !load) return

    dispatch({ type: 'LOAD_MORE' })
    try {
      if (abortRef.current) {
        abortRef.current.abort()
      }
      abortRef.current = new AbortController()

      const newProps = await load({
        items: memoryState.items,
        next: memoryState.next,
        previous: memoryState.previous,
        last: memoryState.last,
        signal: abortRef.current.signal
      })

      dispatch({ type: 'LOAD_MORE_SUCCESS', payload: newProps })
    } catch (error) {
      dispatch({ type: 'LOAD_MORE_FAILURE', error })
    }
  }

  function reset(defaultValues?: Partial<PaginationState<T>>) {
    if (abortRef.current) {
      abortRef.current.abort()
    }
    dispatch({ type: 'RESET', payload: defaultValues })
  }

  return { state, abortRef, loadMore, reset } as const
}
