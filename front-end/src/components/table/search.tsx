import { useCallback } from 'react'

import { InputProps } from '../input'
import { SearchInput } from '../input/search'
import { useTable } from './context'
import { IdField, TableProps } from './types'

type TableSearchProps<T extends IdField> = Omit<InputProps, 'value' | 'onValueChange' | 'onClear'> & {
  filterFields?: TableProps<T>['filterFields']
  columns?: TableProps<T>['columns']
}

function formatPlaceholder(fields: (string | number | symbol)[]): string {
  if (fields.length > 1) {
    return `${fields.slice(0, -1).join(', ')} ou ${String(fields[fields.length - 1])}`
  }
  return String(fields[0])
}

export function TableSearch<T extends IdField>({
  filterFields,
  columns,
  placeholder,
  classNames,
  ...props
}: TableSearchProps<T>) {
  const { searchValue, setSearchValue, setPage } = useTable()

  const onSearchChange = useCallback(
    (value: string) => {
      if (value) {
        setSearchValue(value)
        setPage(1)
      } else {
        setSearchValue('')
      }
    },
    [setPage, setSearchValue]
  )

  const onClear = useCallback(() => {
    setSearchValue('')
    setPage(1)
  }, [setPage, setSearchValue])

  return (
    <SearchInput
      value={searchValue}
      placeholder={
        placeholder ||
        (filterFields && columns
          ? `Procure por ${formatPlaceholder(
              columns.filter(c => filterFields.some(f => f === c.uid)).map(c => c.name.toLowerCase())
            )}`
          : filterFields
            ? `Procure por ${formatPlaceholder(filterFields)}`
            : undefined)
      }
      classNames={{
        ...classNames,
        base: ['w-full sm:max-w-[44%]', classNames?.base]
      }}
      onValueChange={onSearchChange}
      onClear={onClear}
      {...props}
    />
  )
}
