import { forwardRef } from 'react'

import { tv } from '@nextui-org/react'

const flexWrap = tv({
  base: 'flex w-full flex-wrap gap-2 md:flex-nowrap'
})

export const FlexWrap = forwardRef<HTMLInputElement, React.ComponentProps<'div'>>(function FlexWrap(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={flexWrap({ className })} {...props} />
})
