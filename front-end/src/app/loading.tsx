'use client'

import { Spinner } from '@nextui-org/react'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-foreground/50 dark:bg-foreground/20">
      <Spinner classNames={{ wrapper: 'h-10 w-10' }} />
    </div>
  )
}
