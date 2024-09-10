'use client'

import { useMemo } from 'react'

import { useIsMounted } from '@/hooks/use-is-mounted'
import { search } from '@/lib/string'
import { Selection, SortDescriptor } from '@nextui-org/react'
import { create } from 'zustand'

import { IdField, TableProps } from './types'

interface TableContext<T extends IdField>
  extends Pick<
    TableProps<T>,
    'items' | 'columns' | 'initialVisibleColumns' | 'filterFields' | 'initialSortDescriptor'
  > {}

type TableStore = {
  page: number
  rowsPerPage: number
  columns: Selection
  searchValue: string
  sortDescriptor: SortDescriptor
  setPage(page: number): void
  setRowsPerPage(rowsPerPage: number): void
  setColumns(columns: Selection): void
  setSearchValue(search: string): void
  setSortDescriptor(descriptor: SortDescriptor): void
}

export const useTable = create<TableStore>()(set => ({
  page: 1,
  rowsPerPage: 10,
  columns: new Set([]) as Selection,
  searchValue: '',
  sortDescriptor: {} as SortDescriptor,
  setPage: page => set({ page }),
  setRowsPerPage: rowsPerPage => set({ rowsPerPage }),
  setColumns: columns => set({ columns }),
  setSearchValue: searchValue => set({ searchValue }),
  setSortDescriptor: descriptor => set({ sortDescriptor: descriptor })
}))

export function useTableContext<T extends IdField>({
  items,
  columns: initialColumns,
  initialVisibleColumns,
  filterFields,
  initialSortDescriptor
}: TableContext<T>) {
  const { page, rowsPerPage, columns, searchValue, sortDescriptor, setColumns, setSortDescriptor } = useTable()

  const isMounted = useIsMounted(() => {
    setColumns(new Set(initialVisibleColumns as any))
    setSortDescriptor(
      initialSortDescriptor || {
        column: 'id' in items ? 'id' : '_id' in items ? '_id' : String(initialVisibleColumns[0]),
        direction: 'ascending'
      }
    )
  })

  const filteredItems = useMemo(() => {
    let filtered = [...items]

    if (searchValue) {
      filtered = search(filtered, filterFields, searchValue)
    }

    return filtered
  }, [filterFields, searchValue, items])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const visibleItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = useMemo(() => {
    return [...visibleItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a]
      const second = b[sortDescriptor.column as keyof typeof b]
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, visibleItems])

  const headerColumns = useMemo(() => {
    if (columns === 'all') return initialColumns

    return initialColumns.filter(column => Array.from(columns).includes(column.uid as any))
  }, [initialColumns, columns])

  return { isMounted, pages, filteredItems, sortedItems, headerColumns }
}
