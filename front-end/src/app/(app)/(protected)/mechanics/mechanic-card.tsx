import { forwardRef } from 'react'
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

export const MechanicCard = forwardRef<HTMLDivElement, MechanicCardProps>(function MechanicCard(
  { children, mechanic, href, shadow = 'lg', classNames, hideAvatar, isLoaded = true, ...rest },
  ref
) {
  const classes = mechanicCard()

  if (!isLoaded)
    return (
      <MechanicCardSkeleton
        shadow={shadow}
        classNames={classNames}
        hideAvatar={hideAvatar}
        isLoaded={isLoaded}
        {...rest}
      />
    )

  return (
    <Card
      ref={ref}
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
            <h1 className={classes.username({ class: classNames?.username })}>{mechanic?.username}</h1>
            {mechanic?.phoneNumber && (
              <div className={classes.infos({ class: classNames?.infos })}>
                <FaPhone className={classes.infosIcon({ class: classNames?.infosIcon })} />
                <span className={classes.infosText({ class: classNames?.infosText })}>{mechanic.phoneNumber}</span>
              </div>
            )}
            {mechanic?.email && (
              <div className={classes.infos({ class: classNames?.infos })}>
                <FaEnvelope className={classes.infosIcon({ class: classNames?.infosIcon })} />
                <span className={classes.infosText({ class: classNames?.infosText })}>{mechanic.email}</span>
              </div>
            )}
            {mechanic?.fiscalIdentification && (
              <div className={classes.fiscalIdentification({ class: classNames?.fiscalIdentification })}>
                <b>CNPJ: </b>
                {mechanic.fiscalIdentification}
              </div>
            )}
          </div>
        </div>
        {/* Rating Section */}
        <Divider className="my-2" />
        <div className={classes.ratingWrapper({ class: classNames?.ratingWrapper })}>
          <span className={classes.ratingText({ class: classNames?.ratingText })}>Avaliação</span>
          <Rating rating={mechanic?.rating} />
        </div>
        {children}
      </Card.Body>
    </Card>
  )
})

export function MechanicCardSkeleton({
  children,
  shadow = 'lg',
  classNames,
  hideAvatar,
  isLoaded,
  ...rest
}: MechanicCardProps) {
  const classes = mechanicCard()

  return (
    <Card
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
          {!hideAvatar && <Avatar src="" alt="skeleton" className={classes.avatar({ class: classNames?.avatar })} />}
          <div className={classes.infosWrapper({ class: classNames?.infosWrapper })}>
            <Skeleton className="w-[60%] rounded-small" isLoaded={isLoaded}>
              <h1 className={classes.username({ class: classNames?.username })}>Skeleton</h1>
            </Skeleton>
            <div className={classes.infos({ class: classNames?.infos })}>
              <FaPhone className={classes.infosIcon({ class: classNames?.infosIcon })} />
              <Skeleton className="rounded-small" isLoaded={isLoaded}>
                <span className={classes.infosText({ class: classNames?.infosText })}>(00) 0 0000-0000</span>
              </Skeleton>
            </div>
            <div className={classes.infos({ class: classNames?.infos })}>
              <FaEnvelope className={classes.infosIcon({ class: classNames?.infosIcon })} />
              <Skeleton className="rounded-small" isLoaded={isLoaded}>
                <span className={classes.infosText({ class: classNames?.infosText })}>example@example.com</span>
              </Skeleton>
            </div>
            <div className="flex items-center gap-1.5">
              <b className={classes.fiscalIdentification({ class: [classNames?.fiscalIdentification, 'grow-0'] })}>
                CNPJ:
              </b>
              <Skeleton className="rounded-small" isLoaded={isLoaded}>
                <span className={classes.fiscalIdentification({ class: classNames?.fiscalIdentification })}>
                  000.000.000-00
                </span>
              </Skeleton>
            </div>
          </div>
        </div>
        {/* Rating Section */}
        <Divider className="my-2" />
        <div className={classes.ratingWrapper({ class: classNames?.ratingWrapper })}>
          <span className={classes.ratingText({ class: classNames?.ratingText })}>Avaliação</span>
          <Skeleton className="rounded-small" isLoaded={isLoaded}>
            <Rating rating={0} />
          </Skeleton>
        </div>
        {children}
      </Card.Body>
    </Card>
  )
}
