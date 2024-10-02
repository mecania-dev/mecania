import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { PaginationState, UsePaginationProps } from '@/hooks/use-pagination'
import { api, ApiRequestConfig } from '@/http'
import { ScrollShadow, ScrollShadowProps, SlotsToClasses, Spinner, SpinnerProps, tv } from '@nextui-org/react'

interface AsyncScrollProps<T> extends Omit<ScrollShadowProps, 'children'> {
  children: React.ReactNode | ((items: T[], state: Omit<PaginationState<T>, 'items'>) => React.ReactNode)
  url: string
  loadingContent?: React.ReactNode
  classNames?: SlotsToClasses<keyof ReturnType<typeof asyncScroll>>
  spinnerProps?: Omit<SpinnerProps, 'className'>
  config?: ApiRequestConfig<ItemsResponse<T>>
  onStateChange?: UsePaginationProps<T>['onStateChange']
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

function updateUrl(url: string, newParams: Record<string, any> = {}): string {
  const urlObj = new URL(url, 'http://temp.base.url')
  const existingParams = new URLSearchParams(urlObj.search)

  for (const [key, value] of Object.entries(newParams)) {
    existingParams.set(key, value)
  }

  urlObj.search = existingParams.toString()
  return `${urlObj.pathname.replace('api/', '')}${urlObj.search ?? ''}`
}

export function AsyncScroll<T>({
  children,
  url,
  loadingContent,
  classNames,
  spinnerProps,
  config = {},
  onStateChange,
  ...props
}: AsyncScrollProps<T>) {
  const { params, ...restConfig } = config
  const [{ items, ...state }, scrollerRef] = useInfiniteScroll<T>({
    onStateChange,
    async onLoadMore({ next }) {
      const res = await api.get<ItemsResponse<T>>(updateUrl(next ?? url, params), restConfig)
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
      {state.isMounted && state.isLoading && state.hasMore && loadingContent}
    </ScrollShadow>
  )
}
