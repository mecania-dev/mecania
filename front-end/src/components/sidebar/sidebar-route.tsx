'use client'

import { forwardRef } from 'react'
import { IconType } from 'react-icons'

import { Button, ButtonProps } from '@/components/button'
import { SlotsToClasses } from '@nextui-org/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { SidebarRouteSlots, sidebarRoute } from './variants'

interface SidebarRouteProps extends ButtonProps {
  icon?: IconType
  activeVariant?: ButtonProps['variant']
  classNames?: SlotsToClasses<SidebarRouteSlots>
}

export const SidebarRoute = forwardRef<HTMLButtonElement, SidebarRouteProps>(function EventsSidebarRoute(
  { icon: Icon, variant = 'light', activeVariant = 'flat', children, classNames, className, ...props },
  ref
) {
  const pathname = usePathname()
  const classes = sidebarRoute()

  return (
    <Button
      ref={ref as any}
      as={Link}
      data-active={pathname === props.href}
      variant={pathname === props.href ? activeVariant : variant}
      className={classes.base({
        class: [classNames?.base, className]
      })}
      {...props}
    >
      {Icon && <Icon className={classes.icon({ class: classNames?.icon })} />}
      <p className={classes.text({ class: classNames?.text })}>{children}</p>
    </Button>
  )
})
