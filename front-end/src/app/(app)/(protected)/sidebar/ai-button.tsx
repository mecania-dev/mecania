import { forwardRef } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { HiOutlineSparkles } from 'react-icons/hi2'

import { Button, ButtonProps } from '@/components/button'
import { sidebarRoute } from '@/components/sidebar/variants'

import { useProtectedSidebar } from '.'

export const SidebarAIButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'ref'>>(function SidebarAIButton(
  { className, variant = 'faded', ...props },
  ref
) {
  const { isRoutesOpen, setIsRoutesOpen, setIsChatOpen } = useProtectedSidebar()
  const classes = sidebarRoute()
  const Icon = isRoutesOpen ? HiOutlineSparkles : FaArrowLeftLong

  function toggleChat() {
    if (isRoutesOpen) {
      setIsChatOpen(true)
    } else {
      setIsRoutesOpen(true)
    }
  }

  return (
    <Button
      ref={ref}
      variant={variant}
      className={classes.base({
        class: ['hidden w-fit animate-appearance-in p-2 pr-2.5 group-data-[open-complete=true]:flex', className]
      })}
      onPress={toggleChat}
      {...props}
    >
      <Icon
        className={classes.icon({
          class: [
            !isRoutesOpen &&
              'translate-x-0.5 transition-transform group-data-[hover=true]:-translate-x-0.5 group-data-[pressed=true]:-translate-x-0.5'
          ]
        })}
      />
      {isRoutesOpen && <p className={classes.text()}>IA</p>}
    </Button>
  )
})
