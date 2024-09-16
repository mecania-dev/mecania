// auth/AbilityContext.tsx
import { createContext, useContext } from 'react'

import { AppAbility } from '@/auth'
import { createContextualCan } from '@casl/react'

export const AbilityContext = createContext<AppAbility>({} as AppAbility)
export const AbilityProvider = AbilityContext.Provider

export const Can = createContextualCan(AbilityContext.Consumer)
export type CanProps = React.ComponentProps<typeof Can>

export const useAbility = () => useContext(AbilityContext)
