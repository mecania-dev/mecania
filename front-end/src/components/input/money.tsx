'use client'

import { forwardRef } from 'react'

import { Input, InputProps } from '.'

export type MoneyInputProps = Omit<InputProps, 'type' | 'startContent'>

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(function MoneyInput(
  { placeholder = '0.00', ...rest },
  ref
) {
  return (
    <Input
      ref={ref}
      type="number"
      placeholder={placeholder}
      startContent={
        <div className="pointer-events-none flex items-center">
          <span className="text-small text-default-400">$</span>
        </div>
      }
      {...rest}
    />
  )
})
