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

function hasLastParamsChanged(last?: string | null, params: Record<string, any> = {}) {
  if (!last) return false
  const urlObj = new URL(last)
  let paramsChanged = false

  for (const [key, value] of Object.entries(params)) {
    if (urlObj.searchParams.get(key) !== value) {
      // If any parameter value has changed, set the flag to true
      paramsChanged = true
      break
    }
  }

  return paramsChanged
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
  const [{ items, ...state }, scrollerRef, reset] = useInfiniteScroll<T>({
    onStateChange,
    async onLoadMore({ next, last }) {
      const paramsChanged = hasLastParamsChanged(last, config.params)
      if (!paramsChanged && next) config.params = {}

      const res = await api.get<ItemsResponse<T>>(paramsChanged || !next ? url : next, config)
      if (!res.ok) throw res.data

      return {
        items: res.data.results,
        next: res.data.next,
        previous: res.data.previous,
        last: res.request?.responseURL,
        reset: paramsChanged
      }
    }
  })
  const classes = asyncScroll()

  useEffect(() => {
    if (!state.isMounted || state.isLoading) return

    if (hasLastParamsChanged(state.last, config.params)) {
      reset({ last: state.last })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.last, config.params])

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
