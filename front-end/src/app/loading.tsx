'use client'

import { Spinner, tv } from '@nextui-org/react'

type LoadingProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
  isFixed?: boolean
}

const loading = tv({
  base: 'flex items-center justify-center',
  variants: {
    isFixed: {
      true: 'fixed inset-0 z-[9999] bg-foreground/50 dark:bg-foreground/20',
      false: 'grow'
    }
  }
})

export default function Loading({ className, isFixed = true, ...props }: LoadingProps) {
  return (
    <div className={loading({ isFixed, className })} {...props}>
      <Spinner classNames={{ wrapper: 'h-10 w-10' }} />
    </div>
  )
}
