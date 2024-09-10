import { forwardRef } from 'react'

import { mapPropsVariants } from '@/lib/variants'
import { motion } from 'framer-motion'

import { Alert, AlertProps } from '../alert'
import { ToastVariantProps, toast } from './variants'

export interface ToastProps extends ToastVariantProps, AlertProps {
  message: string
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(originalProps, ref) {
  const [props, variantProps] = mapPropsVariants(originalProps, toast.variantKeys)
  const { className, classNames, ...rest } = props
  const { base } = toast(variantProps)

  return (
    <motion.div
      ref={ref}
      animate="enter"
      initial="exit"
      exit="exit"
      variants={{
        enter: { translate: '0' },
        exit: { translate: getTranslate(variantProps.position) }
      }}
    >
      <Alert
        className={base({ className })}
        classNames={{
          ...classNames,
          base: ['max-sm:p-3', classNames?.base],
          icon: ['max-sm:w-4 max-sm:h-4', classNames?.icon],
          title: ['max-sm:text-xs', classNames?.title],
          message: ['max-sm:text-xs', classNames?.message],
          close: ['max-sm:w-4 max-sm:h-4', classNames?.close]
        }}
        {...rest}
      />
    </motion.div>
  )
})

export function getTranslate(position: ToastVariantProps['position'] = 'bottom-left') {
  switch (position) {
    case 'top':
      return '0 -100vh'
    case 'bottom':
      return '0 100vh'
    case 'top-right':
    case 'bottom-right':
      return '100vw'
    case 'top-left':
    case 'bottom-left':
      return '-100vw'
  }
}
