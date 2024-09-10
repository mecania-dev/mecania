import { useEffect, useState } from 'react'

import { api, ApiRequestConfig } from '@/lib/api'

export interface AsyncAutocompleteListResponse<T extends Record<string, any>> {
  items: T[]
  hasMore: boolean
  count: number
  offset: number
}

export type AsyncAutocompleteItem<T extends Record<string, any>> = AsyncAutocompleteListResponse<T>['items'][number]

export interface UseAsyncAutocompleteListProps<T extends Record<string, any>> {
  id: keyof T
  url: string
  config?:
    | ApiRequestConfig<AsyncAutocompleteListResponse<T>>
    | ((search?: string) => ApiRequestConfig<AsyncAutocompleteListResponse<T>>)
  search?: string
  limit?: number
  transform?(data: AsyncAutocompleteListResponse<T>): void
  filter?(item: AsyncAutocompleteItem<T>): boolean
}

export function useAsyncAutocompleteList<T extends Record<string, any>>({
  id,
  url,
  config = { params: {} },
  search,
  limit = 50,
  transform,
  filter
}: UseAsyncAutocompleteListProps<T>) {
  const [items, setItems] = useState<AsyncAutocompleteItem<T>[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [offset, setOffset] = useState(0)

  const loadItems = async (isSearching = false) => {
    const controller = new AbortController()
    const { signal } = controller

    setIsLoading(true)

    if (typeof config === 'function') {
      config = config(search)
    }

    config.signal = signal
    config.params.limit = limit
    config.params.offset = isSearching ? 0 : offset

    const { ok, data } = await api.get<AsyncAutocompleteListResponse<T>>(url, config)

    if (!ok) {
      console.error('There was an error with the fetch operation:', data)
      setIsLoading(false)
      return
    }

    if (transform) {
      transform(data)
    }

    if (isSearching) {
      setItems(filter ? data.items.filter(filter) : data.items)
    } else {
      setItems(prev => {
        const newItems = data.items.filter(item => !prev.some(i => i[id] === item[id]) && (!filter || filter(item)))
        return [...prev, ...newItems]
      })
    }
    setHasMore(data.hasMore)
    setOffset(data.offset + data.count)
    setIsLoading(false)
  }

  useEffect(() => {
    loadItems(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const onLoadMore = () => {
    loadItems()
  }

  return {
    items,
    hasMore,
    isLoading,
    onLoadMore
  }
}
