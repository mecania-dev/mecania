import { useEffect } from 'react'

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
  previous: string | null
}

const asyncScroll = tv({
  slots: {
    base: '',
    spinner: '',
    spinnerWrapper: 'flex w-full justify-center py-5'
  }
})

let lastParams: Record<string, any> = {}

function hasLastParamsChanged(params: Record<string, any> = {}) {
  return Object.entries(params).some(([key, value]) => lastParams[key] !== value)
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
  const classes = asyncScroll()
  const [{ items, ...state }, scrollerRef, reset] = useInfiniteScroll<T>({
    onStateChange,
    async onLoadMore({ next, signal }) {
      lastParams = config.params
      const newConfig = { ...config, signal }
      if (next) newConfig.params = {}

      const res = await api.get<ItemsResponse<T>>(next ?? url, newConfig)
      if (!res.ok) throw res.data

      return {
        items: res.data.results,
        next: res.data.next,
        previous: res.data.previous,
        last: res.request?.responseURL
      }
    }
  })

  useEffect(() => {
    if (hasLastParamsChanged(config.params)) {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.params])

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
