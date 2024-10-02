import { MaybePromise } from '@/lib/promise'

export interface LoadMoreProps<T> {
  items: T[]
  next?: string | null
  previous?: string | null
  last?: string | null
  reset?: boolean
}

export interface PaginationState<T> extends Omit<LoadMoreProps<T>, 'reset'> {
  error?: any
  hasMore: boolean
  isMounted: boolean
  isLoading: boolean
}

export type PaginationAction<T> =
  | { type: 'LOAD_MORE' }
  | { type: 'LOAD_MORE_SUCCESS'; payload: LoadMoreProps<T> }
  | { type: 'LOAD_MORE_FAILURE'; error: any }
  | { type: 'RESET'; payload?: Partial<PaginationState<T>> }

export interface UsePaginationProps<T> {
  load?: MaybePromise<(state: LoadMoreProps<T>) => LoadMoreProps<T>>
  onStateChange?: (state: PaginationState<T>) => void
}
