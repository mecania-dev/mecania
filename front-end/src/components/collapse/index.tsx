import { ComponentPropsWithoutRef, forwardRef } from 'react'

import { TRANSITION_VARIANTS } from '@/lib/transition-utils'
import { MergeTypes } from '@/types/utils'
import { AnimatePresence, motion } from 'framer-motion'

import { CollapseVariantProps, collapse } from './variants'

export interface CollapseProps extends MergeTypes<ComponentPropsWithoutRef<typeof motion.div>, CollapseVariantProps> {
  open: boolean
  animate?: boolean
}

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(function Collapse(
  { children, open, animate = true, className, ...rest },
  ref
) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          animate="enter"
          exit="exit"
          initial="exit"
          variants={animate ? TRANSITION_VARIANTS.collapse : undefined}
          className={collapse({ className })}
          {...rest}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
})
