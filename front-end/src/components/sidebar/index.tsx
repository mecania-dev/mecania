'use client'

import { useRef } from 'react'

import { useIsMounted } from '@/hooks/use-is-mounted'
import { useMediaQuery } from '@/hooks/use-media-query'
import { usePathnameChange } from '@/hooks/use-pathname-change'
import { handleClickOutside } from '@/lib/element'
import { tv } from '@nextui-org/react'
import { create } from 'zustand'

import { SidebarBody } from './sidebar-body'
import { SidebarFooter } from './sidebar-footer'
import { SidebarHeader } from './sidebar-header'

type SidebarStore = {
  isOpen: boolean
  isOpenComplete: boolean
  isCloseComplete: boolean
  toggleOpen: () => void
  setIsOpen: (isOpen: boolean) => void
  setIsOpenComplete: (isOpenComplete: boolean) => void
  setIsCloseComplete: (isCloseComplete: boolean) => void
}

export const useSidebar = create<SidebarStore>()(set => ({
  isOpen: true,
  isOpenComplete: true,
  isCloseComplete: false,
  toggleOpen: () => set(state => ({ isOpen: !state.isOpen, isOpenComplete: false, isCloseComplete: false })),
  setIsOpen: isOpen => set({ isOpen, isOpenComplete: false, isCloseComplete: false }),
  setIsOpenComplete: isOpenComplete => set({ isOpenComplete }),
  setIsCloseComplete: isCloseComplete => set({ isCloseComplete })
}))

const contentClass = tv({
  base: 'flex w-[calc(100vw_-_60px)] flex-col transition-width group-data-[open=true]:w-screen lg:group-data-[open=true]:w-[max(calc(100vw_-_280px),_77%)]'
})

interface SidebarProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'content'> {
  content: React.ReactNode
}

export function Sidebar({ children, content, className, ...props }: SidebarProps) {
  const { isOpen, setIsOpen, setIsOpenComplete, setIsCloseComplete, isOpenComplete, isCloseComplete } = useSidebar()
  const { matches } = useMediaQuery({ size: 'lg' })
  const sidebarRef = useRef<HTMLDivElement>(null)
  const isMounted = useIsMounted(async () => {
    if (matches) setIsOpen(false)
  })

  usePathnameChange(() => {
    if (matches && isOpen && isMounted) {
      setIsOpen(false)
    }
  })

  function onClickOutside() {
    if (matches && isOpen) {
      setIsOpen(false)
    }
  }

  function onTransitionEnd(e: React.TransitionEvent<HTMLDivElement>) {
    if (e.propertyName === 'width') {
      setIsOpenComplete(isOpen)
      setIsCloseComplete(!isOpen)
    }
  }

  if (!isMounted) return null
  return (
    <div
      data-open={isOpen}
      data-open-complete={isOpenComplete}
      data-close-complete={isCloseComplete}
      className="group flex grow"
      {...props}
    >
      <div
        className="w-[60px] text-primary-foreground transition-width max-lg:group-data-[open=true]:w-0 lg:group-data-[open=true]:w-[min(280px,_23%)]"
        onTransitionEnd={onTransitionEnd}
      >
        <div
          ref={sidebarRef}
          className="fixed left-0 z-30 flex h-[calc(100dvh-4rem)] w-[60px] select-none flex-col rounded-br-large bg-background/60 shadow-small backdrop-blur-lg backdrop-saturate-150 transition-width group-data-[open=true]:w-[min(280px,_calc(100%_-_10px))] lg:group-data-[open=true]:w-[min(280px,_23%)]"
        >
          {children}
        </div>
      </div>
      <div className={contentClass({ className })} onClick={handleClickOutside(sidebarRef, onClickOutside)}>
        {content}
      </div>
    </div>
  )
}

Sidebar.Header = SidebarHeader
Sidebar.Body = SidebarBody
Sidebar.Footer = SidebarFooter
