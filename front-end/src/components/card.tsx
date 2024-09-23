import { forwardRef } from 'react'

import { Card as NextUICard, CardProps as NextUICardProps, CardBody, CardFooter, CardHeader } from '@nextui-org/react'

export type CardProps = React.ComponentPropsWithoutRef<typeof NextUICard> & Omit<NextUICardProps, 'ref'>

type CardComponent = React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>> & {
  Header: typeof CardHeader
  Body: typeof CardBody
  Footer: typeof CardFooter
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { isBlurred = true, isHoverable = true, classNames, ...rest },
  ref
) {
  return (
    <NextUICard
      ref={ref}
      classNames={{
        ...classNames,
        base: ['bg-background/60 dark:bg-background/75', classNames?.base]
      }}
      isHoverable={isHoverable}
      isBlurred={isBlurred}
      {...rest}
    />
  )
}) as CardComponent

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter
