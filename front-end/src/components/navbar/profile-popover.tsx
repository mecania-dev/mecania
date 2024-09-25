'use client'

import { useState } from 'react'

import { Can, CanProps } from '@/auth/client'
import { useIsLoading } from '@/hooks/use-is-loading'
import { useUser } from '@/providers/user-provider'
import { tv, Avatar, Button, Popover, PopoverContent, PopoverTrigger, ScrollShadow } from '@nextui-org/react'
import Link from 'next/link'

const link = tv({
  base: 'block w-full rounded-small px-2 py-1.5 hover:bg-default/40'
})

type RouteProps = CanProps & {
  label: string
  path: string
}

export function ProfilePopover() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useUser()
  const [handleSignOut, isSigningOut] = useIsLoading(signOut)
  const signedAs = user?.username || user?.email || 'unknown'

  const routes = [
    { label: 'Falar com IA', path: '/chat', I: 'ask_ai', a: 'Chat' },
    { label: 'Meus dados', path: '/profile', I: 'update', a: 'User' },
    { label: 'Solicitações', path: '/profile/requests', I: ['message_mechanic', 'message_user'], a: 'Chat' },
    { label: 'Serviços', path: '/services', I: 'create', a: 'Service' },
    { label: 'Oficinas', path: '/mechanics', I: 'create', a: 'User' }
  ] as RouteProps[]

  return (
    <Popover placement="bottom-end" isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Avatar as="button" src={user?.avatarUrl ?? undefined} color="secondary" size="sm" isBordered />
      </PopoverTrigger>
      <PopoverContent className="min-w-36 space-y-1 p-2">
        <p className="px-2 font-semibold">{signedAs}</p>
        <ScrollShadow className="max-h-[176px] w-full" hideScrollBar>
          {routes.map(({ label, path, ...canProps }) => (
            <Can key={path} {...canProps}>
              <Link href={path} className={link()} onClick={() => setIsOpen(false)}>
                {label}
              </Link>
            </Can>
          ))}
        </ScrollShadow>
        <Button
          color="danger"
          variant="light"
          radius="sm"
          className="h-auto w-full justify-start px-2 py-1.5"
          onPress={handleSignOut}
          isLoading={isSigningOut}
        >
          Sair
        </Button>
      </PopoverContent>
    </Popover>
  )
}
