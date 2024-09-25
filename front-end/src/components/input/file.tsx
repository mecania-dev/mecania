import { ComponentPropsWithoutRef, forwardRef, useRef } from 'react'
import { IconType } from 'react-icons'
import { MdOutlineAttachFile } from 'react-icons/md'

import { useControlledState } from '@/hooks/use-controlled-state'
import { mergeRefs } from '@/lib/refs'
import { Chip, ChipProps, SlotsToClasses, tv } from '@nextui-org/react'
import { PressEvent } from '@react-types/shared'

import { Button, ButtonProps, ClearButton, ClearButtonProps } from '../button'

interface FileChipProps extends Omit<ChipProps, 'ref' | 'children' | 'onClose'> {
  children: string | ((file: File) => React.ReactNode)
  onClose?: (file: File, index: number, e: PressEvent) => void
}

export interface FileInputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'ref' | 'type' | 'value' | 'onChange'> {
  value?: File[]
  icon?: IconType
  buttonProps?: Omit<ButtonProps, 'ref' | 'children'>
  clearButtonProps?: Omit<ClearButtonProps, 'ref'>
  chipProps?: FileChipProps
  classNames?: SlotsToClasses<keyof ReturnType<typeof fileInput>>
  hideClearButton?: boolean
  hideRemoveButton?: boolean
  onValueChange?: (files: File[]) => void
}

const fileInput = tv({
  slots: {
    base: 'flex w-full flex-col gap-1.5',
    buttonWrapper: 'flex items-center gap-1.5',
    button: 'gap-1.5 p-1.5 pr-3 text-medium',
    icon: 'h-5 w-5 shrink-0',
    chipWrapper: 'flex flex-wrap gap-1',
    chip: 'animate-appearance-in'
  }
})

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  {
    children = 'Selecionar arquivos',
    value,
    multiple = true,
    onValueChange,
    className,
    classNames,
    icon: Icon = MdOutlineAttachFile,
    buttonProps = {},
    clearButtonProps = {},
    chipProps = {},
    hideClearButton,
    hideRemoveButton,
    ...rest
  },
  ref
) {
  const {
    variant = 'flat',
    color = 'primary',
    startContent,
    className: buttonClassName,
    onPress,
    ...buttonPropsRest
  } = buttonProps
  const {
    size: clearButtonSize = 'sm',
    variant: clearButtonVariant = 'flat',
    onPress: clearButtonPress,
    tooltip,
    ...clearButtonPropsRest
  } = clearButtonProps
  const {
    variant: chipVariant = 'faded',
    radius: chipRadius = 'md',
    children: chipChildren,
    className: chipClassName,
    classNames: chipClassNames,
    onClose: chipOnClose,
    ...chipPropsRest
  } = chipProps
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useControlledState<File[]>(value, [], onValueChange)
  const classes = fileInput()

  function handlePress(e: PressEvent) {
    onPress?.(e)
    inputRef.current?.click()
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files
    if (fileList && fileList.length > 0) {
      const fileArray = Array.from(fileList)
      setFiles(prev => (multiple ? [...prev, ...fileArray] : fileArray))
      event.target.value = ''
    }
  }

  const onRemove = (index: number, file: File) => (e: PressEvent) => {
    chipOnClose?.(file, index, e)
    setFiles(prev => {
      const newFiles = [...prev]
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  function onClear(e: PressEvent) {
    clearButtonPress?.(e)
    setFiles([])
  }

  return (
    <div className={classes.base({ class: [className, classNames?.base] })}>
      <div className={classes.buttonWrapper({ class: classNames?.buttonWrapper })}>
        <Button
          variant={variant}
          color={color}
          startContent={startContent ?? <Icon className={classes.icon({ class: classNames?.icon })} />}
          className={classes.button({ class: [buttonClassName, classNames?.button] })}
          onPress={handlePress}
          {...buttonPropsRest}
        >
          {children}
          <input
            ref={mergeRefs(ref, inputRef)}
            type="file"
            multiple={multiple}
            className="hidden"
            onChange={handleImageChange}
            {...rest}
          />
        </Button>
        {!hideClearButton && files && files.length > 0 && (
          <ClearButton
            size={clearButtonSize}
            variant={clearButtonVariant}
            tooltip={{ size: 'sm', offset: 5, content: 'Limpar arquivos', ...tooltip }}
            onPress={onClear}
            {...clearButtonPropsRest}
          />
        )}
      </div>
      <div className={classes.chipWrapper({ class: classNames?.chipWrapper })}>
        {files?.map((file, i) => (
          <Chip
            variant={chipVariant}
            radius={chipRadius}
            className={classes.chip({ class: [chipClassName, classNames?.chip] })}
            classNames={{ closeButton: 'text-danger', ...chipClassNames }}
            onClose={hideRemoveButton ? undefined : onRemove(i, file)}
            key={i}
            {...chipPropsRest}
          >
            {typeof chipChildren === 'function' ? chipChildren(file) : chipChildren ?? file.name}
          </Chip>
        ))}
      </div>
    </div>
  )
})
