import { forwardRef } from 'react'

import { tv } from '@nextui-org/react'

const sidebarHeader = tv({
  base: 'flex w-full p-2.5 pb-0 text-foreground'
})

export const SidebarHeader = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(function SidebarHeader(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={sidebarHeader({ className })} {...props} />
})
