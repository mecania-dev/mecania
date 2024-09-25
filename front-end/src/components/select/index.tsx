import { forwardRef } from 'react'

import {
  Select as NextUISelect,
  SelectProps as NextUISelectProps,
  SelectItem,
  SelectItemProps,
  SharedSelection
} from '@nextui-org/react'

export interface SelectProps<T extends Record<string, any>> extends Omit<NextUISelectProps, 'children' | 'items'> {
  items: T[]
  labelKey: keyof T
  valueKey: keyof T
  addNewLabel?: string
  addNewProps?: Omit<SelectItemProps, 'children' | 'aria-label' | 'value' | 'key' | 'onPress'>
  onAddNew?: () => void
}

export const Select = forwardRef(function Select<T extends Record<string, any>>(
  {
    items,
    labelKey,
    valueKey,
    isInvalid,
    onSelectionChange,
    addNewLabel,
    addNewProps = {},
    onAddNew,
    ...rest
  }: SelectProps<T>,
  ref: React.ForwardedRef<HTMLSelectElement>
) {
  const { classNames: addNewClasses, ...addNewRest } = addNewProps
  function handleOnSelectionChange(keys: SharedSelection) {
    if (keys.currentKey === 'add-new-option') return
    onSelectionChange?.(keys)
  }

  const selectItems = items.map(item => (
    <SelectItem aria-label={item[labelKey]} value={item[valueKey]} key={item[valueKey]}>
      {item[labelKey]}
    </SelectItem>
  ))

  return (
    <NextUISelect
      ref={ref}
      aria-label={typeof rest.label === 'string' ? rest.label : 'Select'}
      isInvalid={isInvalid ?? !!rest.errorMessage}
      onSelectionChange={handleOnSelectionChange}
      {...rest}
    >
      {onAddNew
        ? [
            <SelectItem
              aria-label="Add new"
              value="add-new-option"
              key="add-new-option"
              classNames={{
                ...addNewClasses,
                base: [
                  '!bg-primary/20 !text-primary data-[hover=true]:opacity-hover',
                  'transition-transform-colors-opacity data-[pressed=true]:scale-[0.99]',
                  addNewClasses?.base
                ],
                title: ['font-semibold', addNewClasses?.title]
              }}
              onPress={onAddNew}
              {...addNewRest}
            >
              {addNewLabel ?? 'Novo'}
            </SelectItem>,
            ...selectItems
          ]
        : selectItems}
    </NextUISelect>
  )
})
