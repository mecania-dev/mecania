import { useCallback, useMemo } from 'react'
import { IconType } from 'react-icons'
import { BiSolidCar, BiSolidCarMechanic } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import { FaLocationDot } from 'react-icons/fa6'

import { SidebarRoute } from '@/components/sidebar/sidebar-route'
import { Can, CanProps } from '@/providers/ability-provider'

import { useProtectedSidebar } from '..'

type RouteProps = CanProps & {
  icon: IconType
  href: string
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export function SidebarRoutes() {
  const { setIsRequestsOpen } = useProtectedSidebar()

  const onRequestsClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault()
      setIsRequestsOpen(true)
    },
    [setIsRequestsOpen]
  )

  const routes = useMemo(
    () =>
      [
        { icon: CgProfile, href: '/profile', children: 'Meus dados' },
        { icon: FaLocationDot, href: '/profile/addresses', children: 'Endereços' },
        { icon: BiSolidCar, href: '/profile/vehicles', children: 'Veículos', I: 'create', a: 'Vehicle' },
        {
          icon: BiSolidCarMechanic,
          href: '/profile/mechanics',
          children: 'Solicitações',
          onClick: onRequestsClick
        }
      ] as RouteProps[],
    [onRequestsClick]
  )

  return (
    <div className="w-0 space-y-1 overflow-hidden transition-width group-data-[routes=true]:w-full">
      {routes.map(({ children, icon, href, onClick, ...canProps }, i) => (
        <Can key={i} {...canProps}>
          <SidebarRoute icon={icon} href={href} onClick={onClick}>
            {children}
          </SidebarRoute>
        </Can>
      ))}
    </div>
  )
}
