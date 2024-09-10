import { ComponentPropsWithoutRef } from 'react'
import { IoChevronDown } from 'react-icons/io5'

import { capitalize } from '@/lib/string'
import {
  Dropdown,
  DropdownItem,
  DropdownItemProps,
  DropdownMenu,
  DropdownMenuProps,
  DropdownProps,
  DropdownTrigger,
  tv
} from '@nextui-org/react'

import { Button, ButtonProps } from '../button'
import { useTable } from './context'
import { IdField, TableProps } from './types'

interface TableColumnSelectorProps<T extends IdField>
  extends Pick<TableProps<T>, 'columns'>,
    Omit<DropdownProps, 'children'> {
  triggerProps?: Omit<ComponentPropsWithoutRef<typeof DropdownTrigger>, 'children'>
  buttonProps?: Omit<ButtonProps, 'ref'>
  menuProps?: Omit<DropdownMenuProps, 'children' | 'selectedKeys' | 'onSelectionChange'>
  itemProps?: Omit<DropdownItemProps, 'children' | 'key'>
}

const tableCloumnSelector = tv({
  slots: {
    trigger: 'flex',
    item: 'capitalize'
  }
})

export function TableColumnSelector<T extends IdField>({
  columns: initialColumns,
  triggerProps = {},
  buttonProps = {},
  menuProps = {},
  itemProps = {},
  ...props
}: TableColumnSelectorProps<T>) {
  const { columns, setColumns } = useTable()
  const { className: triggerClassName, ...restTriggerProps } = triggerProps
  const { children: buttonChildren, color = 'default', variant = 'flat', endContent, ...restButtonProps } = buttonProps
  const {
    selectionMode = 'multiple',
    closeOnSelect = false,
    disallowEmptySelection = true,
    ...restMenuProps
  } = menuProps
  const { className: itemClassName, ...restItemProps } = itemProps
  const { trigger, item } = tableCloumnSelector()

  return (
    <Dropdown {...props}>
      <DropdownTrigger className={trigger({ class: triggerClassName })} {...restTriggerProps}>
        <Button
          color={color}
          variant={variant}
          endContent={endContent || <IoChevronDown className="text-small" />}
          {...restButtonProps}
        >
          {buttonChildren || 'Colunas'}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        selectionMode={selectionMode}
        selectedKeys={columns}
        onSelectionChange={setColumns}
        closeOnSelect={closeOnSelect}
        disallowEmptySelection={disallowEmptySelection}
        {...restMenuProps}
      >
        {initialColumns.map(column => (
          <DropdownItem key={column.uid as any} className={item({ class: itemClassName })} {...restItemProps}>
            {capitalize(column.name)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
