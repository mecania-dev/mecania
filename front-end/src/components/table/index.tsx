'use client'

import { useCallback, useMemo } from 'react'

import {
  Table as NextUITable,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  TableHeader,
  TableColumn
} from '@nextui-org/react'

import { TableColumnSelector } from './column-selector'
import { useTable, useTableContext } from './context'
import { TableSearch } from './search'
import { IdField, TableHeaderColumn, TableProps } from './types'

export function Table<T extends IdField>({
  items,
  columns,
  filterFields,
  renderCell,
  initialVisibleColumns,
  initialSortDescriptor,
  selectedKeys,
  selectionMode = 'multiple',
  isHeaderSticky = true,
  onSelectionChange,
  onCellAction,
  topContent,
  headerProps = {},
  bodyProps = {},
  ...rest
}: TableProps<T>) {
  const { emptyContent = 'No items found', ...restBodyProps } = bodyProps
  const { page, setPage, sortDescriptor, setSortDescriptor } = useTable()
  const { isMounted, pages, sortedItems, headerColumns } = useTableContext({
    items,
    columns,
    initialVisibleColumns,
    filterFields,
    initialSortDescriptor
  })

  const handleCellAction = useCallback(
    (key: string | number | bigint) => {
      const [value, cell] = splitKey(key, columns)
      onCellAction?.(value, cell)
    },
    [columns, onCellAction]
  )

  const bottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-center px-2 py-2">
        <Pagination isCompact showControls showShadow color={rest.color} page={page} total={pages} onChange={setPage} />
      </div>
    )
  }, [page, pages, rest.color, setPage])

  if (!isMounted) return null
  return (
    <NextUITable
      selectedKeys={selectedKeys}
      selectionMode={selectionMode}
      topContent={topContent?.({
        items,
        columns,
        filterFields,
        selectedKeys,
        selectionMode,
        TableSearch,
        TableColumnSelector
      })}
      topContentPlacement="outside"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      sortDescriptor={sortDescriptor}
      onSelectionChange={onSelectionChange}
      onSortChange={setSortDescriptor}
      onCellAction={handleCellAction}
      isHeaderSticky={isHeaderSticky}
      {...rest}
    >
      <TableHeader columns={headerColumns} {...headerProps}>
        {column => {
          return (
            <TableColumn
              key={column.uid as any}
              align={column.uid === 'actions' ? 'center' : 'start'}
              className={column.uid === 'actions' ? 'text-center' : ''}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )
        }}
      </TableHeader>
      <TableBody emptyContent={emptyContent} items={sortedItems} {...restBodyProps}>
        {item => (
          <TableRow key={'id' in item ? item.id : item._id}>
            {columnKey => <TableCell>{renderCell(item, columnKey as keyof T)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </NextUITable>
  )
}

function splitKey<T extends IdField>(key: string | number | bigint, columns: TableHeaderColumn<T>[]): [string, string] {
  key = String(key)
  for (const column of columns) {
    const uid = column.uid.toString()
    if (key.endsWith(uid)) {
      return [key.slice(0, -(uid.length + (key.length - uid.length) / 2)), uid]
    }
  }
  return [key, '']
}
