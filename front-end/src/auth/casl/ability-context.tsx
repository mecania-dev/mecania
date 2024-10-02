import { createContext, useContext } from 'react'

import { createContextualCan } from '@casl/react'

import { AppAbility } from '.'

export const AbilityContext = createContext<AppAbility>({} as AppAbility)
export const AbilityProvider = AbilityContext.Provider

export const useAbility = () => useContext(AbilityContext)

export const Can = createContextualCan(AbilityContext.Consumer)
export type CanProps = React.ComponentProps<typeof Can>

export type CanFunction = Parameters<NonNullable<Pick<CanProps, 'ability'>['ability']>['can']>
export type I = CanFunction['0']
export type Do = CanFunction['1']
