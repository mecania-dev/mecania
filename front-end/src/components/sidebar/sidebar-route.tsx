'use client'

import { forwardRef, useEffect, useState } from 'react'
import { IconType } from 'react-icons'
import { FaChevronRight } from 'react-icons/fa6'

import { Can, I, Do } from '@/auth/client'
import { Button, ButtonProps } from '@/components/button'
import { SlotsToClasses } from '@nextui-org/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Collapse } from '../collapse'
import { SidebarRouteSlots, sidebarRoute } from './variants'

type BaseSidebarRouteProps = Omit<ButtonProps, 'ref'> & {
  icon?: IconType
  activeVariant?: ButtonProps['variant']
  classNames?: SlotsToClasses<SidebarRouteSlots>
  canProps?: {
    I: I
    a: Do
  }
}

export type SidebarRouteProps = BaseSidebarRouteProps & {
  subRoutes?: BaseSidebarRouteProps[]
  isSubRoute?: boolean
}

function getIsActive(pathname: string, href?: string, subRoutes?: BaseSidebarRouteProps[]) {
  return pathname === href || !!(subRoutes && subRoutes.some(route => pathname === route.href))
}

export const SidebarRoute = forwardRef<HTMLButtonElement, SidebarRouteProps>(function EventsSidebarRoute(
  {
    icon: Icon,
    isSubRoute = false,
    size = isSubRoute ? 'sm' : 'md',
    variant = 'light',
    activeVariant = 'flat',
    children,
    classNames,
    className,
    subRoutes,
    canProps = {},
    ...props
  },
  ref
) {
  const pathname = usePathname()
  const classes = sidebarRoute({ isSubRoute })
  const isActive = getIsActive(pathname, props.href, subRoutes)
  const [isOpen, setIsOpen] = useState(isActive)

  useEffect(() => {
    setIsOpen(isActive)
  }, [isActive, pathname])

  function toggleOpen(e: React.MouseEvent<SVGElement, MouseEvent>) {
    e.stopPropagation()
    e.preventDefault()
    setIsOpen(prev => !prev)
  }

  return (
    <Can {...(canProps as any)}>
      <Button
        ref={ref}
        as={Link}
        data-active={isActive}
        data-subroute-open={isOpen}
        size={size}
        variant={isActive ? activeVariant : variant}
        startContent={
          subRoutes ? (
            <FaChevronRight
              className="shrink-0 transition-transform group-data-[open=false]:hidden group-data-[subroute-open=true]:rotate-90"
              onClick={toggleOpen}
            />
          ) : undefined
        }
        className={classes.base({
          class: [classNames?.base, className]
        })}
        {...props}
      >
        {Icon && <Icon className={classes.icon({ class: classNames?.icon })} />}
        <p className={classes.text({ class: classNames?.text })}>{children}</p>
      </Button>
      {subRoutes && (
        <Collapse isOpen={isOpen} className="space-y-1 px-1 group-data-[open=false]:hidden">
          {subRoutes.map((route, i) => (
            <SidebarRoute key={i} {...route} isSubRoute />
          ))}
        </Collapse>
      )}
    </Can>
  )
})
