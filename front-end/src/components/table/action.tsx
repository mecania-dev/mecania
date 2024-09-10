import { ComponentPropsWithoutRef } from 'react'
import { IconType } from 'react-icons'

import { SlotsToClasses, Tooltip, TooltipProps, tv } from '@nextui-org/react'

interface TableActionProps extends ComponentPropsWithoutRef<'span'> {
  icon: IconType
  tooltip?: string
  classNames?: SlotsToClasses<keyof ReturnType<typeof tableAction>> & {
    tooltip?: TooltipProps['classNames']
  }
}

const tableAction = tv({
  slots: {
    base: 'cursor-pointer text-default-400 active:opacity-50',
    icon: ''
  }
})

export function TableAction({ icon: Icon, tooltip, classNames, className, ...props }: TableActionProps) {
  const { base, icon } = tableAction()

  return (
    <Tooltip classNames={classNames?.tooltip} content={tooltip} isDisabled={!tooltip}>
      <span className={base({ class: [classNames?.base, className] })} {...props}>
        <Icon className={icon({ class: classNames?.icon })} size={24} />
      </span>
    </Tooltip>
  )
}
