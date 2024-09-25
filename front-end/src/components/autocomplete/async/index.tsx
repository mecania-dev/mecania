import { useState } from 'react'

import { Autocomplete, AutocompleteProps } from '@/components/autocomplete'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'

import { useAsyncAutocompleteList, UseAsyncAutocompleteListProps } from './use-async-autocomplete-list'

export type AsyncAutocompleteProps<T extends Record<string, any>> = Omit<
  AutocompleteProps<T>,
  'scrollRef' | 'items' | 'isLoading' | 'onInputChange' | 'onOpenChange'
> &
  UseAsyncAutocompleteListProps<T>

export function AsyncAutocomplete<T extends Record<string, any>>({
  id,
  url,
  config,
  limit,
  transform,
  filter,
  ...props
}: AsyncAutocompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { items, hasMore, isLoading, onLoadMore } = useAsyncAutocompleteList({
    id,
    url,
    config,
    search,
    limit,
    transform,
    filter
  })

  const scrollerRef = useInfiniteScroll({
    hasMore,
    isEnabled: isOpen,
    onLoadMore
  })

  return (
    <Autocomplete
      scrollRef={scrollerRef}
      items={items}
      isLoading={isLoading}
      onInputChange={setSearch}
      onOpenChange={setIsOpen}
      {...props}
    />
  )
}
