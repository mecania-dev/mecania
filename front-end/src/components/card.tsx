import { Card as NextUICard, CardProps as NextUICardProps, CardBody, CardFooter, CardHeader } from '@nextui-org/react'

export interface CardProps extends NextUICardProps {}

export function Card({ isBlurred = true, isHoverable = true, classNames, ...rest }: CardProps) {
  return (
    <NextUICard
      classNames={{
        ...classNames,
        base: ['bg-background/60 dark:bg-background/75', classNames?.base]
      }}
      isHoverable={isHoverable}
      isBlurred={isBlurred}
      {...rest}
    />
  )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter
