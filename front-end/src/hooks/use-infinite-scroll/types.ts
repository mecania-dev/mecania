import { MaybePromise } from '@/lib/promise'

export interface LoadMoreProps<T> {
  items: T[]
  next?: string | null
}

export interface InfiniteScrollState<T> extends LoadMoreProps<T> {
  hasMore: boolean
  isMounted: boolean
  isLoading: boolean
}

export type InfiniteScrollAction<T> =
  | { type: 'LOAD_MORE' }
  | { type: 'LOAD_MORE_SUCCESS'; payload: LoadMoreProps<T> }
  | { type: 'LOAD_MORE_FAILURE' }

export interface UseInfiniteScrollProps<T> {
  /**
   * Whether the infinite scroll is enabled.
   * @default true
   */
  isEnabled?: boolean
  /**
   * The distance in pixels before the end of the items that will trigger a call to load more.
   * @default 50
   */
  distance?: number
  /**
   * Callback to load more items.
   */
  onLoadMore?: MaybePromise<(props: LoadMoreProps<T>) => LoadMoreProps<T>>
}
