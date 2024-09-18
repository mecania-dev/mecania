import { forwardRef, useState } from 'react'

import { useIsLoading } from '@/hooks/use-is-loading'
import { getZipCode, ZipCodeResponse } from '@/http'
import { CEPMask, isValidCEP } from '@/lib/masks/zip-code'
import { Spinner } from '@nextui-org/react'

import { Input, InputProps } from '.'

export type ZipCodeInputProps = Omit<InputProps, 'type'> & {
  onZipCodeChange?(address?: ZipCodeResponse, zipCode?: string): void
}

export const ZipCodeInput = forwardRef<HTMLInputElement, ZipCodeInputProps>(function ZipCodeInput(
  { placeholder = '00000-000', mask = CEPMask, onValueChange, onZipCodeChange, onChange, endContent, ...rest },
  ref
) {
  const [value, setValue] = useState('')
  const actualValue = rest.value ?? value
  const actualSetValue = onValueChange ?? setValue
  const [handleAddressChange, isAddressLoading] = useIsLoading(async (value: string) => {
    if (isValidCEP(value) && value !== actualValue && onZipCodeChange) {
      const res = await getZipCode(value)
      onZipCodeChange(res.ok ? res.data : undefined, res.ok ? value : undefined)
    }
  })

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleAddressChange(e.target.value)
    onChange?.(e)
  }

  return (
    <Input
      ref={ref}
      type="text"
      value={actualValue}
      placeholder={placeholder}
      mask={mask}
      onValueChange={actualSetValue}
      onChange={handleOnChange}
      endContent={
        isAddressLoading ? <Spinner color="current" className="my-auto text-primary" size="sm" /> : endContent
      }
      {...rest}
    />
  )
})
