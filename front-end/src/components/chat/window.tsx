'use client'

import { forwardRef } from 'react'

import { ScrollShadow, ScrollShadowProps, SlotsToClasses, tv } from '@nextui-org/react'

const chatWindow = tv({
  slots: {
    base: [
      'flex w-full grow flex-col-reverse',
      'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-default-400 scrollbar-thumb-rounded-full'
    ],
    content: 'mx-auto mb-4 w-full space-y-4 px-5 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]'
  }
})

interface ChatWindowProps extends ScrollShadowProps {
  classNames?: SlotsToClasses<keyof ReturnType<typeof chatWindow>>
}

export const ChatWindow = forwardRef<HTMLDivElement, ChatWindowProps>(function ChatWindow(
  { children, className, classNames, ...props },
  ref
) {
  const { base, content } = chatWindow()

  return (
    <ScrollShadow ref={ref} className={base({ class: [className, classNames?.base] })} {...props}>
      <div className={content({ class: classNames?.content })}>{children}</div>
    </ScrollShadow>
  )
})
