import { forwardRef } from 'react'

import { Textarea as NextUITextarea, TextAreaProps as NextUITextAreaProps } from '@nextui-org/react'

export type TextAreaProps = NextUITextAreaProps

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function Textarea(
  { isInvalid, minRows = 1, style = {}, ...rest },
  ref
) {
  if (!style.height) {
    style.height = `${minRows * 24}px`
  }

  return (
    <NextUITextarea ref={ref} minRows={minRows} style={style} isInvalid={isInvalid ?? !!rest.errorMessage} {...rest} />
  )
})
