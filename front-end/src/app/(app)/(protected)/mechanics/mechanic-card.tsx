import { FaEnvelope, FaPhone } from 'react-icons/fa6'

import { Card, CardProps } from '@/components/card'
import { Rating } from '@/components/rating'
import { Mechanic } from '@/types/entities/mechanic'
import { Avatar, Divider, Skeleton, SlotsToClasses, tv } from '@nextui-org/react'
import Link from 'next/link'

type MechanicCardProps = Omit<CardProps, 'ref' | 'classNames'> & {
  mechanic?: Mechanic
  href?: string
  classNames?: SlotsToClasses<keyof ReturnType<typeof mechanicCard>> & CardProps['classNames']
  hideAvatar?: boolean
  isLoaded?: boolean
}

const mechanicCard = tv({
  slots: {
    wrapper: 'flex items-center space-x-4',
    avatar: 'h-10 w-10 shrink-0 text-large min-[460px]:h-14 min-[460px]:w-14',
    infosWrapper: 'grow space-y-1 overflow-hidden',
    username: 'truncate text-large font-bold',
    infos: 'flex items-center space-x-2 text-default-600',
    infosIcon: 'shrink-0 max-[400px]:h-3 max-[400px]:w-3',
    infosText: 'grow truncate max-[400px]:text-xs',
    fiscalIdentification: 'grow truncate text-xs text-default-500 sm:text-small',
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
  isLoaded = true,
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
              alt={mechanic?.username ?? 'avatar'}
              className={classes.avatar({ class: classNames?.avatar })}
            />
          )}
          <div className={classes.infosWrapper({ class: classNames?.infosWrapper })}>
            <Skeleton className="h-5 w-[60%] rounded-small" isLoaded={isLoaded}>
              <h1 className={classes.username({ class: classNames?.username })}>{mechanic?.username}</h1>
            </Skeleton>
            <div className={classes.infos({ class: classNames?.infos })}>
              <FaPhone className={classes.infosIcon({ class: classNames?.infosIcon })} />
              <Skeleton className="h-5 rounded-small" isLoaded={isLoaded}>
                <span className={classes.infosText({ class: classNames?.infosText })}>
                  {isLoaded ? mechanic?.phoneNumber : '(00) 0 0000-0000'}
                </span>
              </Skeleton>
            </div>
            <div className={classes.infos({ class: classNames?.infos })}>
              <FaEnvelope className={classes.infosIcon({ class: classNames?.infosIcon })} />
              <Skeleton className="h-5 rounded-small" isLoaded={isLoaded}>
                <span className={classes.infosText({ class: classNames?.infosText })}>
                  {isLoaded ? mechanic?.email : 'example@example.com'}
                </span>
              </Skeleton>
            </div>
            <div className="flex gap-1.5">
              <b>CNPJ:</b>
              <Skeleton className="h-5 rounded-small" isLoaded={isLoaded}>
                <span className={classes.fiscalIdentification({ class: classNames?.fiscalIdentification })}>
                  {isLoaded ? mechanic?.fiscalIdentification : '000.000.000-00'}
                </span>
              </Skeleton>
            </div>
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
