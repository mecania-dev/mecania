import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { PaginationState } from '@/hooks/use-pagination'
import { api } from '@/http'
import { ScrollShadow, ScrollShadowProps, SlotsToClasses, Spinner, SpinnerProps, tv } from '@nextui-org/react'

interface AsyncScrollProps<T> extends Omit<ScrollShadowProps, 'children'> {
  children: React.ReactNode | ((items: T[], state: Omit<PaginationState<T>, 'items'>) => React.ReactNode)
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
    spinnerWrapper: 'flex w-full justify-center py-5'
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
  const [{ items, ...state }, scrollerRef] = useInfiniteScroll<T>({
    async onLoadMore({ next }) {
      const res = await api.get<ItemsResponse<T>>(next ?? url)
      if (!res.ok) throw res.data
      return {
        items: res.data.results,
        next: res.data.next
      }
    }
  })
  const classes = asyncScroll()

  loadingContent = loadingContent ?? (
    <div className={classes.spinnerWrapper({ class: classNames?.spinnerWrapper })}>
      <Spinner color="primary" className={classes.spinner({ class: classNames?.spinner })} {...spinnerProps} />
    </div>
  )

  return (
    <ScrollShadow ref={scrollerRef} className={classes.base({ class: classNames?.base })} {...props}>
      {typeof children === 'function' ? children(items, state) : children}
      {!state.error && state.isMounted && state.hasMore && loadingContent}
    </ScrollShadow>
  )
}
