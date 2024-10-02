import { forwardRef } from 'react'

import { Card } from '@/components/card'
import { Logo } from '@/components/icons/logo'
import { formatDate } from '@/lib/date'
import { Message } from '@/types/entities/chat'
import { Skeleton, SlotsToClasses, tv, VariantProps } from '@nextui-org/react'

const chatMessage = tv({
  slots: {
    base: 'flex',
    card: 'break-word relative w-fit bg-white/65 p-1.5 pb-4 text-small text-inherit',
    sender: 'font-bold',
    message: 'whitespace-pre-wrap',
    date: 'absolute bottom-0.5 right-1.5 text-tiny text-foreground-400',
    logo: 'h-8 w-8 shrink-0'
  },
  variants: {
    isAI: {
      true: { card: 'max-w-[calc(100%-2rem)]' },
      false: { card: 'max-w-[calc(100%-4.5rem)]' }
    },
    isSender: {
      true: { base: 'justify-end' },
      false: { base: 'justify-start' }
    },
    isAIGenerating: {
      true: { logo: 'animate-[spin_3s_linear_infinite]' }
    }
  }
})

type ChatMessageVariants = VariantProps<typeof chatMessage>
type ChatMessageClassNames = {
  classNames?: SlotsToClasses<keyof ReturnType<typeof chatMessage>>
}

type ChatMessageProps = Pick<Message, 'sender' | 'content' | 'sentAt'> & ChatMessageVariants & ChatMessageClassNames

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(function ChatMessage(
  { sender, content, sentAt, isSender, isAIGenerating, classNames },
  ref
) {
  const classes = chatMessage({ isAI: sender.isAi, isSender, isAIGenerating })
  const msgContent = (
    <Card className={classes.card({ class: classNames?.card })} radius="sm" shadow="sm">
      <p className={classes.sender({ class: classNames?.sender })}>{sender.username}</p>
      <p className={classes.message({ class: classNames?.message })}>{content}</p>
      <p className={classes.date({ class: classNames?.date })}>{formatDate(sentAt, { timeStyle: 'short' })}</p>
    </Card>
  )

  return sender.isAi ? (
    <div ref={ref} className="flex gap-2">
      <Logo className={classes.logo()} />
      <div className="w-full">{content ? msgContent : <GeneratingMessageSkeleton />}</div>
    </div>
  ) : (
    <div ref={ref} className={classes.base({ class: classNames?.base })}>
      {msgContent}
    </div>
  )
})

function GeneratingMessageSkeleton() {
  return (
    <div className="w-full max-w-[calc(100%-2rem)] space-y-2">
      {[...Array(3)].map((_, i) => (
        <Skeleton
          classNames={{
            base: ['h-6 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10', i === 2 && 'w-2/3']
          }}
          key={i}
        />
      ))}
    </div>
  )
}
