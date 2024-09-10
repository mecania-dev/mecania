'use client'

import { forwardRef } from 'react'
import { FaCircleArrowUp } from 'react-icons/fa6'

import { Button, ButtonProps } from '@/components/button'
import { TextArea, TextAreaProps } from '@/components/textarea'
import { SlotsToClasses, tv } from '@nextui-org/react'

const chatInput = tv({
  slots: {
    submit: 'h-8 w-8 min-w-0 bg-transparent p-0',
    submitIcon: 'h-full w-full text-secondary-400'
  }
})

type ChatInputClassNames = TextAreaProps['classNames'] & SlotsToClasses<keyof ReturnType<typeof chatInput>>

interface ChatInputProps extends Omit<TextAreaProps, 'onKeyDown' | 'classNames'> {
  classNames?: ChatInputClassNames
  submitProps?: Omit<ButtonProps, 'ref'>
  onSubmit?: () => void
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(function ChatInput(
  {
    size = 'lg',
    placeholder = 'Mensagem',
    classNames,
    endContent,
    fullWidth = true,
    onSubmit,
    onEnter,
    submitProps = {},
    ...rest
  },
  ref
) {
  const { submit, submitIcon } = chatInput()
  const {
    children: submitChildren,
    type: submitType = 'submit',
    className: submitClassName,
    ...submitRest
  } = submitProps

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onEnter?.(e)
      !submitProps.isDisabled && onSubmit?.()
    }
  }

  return (
    <TextArea
      ref={ref}
      size={size}
      placeholder={placeholder}
      classNames={{
        inputWrapper: ['rounded-[26px] p-2 pl-4 bg-default-200 dark:bg-default-100', classNames?.inputWrapper],
        innerWrapper: ['gap-1 md:gap-3 items-center', classNames?.innerWrapper],
        ...classNames
      }}
      endContent={
        endContent ?? (
          <div className="flex h-full items-end">
            <Button
              type={submitType}
              className={submit({ class: [classNames?.submit, submitClassName] })}
              {...submitRest}
            >
              {submitChildren ?? <FaCircleArrowUp className={submitIcon({ class: classNames?.submitIcon })} />}
            </Button>
          </div>
        )
      }
      onKeyDown={handleKeyPress}
      fullWidth={fullWidth}
      {...rest}
    />
  )
})
