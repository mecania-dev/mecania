import { IconType } from 'react-icons'
import { FaInbox } from 'react-icons/fa6'

import { SlotsToClasses, tv } from '@nextui-org/react'

interface EmptyHistoryProps {
  icon?: IconType
  title: string
  description: string
  className?: string
  classNames?: SlotsToClasses<keyof ReturnType<typeof emptyHistory>>
}

const emptyHistory = tv({
  slots: {
    base: [
      'mt-20 flex flex-col items-center text-center text-default-500',
      'opacity-100 transition-opacity duration-1000',
      'group-data-[routes=true]:opacity-0 group-data-[routes=true]:duration-100'
    ],
    icon: 'mb-3 h-12 w-12',
    title: 'text-small',
    description: 'text-xs text-default-400'
  }
})

export function EmptyHistory({ icon: Icon = FaInbox, title, description, className, classNames }: EmptyHistoryProps) {
  const classes = emptyHistory()

  return (
    <div className={classes.base({ class: [classNames?.base, className] })}>
      <Icon className={classes.icon({ class: classNames?.icon })} />
      <p className={classes.title({ class: classNames?.title })}>{title}</p>
      <p className={classes.description({ class: classNames?.description })}>{description}</p>
    </div>
  )
}
