import {
  TableProps as NextUITableProps,
  Selection,
  SortDescriptor,
  TableBodyProps,
  TableHeaderProps
} from '@nextui-org/react'

import { TableColumnSelector } from './column-selector'
import { TableSearch } from './search'

export type IdField = { id: string | number } | { _id: string | number }

export interface TableHeaderColumn<T extends IdField> {
  name: string
  uid: keyof T | 'actions'
  sortable?: boolean
}

export type TableTopContent<T extends IdField> = (
  props: {
    TableSearch: typeof TableSearch
    TableColumnSelector: typeof TableColumnSelector
  } & Pick<TableProps<T>, 'items' | 'columns' | 'filterFields' | 'selectedKeys' | 'selectionMode'>
) => React.ReactNode

export interface TableProps<T extends IdField>
  extends Omit<
    NextUITableProps,
    | 'children'
    | 'sortDescriptor'
    | 'topContent'
    | 'topContentPlacement'
    | 'bottomContent'
    | 'bottomContentPlacement'
    | 'onSortChange'
    | 'onCellAction'
  > {
  items: T[]
  columns: TableHeaderColumn<T>[]
  filterFields: (keyof T)[]
  renderCell(item: T, columnKey: keyof T | 'actions'): React.ReactNode
  initialVisibleColumns: (keyof T | 'actions')[]
  initialSortDescriptor?: SortDescriptor
  selectedKeys: Selection
  onSelectionChange(keys: Selection): any
  onCellAction?(key: string, cell: string): void
  topContent?: TableTopContent<T>
  headerProps?: Omit<TableHeaderProps<T>, 'children' | 'columns'>
  bodyProps?: Omit<TableBodyProps<T>, 'children' | 'items'>
}
