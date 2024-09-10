import { tv, VariantProps } from '@nextui-org/react'

const toast = tv({
  slots: {
    wrapper: 'pointer-events-none fixed z-[51] flex flex-col gap-2 bg-transparent max-sm:w-full',
    base: 'pointer-events-auto w-fit max-w-[90%] shadow-medium sm:max-w-md'
  },
  variants: {
    position: {
      top: { wrapper: 'left-1/2 top-4 -translate-x-1/2 items-center' },
      'top-right': { wrapper: 'right-4 top-4 items-end' },
      'top-left': { wrapper: 'left-4 top-4' },
      bottom: { wrapper: 'bottom-4 left-1/2 -translate-x-1/2 items-center' },
      'bottom-right': { wrapper: 'bottom-4 right-4 items-end' },
      'bottom-left': { wrapper: 'bottom-4 left-4' }
    }
  },
  defaultVariants: {
    position: 'bottom-left'
  }
})

export type ToastVariantProps = VariantProps<typeof toast>
export type ToastSlots = keyof ReturnType<typeof toast>

export { toast }
