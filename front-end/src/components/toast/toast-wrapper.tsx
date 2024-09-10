import { ComponentPropsWithoutRef, forwardRef } from 'react'

import { MergeTypes } from '@/types/utils'
import { AnimatePresence, motion } from 'framer-motion'

import { Toast, ToastProps, getTranslate } from '.'
import { ToastVariantProps, toast } from './variants'

export interface ToastWrapperProps extends MergeTypes<ComponentPropsWithoutRef<typeof motion.div>, ToastVariantProps> {
  toasts: ToastProps[]
}

export const ToastWrapper = forwardRef<HTMLDivElement, ToastWrapperProps>(function ToastWrapper(
  { toasts, position = 'bottom-left', className, ...rest },
  ref
) {
  const { wrapper } = toast({ position })

  if (position.includes('top')) {
    toasts.reverse()
  }

  return (
    <motion.div ref={ref} className={wrapper({ className })} exit={{ translate: getTranslate(position) }} {...rest}>
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </motion.div>
  )
})
