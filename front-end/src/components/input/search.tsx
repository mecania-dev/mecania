import { forwardRef } from 'react'
import { IoSearchOutline } from 'react-icons/io5'

import { Input, InputProps } from '.'

export const SearchInput = forwardRef<HTMLInputElement, InputProps>(function SearchInput(
  { type = 'text', placeholder = 'Buscar...', startContent, ...props },
  ref
) {
  return (
    <Input
      ref={ref}
      type={type}
      placeholder={placeholder}
      startContent={startContent || <IoSearchOutline className="shrink-0" size={18} />}
      {...props}
    />
  )
})
