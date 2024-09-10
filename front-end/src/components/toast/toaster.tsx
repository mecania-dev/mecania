'use client'

import { useToast } from '@/hooks/use-toast'
import { groupBy } from '@/lib/object'
import { AnimatePresence } from 'framer-motion'

import { ToastWrapper } from './toast-wrapper'

export function Toaster() {
  const { toasts } = useToast()
  const groupedToasts = groupBy(toasts, 'position', undefined, 'bottom-left')

  return (
    <AnimatePresence>
      {Object.entries(groupedToasts).map(
        ([key, value]) => value.length > 0 && <ToastWrapper toasts={value} position={key as any} key={key} />
      )}
    </AnimatePresence>
  )
}
