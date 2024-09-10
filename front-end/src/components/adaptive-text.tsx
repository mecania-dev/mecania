'use client'

import { forwardRef, useCallback, useEffect, useRef } from 'react'

import { useRefChange } from '@/hooks/use-ref-change'
import { getAverageColor } from '@/lib/canvas'
import { mergeRefs } from '@/lib/refs'
import { As } from '@/types/utils'
import { readableColor } from 'color2k'

type AdaptiveTextProps<AsComponent extends As = 'p'> = React.ComponentPropsWithoutRef<AsComponent> & {
  as?: AsComponent
  parent?: React.RefObject<HTMLElement> | null
}

export const AdaptiveText = forwardRef(function AdaptiveText<AsComponent extends As = 'p'>(
  { as, parent, ...props }: AdaptiveTextProps<AsComponent>,
  ref: React.Ref<any>
) {
  parent = useRefChange(parent)
  const textColorRef = useRef<HTMLParagraphElement>(null) // Reference to the text element
  const parentElement = parent?.current ?? findParentWithBackgroundColor(textColorRef.current)
  const imageSrc = parentElement && 'src' in parentElement ? parentElement.src : null

  const applyColor = useCallback(async () => {
    if (parentElement && textColorRef.current) {
      const parentRect = parentElement.getBoundingClientRect()
      const textRect = textColorRef.current.getBoundingClientRect()
      const relativePosition = {
        top: textRect.top - parentRect.top - 10,
        left: textRect.left - parentRect.left
      }

      if (parentElement instanceof HTMLImageElement) {
        const averageColor = await getAverageColor(parentElement, {
          sx: relativePosition.left,
          sy: relativePosition.top,
          sw: canvas => canvas.width - relativePosition.left,
          sh: canvas => canvas.height - relativePosition.top
        })
        textColorRef.current.style.color = readableColor(averageColor)
      } else {
        const parentBgColor = window.getComputedStyle(parentElement).backgroundColor
        textColorRef.current.style.color = readableColor(parentBgColor)
      }
    }
  }, [parentElement])

  useEffect(() => {
    applyColor()
  }, [parent, imageSrc, applyColor])

  const Component = (as ?? 'p') as any
  return <Component ref={mergeRefs(textColorRef, ref)} {...props} />
})

function findParentWithBackgroundColor(element?: HTMLElement | null) {
  if (!element) return null
  let parent = element.parentElement
  while (parent) {
    const bgColor = getComputedStyle(parent).backgroundColor
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') return parent
    parent = parent.parentElement
  }
  return null
}
