'use client'

import { forwardRef } from 'react'

import { Card, CardProps } from '@/components/card'
import { SlotsToClasses, tv } from '@nextui-org/react'

const chatHeader = tv({
  slots: {
    base: 'absolute inset-x-5 top-5 z-10',
    body: 'flex-row justify-between font-semibold'
  }
})

interface ChatHeaderProps extends CardProps {
  classNames?: SlotsToClasses<keyof ReturnType<typeof chatHeader>>
}

export const ChatHeader = forwardRef<HTMLDivElement, ChatHeaderProps>(function ChatHeader(
  { children, className, isHoverable = false, ...props },
  ref
) {
  const { base, body } = chatHeader()

  return (
    <Card ref={ref} className={base({ className })} isBlurred isHoverable={isHoverable} {...props}>
      <Card.Body className={body()}>{children}</Card.Body>
    </Card>
  )
})
