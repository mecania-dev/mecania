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
import { useConfirmationModal } from './confirmation-modal'

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
  form,
  onFormSubmit,
  ...rest
}: ModalProps) {
  const { isOpen: isConfirmationModalOpen } = useConfirmationModal()
  const { matches: isSmallScreen } = useMediaQuery({ size: 'sm' })

  if (isConfirmationModalOpen && rest.isDismissable == null) {
    rest.isDismissable = false
  }

  if (isConfirmationModalOpen && rest.isKeyboardDismissDisabled == null) {
    rest.isKeyboardDismissDisabled = true
  }

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
      <ModalContent as={form ? Form : undefined} className={classNames?.content} form={form} onSubmit={onFormSubmit}>
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
