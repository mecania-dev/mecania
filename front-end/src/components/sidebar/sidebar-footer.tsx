import { forwardRef } from 'react'

import { tv } from '@nextui-org/react'

const sidebarFooter = tv({
  base: 'flex w-full p-2.5 pt-0 text-foreground'
})

export const SidebarFooter = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(function SidebarFooter(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={sidebarFooter({ className })} {...props} />
})
