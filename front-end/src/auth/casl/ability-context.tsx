import { createContext, useContext } from 'react'

import { createContextualCan } from '@casl/react'

import { AppAbility } from '.'

export const AbilityContext = createContext<AppAbility>({} as AppAbility)
export const AbilityProvider = AbilityContext.Provider

export const useAbility = () => useContext(AbilityContext)

export const Can = createContextualCan(AbilityContext.Consumer)
export type CanProps = React.ComponentProps<typeof Can>
