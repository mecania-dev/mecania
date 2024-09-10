import { SubmitHandler, UseFormReturn } from 'react-hook-form'

import { useMediaQuery } from '@/hooks/use-media-query'
import {
  ModalBody,
  ModalContent,
  ModalContentProps,
  ModalFooter,
  ModalHeader,
  Modal as NextUIModal,
  ModalProps as NextUIModalProps,
  tv
} from '@nextui-org/react'

import { Form } from '../form'

export interface ModalProps extends Omit<NextUIModalProps, 'children' | 'classNames'> {
  children: ModalContentProps['children']
  classNames?: NextUIModalProps['classNames'] & {
    content?: string
    header?: string
  }
  fullScreen?: boolean
  form?: UseFormReturn<any, any, undefined>
  onFormSubmit?: SubmitHandler<any>
}

const modal = tv({
  variants: {
    fullScreen: {
      true: ''
    },
    isSmallScreen: {
      true: ''
    }
  },
  compoundVariants: [
    {
      fullScreen: true,
      isSmallScreen: true,
      class: 'm-0 max-h-full'
    }
  ]
})

export function Modal({
  children,
  title,
  size,
  placement = 'center',
  scrollBehavior = 'inside',
  fullScreen = true,
  classNames,
  className,
  onFormSubmit,
  ...rest
}: ModalProps) {
  const { matches: isSmallScreen } = useMediaQuery({ size: 'sm' })

  return (
    <NextUIModal
      size={fullScreen && isSmallScreen ? 'full' : size}
      placement={placement}
      scrollBehavior={scrollBehavior}
      classNames={{
        ...classNames,
        wrapper: [scrollBehavior !== 'outside' && 'overflow-hidden', classNames?.wrapper]
      }}
      className={modal({ fullScreen, isSmallScreen, className })}
      {...rest}
    >
      <ModalContent as={onFormSubmit ? Form : undefined} className={classNames?.content} onSubmit={onFormSubmit}>
        {onClose => {
          return (
            <>
              <ModalHeader className={classNames?.header}>{title}</ModalHeader>
              {typeof children === 'function' ? children(onClose) : children}
            </>
          )
        }}
      </ModalContent>
    </NextUIModal>
  )
}

Modal.Body = ModalBody
Modal.Footer = ModalFooter
