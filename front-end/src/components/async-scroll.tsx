import { useState } from 'react'

import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { api } from '@/http'
import { ScrollShadow, ScrollShadowProps, SlotsToClasses, Spinner, SpinnerProps, tv } from '@nextui-org/react'
import { useAsyncList } from '@react-stately/data'

interface AsyncScrollProps<T> extends Omit<ScrollShadowProps, 'children'> {
  children: React.ReactNode | ((items: T[], isLoading: boolean) => React.ReactNode)
  url: string
  loadingContent?: React.ReactNode
  classNames?: SlotsToClasses<keyof ReturnType<typeof asyncScroll>>
  spinnerProps?: Omit<SpinnerProps, 'className'>
}

interface ItemsResponse<T> {
  results: T[]
  next: string | null
}

const asyncScroll = tv({
  slots: {
    base: '',
    spinner: '',
    spinnerWrapper: 'flex w-full justify-center'
  }
})

export function AsyncScroll<T>({
  children,
  url,
  loadingContent,
  classNames,
  spinnerProps,
  ...props
}: AsyncScrollProps<T>) {
  const {} = props
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const classes = asyncScroll()

  const list = useAsyncList<T>({
    async load({ signal, cursor }) {
      // If no cursor is available, then we're loading the first page.
      // Otherwise, the cursor is the next URL to load, as returned from the previous page.
      const res = await api.get<ItemsResponse<T>>(cursor || url, { signal })
      setHasMore(res.ok ? !!res.data.next : false)
      setIsLoading(false)

      return {
        items: res.ok ? res.data.results : [],
        cursor: res.ok ? res.data.next ?? undefined : undefined
      }
    }
  })

  const scrollerRef = useInfiniteScroll({ hasMore, onLoadMore: list.loadMore })

  loadingContent = loadingContent ?? (
    <div className={classes.spinnerWrapper({ class: classNames?.spinnerWrapper })}>
      <Spinner color="primary" className={classes.spinner({ class: classNames?.spinner })} {...spinnerProps} />
    </div>
  )

  return (
    <ScrollShadow ref={scrollerRef} className={classes.base({ class: classNames?.base })} {...props}>
      {typeof children === 'function' ? children(list.items, isLoading) : children}
      {hasMore && loadingContent}
    </ScrollShadow>
  )
}
