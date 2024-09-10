import { forwardRef } from 'react'

import { Button as NextUIButton, ButtonProps as NextUIButtonProps } from '@nextui-org/react'

export type ButtonProps = NextUIButtonProps

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { type = 'button', color = 'primary', ...rest },
  ref
) {
  return <NextUIButton ref={ref} type={type} color={color} {...rest} />
})
