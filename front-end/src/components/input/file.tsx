import { ComponentPropsWithoutRef, forwardRef, useRef } from 'react'

import { mergeRefs } from '@/lib/refs'
import { mapPropsVariants } from '@/lib/variants'
import { ClassValue } from '@/types/utils'
import { tv } from '@nextui-org/react'

import { Input, InputProps } from '.'

type NextUIInputPickedProps =
  | 'label'
  | 'color'
  | 'variant'
  | 'size'
  | 'radius'
  | 'description'
  | 'errorMessage'
  | 'labelPlacement'
const nextUIInputPickedProps: NextUIInputPickedProps[] = [
  'label',
  'color',
  'variant',
  'size',
  'radius',
  'description',
  'errorMessage',
  'labelPlacement'
]

export type FileInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'value' | 'onChange' | 'size' | 'color'> &
  Pick<InputProps, NextUIInputPickedProps> & {
    value?: File | File[]
    onValueChange(files?: File[]): void
    classNames?: InputProps['classNames'] & {
      fileInputWrapper?: ClassValue
    }
  }

const fileInput = tv({
  base: 'w-full'
})

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  { value, placeholder = 'No file selected', onValueChange, classNames, className, ...rest },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [props, nextUIProps] = mapPropsVariants(rest, nextUIInputPickedProps)

  if (value instanceof File) {
    value = value ? [value] : undefined
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList && fileList.length > 0) {
      onValueChange(Array.from(fileList))
    }
  }

  const onClear = () => {
    onValueChange()
  }

  return (
    <button
      type="button"
      className={fileInput({ class: [classNames?.fileInputWrapper, className] })}
      onClick={() => inputRef.current?.click()}
    >
      <Input
        value={value?.map(({ name }) => name).join(', ') || ''}
        placeholder={placeholder}
        classNames={{
          ...classNames,
          inputWrapper: ['!cursor-pointer', classNames?.innerWrapper],
          label: ['!cursor-pointer', classNames?.label],
          input: ['!cursor-pointer', classNames?.input]
        }}
        onClear={onClear}
        isReadOnly
        {...nextUIProps}
      />
      <input ref={mergeRefs(ref, inputRef)} type="file" className="hidden" onChange={handleImageChange} {...props} />
    </button>
  )
})
