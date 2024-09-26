import { useState } from 'react'

import { Autocomplete, AutocompleteProps } from '@/components/autocomplete'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { api, ApiRequestConfig } from '@/http'

interface ItemsResponse<T> {
  results: T[]
  next: string | null
}

type OmittedProps = 'scrollRef' | 'items' | 'isLoading' | 'onInputChange' | 'onOpenChange'
export interface AsyncAutocompleteProps<T extends Record<string, any>>
  extends Omit<AutocompleteProps<T>, OmittedProps> {
  url: string
  config?: ApiRequestConfig<ItemsResponse<T>> | ((search?: string) => ApiRequestConfig<ItemsResponse<T>>)
  transform?(data: ItemsResponse<T>): void
  filter?(item: T): boolean
}

export function AsyncAutocomplete<T extends Record<string, any>>({
  url,
  config = {},
  transform,
  filter,
  ...props
}: AsyncAutocompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const [state, scrollerRef] = useInfiniteScroll<T>({
    isEnabled: isOpen,
    async onLoadMore({ next }) {
      if (typeof config === 'function') config = config(search)

      const res = await api.get<ItemsResponse<T>>(next ?? url, config)

      if (!res.ok) throw res.data

      transform?.(res.data)

      return {
        items: filter ? res.data.results.filter(filter) : res.data.results,
        next: res.data.next
      }
    }
  })

  return (
    <Autocomplete
      scrollRef={scrollerRef}
      items={state.items}
      isLoading={state.isLoading}
      onInputChange={setSearch}
      onOpenChange={setIsOpen}
      {...props}
    />
  )
}
