import { FaEnvelope, FaPhone } from 'react-icons/fa6'

import { Card, CardProps } from '@/components/card'
import { Rating } from '@/components/rating'
import { Mechanic } from '@/types/entities/mechanic'
import { Avatar, Divider, SlotsToClasses, tv } from '@nextui-org/react'
import Link from 'next/link'

interface MechanicCardProps extends Omit<CardProps, 'ref' | 'classNames'> {
  mechanic: Mechanic
  href?: string
  classNames?: SlotsToClasses<keyof ReturnType<typeof mechanicCard>> & CardProps['classNames']
  hideAvatar?: boolean
}

const mechanicCard = tv({
  slots: {
    wrapper: 'flex items-center space-x-4',
    avatar: 'h-10 w-10 shrink-0 text-large min-[460px]:h-14 min-[460px]:w-14',
    infosWrapper: 'overflow-hidden',
    username: 'truncate text-large font-bold',
    infos: 'flex items-center space-x-2 text-default-600',
    infosIcon: 'shrink-0 max-[400px]:h-3 max-[400px]:w-3',
    infosText: 'truncate max-[400px]:text-xs',
    fiscalIdentification: 'truncate text-xs text-default-500 sm:text-small',
    ratingWrapper: 'flex items-center justify-between',
    ratingText: 'text-medium font-medium sm:text-large'
  }
})

export function MechanicCard({
  children,
  mechanic,
  href,
  shadow = 'lg',
  classNames,
  hideAvatar,
  ...rest
}: MechanicCardProps) {
  const classes = mechanicCard()

  return (
    <Card
      as={href ? Link : undefined}
      href={href}
      shadow={shadow}
      classNames={{
        base: ['w-full max-w-3xl', classNames?.base],
        body: classNames?.body,
        header: classNames?.header,
        footer: classNames?.footer
      }}
      {...rest}
    >
      <Card.Body>
        <div className={classes.wrapper({ class: classNames?.wrapper })}>
          {!hideAvatar && (
            <Avatar
              src={mechanic?.avatarUrl ?? ''}
              alt={mechanic?.username}
              className={classes.avatar({ class: classNames?.avatar })}
            />
          )}
          <div className={classes.infosWrapper({ class: classNames?.infosWrapper })}>
            <h1 className={classes.username({ class: classNames?.username })}>{mechanic?.username}</h1>
            <div className={classes.infos({ class: classNames?.infos })}>
              <FaPhone className={classes.infosIcon({ class: classNames?.infosIcon })} />
              <span className={classes.infosText({ class: classNames?.infosText })}>{mechanic?.phoneNumber}</span>
            </div>
            <div className={classes.infos({ class: classNames?.infos })}>
              <FaEnvelope className={classes.infosIcon({ class: classNames?.infosIcon })} />
              <span className={classes.infosText({ class: classNames?.infosText })}>{mechanic?.email}</span>
            </div>
            <p className={classes.fiscalIdentification({ class: classNames?.fiscalIdentification })}>
              <b>CNPJ:</b> {mechanic?.fiscalIdentification}
            </p>
          </div>
        </div>
        {/* Rating Section */}
        <Divider />
        <div className={classes.ratingWrapper({ class: classNames?.ratingWrapper })}>
          <span className={classes.ratingText({ class: classNames?.ratingText })}>Rating</span>
          <Rating rating={mechanic?.rating} />
        </div>
        {children}
      </Card.Body>
    </Card>
  )
}
