'use client'

import { useLayoutEffect } from 'react'

import Loading from '@/app/loading'
import { useRouter } from 'next/navigation'

interface RedirectProps {
  url?: string
}

export function Redirect({ url }: RedirectProps) {
  const { push } = useRouter()

  useLayoutEffect(() => {
    if (url != null) push(url)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  return <Loading />
}
