'use client'

import { Sidebar, useSidebar } from '@/components/sidebar'
import { SidebarToggle } from '@/components/sidebar/sidebar-toggle'
import { usePathnameChange } from '@/hooks/use-pathname-change'
import { Can } from '@/providers/ability-provider'
import { create } from 'zustand'

import { SidebarAIButton } from './ai-button'
import { ChatHistory } from './chat/chat-history'
import { RequestsHistory } from './requests/requests-history'
import { SidebarRoutes } from './sidebar-routes'

type ProtectedSidebarStore = {
  isRoutesOpen: boolean
  isChatOpen: boolean
  isRequestsOpen: boolean
  setIsRoutesOpen: (isRoutesOpen: boolean) => void
  setIsChatOpen: (isChatOpen: boolean) => void
  setIsRequestsOpen: (isRequestsOpen: boolean) => void
}

export const useProtectedSidebar = create<ProtectedSidebarStore>()(set => ({
  isRoutesOpen: false,
  isChatOpen: false,
  isRequestsOpen: false,
  setIsRoutesOpen: isRoutesOpen => set({ isRoutesOpen, isRequestsOpen: false, isChatOpen: false }),
  setIsChatOpen: isChatOpen => set({ isChatOpen, isRoutesOpen: !isChatOpen, isRequestsOpen: false }),
  setIsRequestsOpen: isRequestsOpen => set({ isRequestsOpen, isRoutesOpen: !isRequestsOpen, isChatOpen: false })
}))

interface ProtectedSidebarProps {
  children: React.ReactNode
  className?: string
}

export function ProtectedSidebar({ children, className }: ProtectedSidebarProps) {
  const { isOpen } = useSidebar()
  const { isChatOpen, isRoutesOpen, isRequestsOpen } = useProtectedSidebar()

  usePathnameChange(pathname => {
    const isChatOpen = pathname.startsWith('/chat')
    const isRequestsOpen = pathname.startsWith('/profile/mechanics')
    useProtectedSidebar.setState({ isRoutesOpen: !isChatOpen && !isRequestsOpen, isChatOpen, isRequestsOpen })
  })

  return (
    <Sidebar
      data-routes={!isOpen || isRoutesOpen}
      data-chat={isOpen && isChatOpen}
      data-requests={isOpen && isRequestsOpen}
      content={children}
      className={className}
    >
      <Sidebar.Header className="justify-between">
        <SidebarToggle />
        <Can I={isRequestsOpen ? 'manage' : 'ask_ai'} a="Chat">
          <SidebarAIButton />
        </Can>
      </Sidebar.Header>
      <Sidebar.Body className="flex-row-reverse group-data-[open-complete=true]:group-data-[routes=false]:flex-row">
        <SidebarRoutes />
        <ChatHistory />
        <RequestsHistory />
      </Sidebar.Body>
    </Sidebar>
  )
}
