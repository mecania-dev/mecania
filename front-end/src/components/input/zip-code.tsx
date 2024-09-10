import { forwardRef, useState } from 'react'

import { useIsLoading } from '@/hooks/use-is-loading'
import { api } from '@/lib/api'
import { CEPMask, isValidCEP } from '@/lib/masks/zip-code'
import { Spinner } from '@nextui-org/react'

import { Input, InputProps } from '.'

export type ZipCodeInputProps = Omit<InputProps, 'type'> & {
  onZipCodeChange?(address?: ZipCodeResponse): void
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
      const res = await api.get<ZipCodeResponse>(getZipCodeUrl(value))
      onZipCodeChange(res.ok ? res.data : undefined)
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

export interface ZipCodeResponse {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  service: string
  location: {
    type: string
    coordinates: {
      longitude: string
      latitude: string
    }
  }
}

export function getZipCodeUrl(zipCode: string) {
  return `https://brasilapi.com.br/api/cep/v2/${zipCode}`
}
