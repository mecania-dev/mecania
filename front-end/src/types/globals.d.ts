import type * as React from 'react'

declare module 'react' {
  // Extend the original forwardRef function signature
  export function forwardRef<T, P = any>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode | null
  ): (props: React.PropsWithChildren<P> & React.RefAttributes<T>) => React.ReactNode | null
}
