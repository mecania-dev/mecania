import { MaybePromise } from '@/lib/promise'

export interface LoadMoreProps<T> {
  items: T[]
  next?: string | null
}

export interface PaginationState<T> extends LoadMoreProps<T> {
  error?: any
  hasMore: boolean
  isMounted: boolean
  isLoading: boolean
}

export type PaginationAction<T> =
  | { type: 'LOAD_MORE' }
  | { type: 'LOAD_MORE_SUCCESS'; payload: LoadMoreProps<T> }
  | { type: 'LOAD_MORE_FAILURE'; error: any }

export interface UsePaginationProps<T> {
  load?: MaybePromise<(state: LoadMoreProps<T>) => LoadMoreProps<T>>
}
