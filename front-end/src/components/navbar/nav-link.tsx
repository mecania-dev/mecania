import { IconType } from 'react-icons'

import { NavbarItem, NavbarMenuItem, SlotsToClasses, tv, useNavbarContext } from '@nextui-org/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  icon?: IconType
  isMenu?: boolean
  classNames?: SlotsToClasses<keyof ReturnType<typeof navLink>>
}

const navLink = tv({
  slots: {
    base: '',
    link: '',
    icon: 'text-default-600 dark:text-default-500'
  },
  variants: {
    color: {
      primary: { link: 'text-primary' },
      foreground: { link: 'text-foreground' }
    },
    isIcon: {
      true: { base: 'flex h-full items-center' }
    }
  }
})

export function NavLink({
  children,
  href,
  icon: Icon,
  isMenu,
  onClick,
  classNames,
  className,
  ...props
}: NavLinkProps) {
  const { setIsMenuOpen } = useNavbarContext()
  const pathname = usePathname()
  const Item = isMenu ? NavbarMenuItem : NavbarItem
  const isActive = pathname === href
  const isIcon = !!Icon
  const { base, link, icon } = navLink({ isIcon })

  function handleClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    onClick?.(e)
    !isIcon && setIsMenuOpen(false)
  }

  return (
    <Item className={base({ class: classNames?.base })} isActive={isActive}>
      <Link
        href={href}
        className={link({ color: isActive ? 'primary' : 'foreground', class: [classNames?.link, className] })}
        onClick={handleClick}
        target={isIcon ? '_blank' : undefined}
        {...props}
      >
        {isIcon ? <Icon size={24} className={icon({ class: classNames?.icon })} /> : children}
      </Link>
    </Item>
  )
}
