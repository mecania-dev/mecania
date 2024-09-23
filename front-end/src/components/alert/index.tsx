import { forwardRef } from 'react'
import { FaCheckCircle, FaExclamation, FaInfoCircle, FaTimes } from 'react-icons/fa'
import { MdError } from 'react-icons/md'

import { ComponentPropsWithoutRef } from '@/types/utils'
import { SlotsToClasses } from '@nextui-org/react'

import { Collapse } from '../collapse'
import { AlertSlots, AlertVariantProps, alert } from './variants'

export interface AlertProps extends ComponentPropsWithoutRef<typeof Collapse, AlertVariantProps, 'isOpen'> {
  title?: string
  message?: string
  classNames?: SlotsToClasses<AlertSlots>
  onClose?(): void
}

const iconMap = {
  success: FaCheckCircle,
  error: MdError,
  alert: FaExclamation,
  info: FaInfoCircle
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { title, message, type = 'info', className, classNames, onClose, ...rest },
  ref
) {
  const classes = alert({ type })

  const Icon = iconMap[type]

  return (
    <Collapse ref={ref} isOpen={!!message} className={classes.collapse({ class: classNames?.collapse })} {...rest}>
      <div className={classes.base({ class: [classNames?.base, className, title && 'py-2'] })}>
        <Icon size={20} className={classes.icon({ class: classNames?.icon })} />
        <div className={classes.messageWrapper({ class: classNames?.messageWrapper })}>
          {title && <p className={classes.title({ class: classNames?.title })}>{title}</p>}
          <p className={classes.message({ class: [classNames?.message, title && 'text-small'] })}>{message}</p>
        </div>
        {onClose && <FaTimes className={classes.close({ class: classNames?.close })} onClick={onClose} />}
      </div>
    </Collapse>
  )
})
