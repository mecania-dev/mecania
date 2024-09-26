import { UsePaginationProps } from '../use-pagination'

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
  onLoadMore?: UsePaginationProps<T>['load']
}
