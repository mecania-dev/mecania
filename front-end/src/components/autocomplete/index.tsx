import { forwardRef } from 'react'

import {
  Autocomplete as NextUIAutocomplete,
  AutocompleteProps as NextUIAutocompleteProps,
  AutocompleteItem
} from '@nextui-org/react'

export interface AutocompleteProps<T extends Record<string, any>>
  extends Omit<NextUIAutocompleteProps, 'children' | 'items'> {
  items: T[]
  labelKey: keyof T
  valueKey: keyof T
}

export const Autocomplete = forwardRef(function Autocomplete<T extends Record<string, any>>(
  { items, labelKey, valueKey, isInvalid, ...rest }: AutocompleteProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <NextUIAutocomplete
      ref={ref}
      aria-label={typeof rest.label === 'string' ? rest.label : 'Autocomplete'}
      isInvalid={isInvalid ?? !!rest.errorMessage}
      {...rest}
    >
      {items.map(item => (
        <AutocompleteItem aria-label={item[labelKey]} value={item[valueKey]} key={item[valueKey]}>
          {item[labelKey]}
        </AutocompleteItem>
      ))}
    </NextUIAutocomplete>
  )
})
