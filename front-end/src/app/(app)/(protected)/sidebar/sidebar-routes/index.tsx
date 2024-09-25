import { useCallback, useMemo } from 'react'
import { BiSolidCar, BiSolidCarMechanic } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import { FaTools } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'

import { SidebarRoute, SidebarRouteProps } from '@/components/sidebar/sidebar-route'

import { useProtectedSidebar } from '..'

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
        { icon: CgProfile, href: '/profile', children: 'Meus dados', canProps: { I: 'update', a: 'User' } },
        {
          icon: FaLocationDot,
          href: '/profile/addresses',
          children: 'Endereços',
          canProps: { I: 'create', a: 'Address' }
        },
        { icon: BiSolidCar, href: '/profile/vehicles', children: 'Veículos', canProps: { I: 'create', a: 'Vehicle' } },
        {
          icon: BiSolidCarMechanic,
          href: '/profile/requests',
          children: 'Solicitações',
          onClick: onRequestsClick,
          canProps: {
            I: ['message_mechanic', 'message_user'],
            a: 'Chat'
          }
        },
        { icon: FaTools, href: '/services', children: 'Serviços', canProps: { I: 'create', a: 'Service' } },
        {
          icon: BiSolidCarMechanic,
          href: '/mechanics',
          children: 'Oficinas',
          canProps: {
            I: 'create',
            a: 'User'
          },
          subRoutes: [{ icon: BiSolidCarMechanic, href: '/mechanics/register', children: 'Cadastrar oficinas' }]
        }
      ] as SidebarRouteProps[],
    [onRequestsClick]
  )

  return (
    <div className="w-0 space-y-1 overflow-hidden transition-width group-data-[routes=true]:w-full">
      {routes.map(({ children, ...rest }, i) => (
        <SidebarRoute {...rest} key={i}>
          {children}
        </SidebarRoute>
      ))}
    </div>
  )
}
