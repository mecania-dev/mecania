import { VscClearAll } from 'react-icons/vsc'

import { Tooltip, TooltipProps, cn } from '@nextui-org/react'

import { Button, ButtonProps } from '.'

export interface ClearButtonProps extends Omit<ButtonProps, 'ref'> {
  iconClassName?: string
  tooltip?: TooltipProps
}

export function ClearButton({
  children,
  color = 'danger',
  variant = 'faded',
  className,
  onPress,
  isIconOnly = true,
  iconClassName,
  tooltip = {},
  ...rest
}: ClearButtonProps) {
  const { color: tooltipColor = 'danger', content = 'Limpar seleção', ...tooltipRest } = tooltip

  return (
    <Tooltip color={tooltipColor} content={content} {...tooltipRest}>
      <Button
        color={color}
        variant={variant}
        className={cn('min-w-0', className)}
        onPress={onPress}
        isIconOnly={isIconOnly}
        {...rest}
      >
        {children ?? <VscClearAll className={cn('h-5 w-5', iconClassName)} />}
      </Button>
    </Tooltip>
  )
}
