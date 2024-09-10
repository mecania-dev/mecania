import { forwardRef } from 'react'

import { Select as NextUISelect, SelectProps as NextUISelectProps, SelectItem } from '@nextui-org/react'

export interface SelectProps<T extends Record<string, any>> extends Omit<NextUISelectProps, 'children' | 'items'> {
  items: T[]
  labelKey: keyof T
  valueKey: keyof T
}

export const Select = forwardRef(function Select<T extends Record<string, any>>(
  { items, labelKey, valueKey, isInvalid, ...rest }: SelectProps<T>,
  ref: React.ForwardedRef<HTMLSelectElement>
) {
  return (
    <NextUISelect
      ref={ref}
      aria-label={typeof rest.label === 'string' ? rest.label : 'Select'}
      isInvalid={isInvalid ?? !!rest.errorMessage}
      {...rest}
    >
      {items.map(item => (
        <SelectItem aria-label={item[labelKey]} value={item[valueKey]} key={item[valueKey]}>
          {item[labelKey]}
        </SelectItem>
      ))}
    </NextUISelect>
  )
})
