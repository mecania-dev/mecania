import { forwardRef, useState } from 'react'

import { Input as NextUIInput, InputProps as NextUIInputProps } from '@nextui-org/react'

export type InputProps = NextUIInputProps & {
  mask?(value?: string): string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { mask, isInvalid, onValueChange, onChange, ...rest },
  ref
) {
  const [value, setValue] = useState('')
  const actualValue = rest.value ?? value
  const actualSetValue = onValueChange ?? setValue

  function handleValueChange(value: string) {
    if (mask) value = mask(value)
    actualSetValue(value)
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (mask) e.target.value = mask(e.target.value)
    onChange?.(e)
  }

  return (
    <NextUIInput
      ref={ref}
      value={actualValue}
      isInvalid={isInvalid ?? !!rest.errorMessage}
      onValueChange={handleValueChange}
      onChange={handleOnChange}
      {...rest}
    />
  )
})
