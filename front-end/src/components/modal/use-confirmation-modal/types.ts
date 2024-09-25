import { ModalProps } from '@/components/modal'
import { MaybePromise } from '@/lib/promise'

export interface ConfirmationModalState extends Pick<ModalProps, 'size'> {
  isOpen: boolean
  title?: string
  question?: string
  isLoading?: boolean
  onConfirm?: MaybePromise<() => void>
  onCancel?: MaybePromise<() => void>
}

export const actionTypes = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE'
} as const

export type ActionType = typeof actionTypes

export type Action =
  | {
      type: ActionType['OPEN']
      modal: Omit<ConfirmationModalState, 'isOpen'>
    }
  | {
      type: ActionType['CLOSE']
    }
