'use client'

import { useState } from 'react'

import { useUser } from '@/providers/user-provider'
import { tv, Avatar, Button, Popover, PopoverContent, PopoverTrigger, ScrollShadow } from '@nextui-org/react'
import Link from 'next/link'

const link = tv({
  base: 'block w-full rounded-small px-2 py-1.5 hover:bg-default/40'
})

export function ProfilePopover() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useUser()
  const signedAs = user?.username || user?.email || 'unknown'
  const isAdmin = user?.isSuperuser

  let routes = [
    { label: 'Falar com IA', path: '/chat' },
    { label: 'Meus dados', path: '/profile' },
    { label: 'Solicitações', path: '/profile/mechanics' }
  ]

  if (!isAdmin) {
    routes = routes.filter(({ path }) => !path.startsWith('/admin'))
  }

  return (
    <Popover placement="bottom-end" isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Avatar as="button" src={user?.avatarUrl ?? undefined} color="secondary" size="sm" isBordered />
      </PopoverTrigger>
      <PopoverContent className="min-w-36 space-y-1 p-2">
        <p className="px-2 font-semibold">{signedAs}</p>
        <ScrollShadow className="max-h-[176px] w-full" hideScrollBar>
          {routes.map(({ label, path }) => (
            <Link href={path} className={link()} onClick={() => setIsOpen(false)} key={path}>
              {label}
            </Link>
          ))}
        </ScrollShadow>
        <Button
          color="danger"
          variant="light"
          radius="sm"
          className="h-auto w-full justify-start px-2 py-1.5"
          onPress={logout}
        >
          Sair
        </Button>
      </PopoverContent>
    </Popover>
  )
}
