import { ToastProps } from '@/components/toast'

export type ToasterToast = ToastProps & {
  id: string
}

export type Toast = Omit<ToasterToast, 'id' | 'onClose'> & {
  delay?: number
}

export const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST'
} as const

export type ActionType = typeof actionTypes

export type Action =
  | {
      type: ActionType['ADD_TOAST']
      toast: ToasterToast
      delay?: number
    }
  | {
      type: ActionType['UPDATE_TOAST']
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType['REMOVE_TOAST']
      toastId?: ToasterToast['id']
    }

export interface State {
  toasts: ToasterToast[]
}
