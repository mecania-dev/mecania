import { forwardRef, useState } from 'react'

import { useIsLoading } from '@/hooks/use-is-loading'
import { CNPJApiResponse, getCNPJ } from '@/http'
import {
  FiscalIdentificationType,
  fiscalIdentificationMask,
  isValidFiscalIdentification
} from '@/lib/masks/fiscal-identification'
import { Spinner } from '@nextui-org/react'

import { Input, InputProps } from '.'

export type FiscalIdentificationInputProps = Omit<InputProps, 'type'> & {
  type?: FiscalIdentificationType
  onCNPJChange?(CNPJ?: CNPJApiResponse): void
  onCNPJNotFound?(CNPJ: string): void
}

export const FiscalIdentificationInput = forwardRef<HTMLInputElement, FiscalIdentificationInputProps>(
  function FiscalIdentificationInput(
    {
      type = 'CPF',
      placeholder = type === 'CPF' ? 'XXX.XXX.XXX-XX' : 'XX.XXX.XXX/XXXX-XX',
      endContent,
      mask = (value: string) => fiscalIdentificationMask(value, type),
      onValueChange,
      onCNPJChange,
      onCNPJNotFound,
      onChange,
      ...rest
    },
    ref
  ) {
    const [value, setValue] = useState('')
    const actualValue = rest.value ?? value
    const actualSetValue = onValueChange ?? setValue
    const [handleCNPJChange, isCNPJLoading] = useIsLoading(async (value: string) => {
      if (
        type === 'CNPJ' &&
        isValidFiscalIdentification(value, 'CNPJ', true) &&
        value !== actualValue &&
        onCNPJChange
      ) {
        const res = await getCNPJ(value)
        onCNPJChange(res.ok ? res.data : undefined)
        !res.ok && onCNPJNotFound?.(value)
      }
    })

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
      handleCNPJChange(e.target.value)
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
        endContent={isCNPJLoading ? <Spinner color="current" className="my-auto text-primary" size="sm" /> : endContent}
        {...rest}
      />
    )
  }
)
