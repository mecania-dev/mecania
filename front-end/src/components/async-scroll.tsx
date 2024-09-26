import { useInfiniteScroll, LoadMoreProps, InfiniteScrollState } from '@/hooks/use-infinite-scroll'
import { api } from '@/http'
import { ScrollShadow, ScrollShadowProps, SlotsToClasses, Spinner, SpinnerProps, tv } from '@nextui-org/react'

interface AsyncScrollProps<T> extends Omit<ScrollShadowProps, 'children'> {
  children: React.ReactNode | ((items: T[], state: Omit<InfiniteScrollState<T>, 'items'>) => React.ReactNode)
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
  const {} = props
  const classes = asyncScroll()

  async function onLoadMore({ next }: LoadMoreProps<T>): Promise<LoadMoreProps<T>> {
    const res = await api.get<ItemsResponse<T>>(next ?? url)
    if (!res.ok) return { items: [], next: next ?? url }

    return {
      items: res.data.results,
      next: res.data.next
    }
  }

  const [state, scrollerRef] = useInfiniteScroll({ onLoadMore })
  const { items, ...stateRest } = state

  loadingContent = loadingContent ?? (
    <div className={classes.spinnerWrapper({ class: classNames?.spinnerWrapper })}>
      <Spinner color="primary" className={classes.spinner({ class: classNames?.spinner })} {...spinnerProps} />
    </div>
  )

  return (
    <ScrollShadow ref={scrollerRef} className={classes.base({ class: classNames?.base })} {...props}>
      {typeof children === 'function' ? children(items, stateRest) : children}
      {state.hasMore && loadingContent}
    </ScrollShadow>
  )
}
