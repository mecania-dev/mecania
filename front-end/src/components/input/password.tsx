import { forwardRef, useState } from 'react'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'

import { Input, InputProps } from '.'

type PasswordType = 'password' | 'text'

export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(function PasswordInput(
  { placeholder = '********', endContent, ...rest },
  ref
) {
  const [inputPasswordType, setInputPasswordType] = useState<PasswordType>('password')

  function togglePasswordType() {
    setInputPasswordType(inputPasswordType === 'password' ? 'text' : 'password')
  }

  const EyeIcon = inputPasswordType === 'password' ? BsEyeSlashFill : BsEyeFill

  return (
    <Input
      ref={ref}
      type={inputPasswordType}
      placeholder={placeholder}
      endContent={
        endContent || (
          <EyeIcon className="h-full w-5 shrink-0 cursor-pointer text-gray-400" onClick={togglePasswordType} />
        )
      }
      {...rest}
    />
  )
})
