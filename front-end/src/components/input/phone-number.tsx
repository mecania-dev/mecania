import { forwardRef } from 'react'

import { phoneNumberMask } from '@/lib/masks/phone-number'

import { Input, InputProps } from '.'

export type PhoneNumberInputProps = Omit<InputProps, 'type'>

export const PhoneNumberInput = forwardRef<HTMLInputElement, PhoneNumberInputProps>(function PhoneNumberInput(
  { placeholder = '(99) 99999-9999', mask = phoneNumberMask, ...rest },
  ref
) {
  return <Input ref={ref} type="text" placeholder={placeholder} mask={mask} {...rest} />
})
