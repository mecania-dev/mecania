import { forwardRef } from 'react'

import { Image as NextUIImage, ImageProps as NextUIImageProps } from '@nextui-org/react'
import NextImage, { ImageProps as NextImageProps } from 'next/image'

export type ImageProps = NextUIImageProps & NextImageProps

export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { as = NextImage, classNames, ...props },
  ref
) {
  return (
    <NextUIImage
      ref={ref}
      as={as}
      classNames={{
        ...classNames,
        wrapper: ['select-none !max-w-none', classNames?.wrapper],
        img: ['object-contain', classNames?.img]
      }}
      {...props}
    />
  )
})
