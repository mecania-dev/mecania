'use client'

import { useState } from 'react'

import { Button } from '@/components/button'
import { Mecania } from '@/components/icons/mecania'
import { ThemeSwitch } from '@/components/theme-switch'
import { useUser } from '@/providers/user-provider'
import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import Link from 'next/link'

import { NavLink } from './nav-link'
import { ProfilePopover } from './profile-popover'

export function Navbar() {
  const { isAuthenticated } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [{ label: 'Início', href: '/' }]

  return (
    <NextUINavbar className="bg-background/60 text-foreground" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarBrand className="h-full space-x-2">
        <Link href="/" className="flex h-full items-center justify-center gap-2">
          <Mecania className="h-2/5 w-auto" />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {menuItems.map((item, index) => (
          <NavLink href={item.href} key={`${item.label}-${index}`}>
            {item.label}
          </NavLink>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="flex h-full items-center gap-4">
          <ThemeSwitch />
          {isAuthenticated ? (
            <>
              <ProfilePopover />
            </>
          ) : (
            <Button as={Link} href="/sign-in" color="primary" variant="flat">
              Entrar
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  )
}
