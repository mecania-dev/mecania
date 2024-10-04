import { forwardRef } from 'react'

import { SlotsToClasses, tv } from '@nextui-org/react'

import { Button, ButtonProps } from './button'

export interface SelectableButtonProps extends Omit<ButtonProps, 'ref'> {
  isSelected?: boolean
  classNames?: SlotsToClasses<keyof ReturnType<typeof selectableButton>>
}

const selectableButton = tv({
  slots: {
    base: 'group relative overflow-hidden bg-transparent p-0 data-[selected=true]:p-1',
    borderWrapper:
      'absolute -inset-x-1 top-1/2 -z-[2] aspect-square -translate-y-1/2 group-data-[selected=false]:hidden',
    border: 'h-full w-full animate-[spin_4s_linear_infinite] bg-gradient-to-r from-danger via-secondary to-info',
    content:
      '-z-[1] flex h-full w-full items-center justify-center bg-primary px-4 font-semibold group-data-[selected=true]:rounded-[8px] group-data-[selected=true]:px-3'
  }
})

export const SelectableButton = forwardRef<HTMLButtonElement, SelectableButtonProps>(function SelectableButton(
  { children, isSelected, classNames, className, ...rest },
  ref
) {
  const classes = selectableButton()

  return (
    <Button
      ref={ref}
      data-selected={isSelected}
      className={classes.base({ class: [classNames?.base, className] })}
      {...rest}
    >
      <div className={classes.borderWrapper({ class: classNames?.borderWrapper })}>
        <div className={classes.border({ class: classNames?.border })}></div>
      </div>
      <div className={classes.content({ class: classNames?.content })}>{children}</div>
    </Button>
  )
})
