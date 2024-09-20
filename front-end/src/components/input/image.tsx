import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { FaUndo } from 'react-icons/fa'
import { FaCamera } from 'react-icons/fa6'
import { FcEditImage, FcRemoveImage } from 'react-icons/fc'

import { mergeRefs } from '@/lib/refs'
import { ClassValue } from '@/types/utils'
import { Card, CardFooter, SlotsToClasses, tv } from '@nextui-org/react'

import { AdaptiveText } from '../adaptive-text'
import { Button } from '../button'
import { Image, ImageProps } from '../image'

export type ImageInputFile = File | string | null

type ImageInputClassNames = ImageProps['classNames'] &
  SlotsToClasses<keyof ReturnType<typeof imageInput>> & {
    innerWrapper: ClassValue
  }

export interface ImageInputProps {
  label?: string
  image?: ImageInputFile
  setImage(file?: ImageInputFile): void
  classNames?: ImageInputClassNames
  className?: string
  isOriginal?: boolean
  isDisabled?: boolean
  hideRemove?: boolean
}

const imageInput = tv({
  slots: {
    base: 'flex min-h-40 w-full flex-col',
    wrapper: 'flex w-full grow flex-col',
    footer:
      'absolute bottom-1 z-[11] ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10'
  }
})

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(function ImageInput(
  { label, image, setImage, classNames, className, isOriginal, isDisabled, hideRemove },
  ref
) {
  const [original, setOriginal] = useState(image)
  const [isOriginalSelected, setIsOriginalSelected] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const { base, wrapper, footer } = imageInput()
  const isImageFile = image instanceof File
  const imageSrc = useMemo(() => (isImageFile ? URL.createObjectURL(image) : image), [image, isImageFile])
  const imageAlt = useMemo(() => label || (isImageFile ? image.name : image), [image, isImageFile, label])

  useEffect(() => {
    if (isOriginal && isOriginal !== isOriginalSelected) {
      setIsOriginalSelected(isOriginal)
      setOriginal(image)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOriginal])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImage(file)
      setIsOriginalSelected(false)
    }
    event.target.value = ''
  }

  const openFileSelector = () => {
    if (inputRef.current && !isDisabled) {
      inputRef.current.click()
    }
  }

  const resetImage = () => {
    setImage(isOriginalSelected ? undefined : original)
    setIsOriginalSelected(!isOriginalSelected)
  }

  return (
    <div className={base({ class: [classNames?.base, className] })}>
      {imageSrc && imageAlt ? (
        <Card radius="lg" className={wrapper({ class: classNames?.wrapper })} isFooterBlurred>
          <Image
            ref={imageRef}
            src={imageSrc}
            alt={imageAlt}
            classNames={{
              wrapper: ['flex flex-col grow', classNames?.innerWrapper],
              img: ['object-contain', classNames?.img],
              blurredImg: classNames?.blurredImg,
              zoomedWrapper: classNames?.zoomedWrapper
            }}
            radius="none"
            fill
          />
          <CardFooter className={footer({ class: classNames?.footer })}>
            <AdaptiveText parent={imageRef} className="w-full text-start text-sm font-bold text-foreground">
              {label || (isImageFile ? image.name : '')}
            </AdaptiveText>
            {!isDisabled && (
              <div className="flex items-center gap-2">
                <FcEditImage size={22} className="cursor-pointer active:scale-95" onClick={openFileSelector} />
                {!(hideRemove && isOriginalSelected) && (
                  <FcRemoveImage size={22} className="cursor-pointer active:scale-95" onClick={resetImage} />
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      ) : (
        <div className={base({ class: ['items-center', classNames?.base, className] })}>
          <div
            className={wrapper({
              class: [
                'items-center justify-center rounded-large p-5',
                !isDisabled && 'border-2 border-dashed border-default-600',
                classNames?.wrapper
              ]
            })}
          >
            {isDisabled ? (
              <Image
                src="/placeholder.jpg"
                alt="placeholder"
                classNames={{
                  wrapper: 'flex w-full grow',
                  img: 'object-cover'
                }}
                fill
              />
            ) : (
              <div className="flex gap-2">
                <Button startContent={<FaCamera className="h-5 w-5 shrink-0" />} onPress={openFileSelector}>
                  Select an image
                </Button>
                {original && (
                  <Button onPress={resetImage} isIconOnly>
                    <FaUndo />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <input
        ref={mergeRefs(ref, inputRef)}
        type="file"
        className="hidden"
        onChange={handleImageChange}
        accept="image/*"
      />
    </div>
  )
})
