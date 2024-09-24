import { MechanicCreateInput, MechanicCreateOutput } from '@/http/user/create-mechanic'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type RegisterMechanicsStore = {
  mechanics: MechanicCreateOutput[]
  errors: { username: string; error: any }[]
  addMechanic: (mechanic: MechanicCreateOutput) => void
  removeMechanic: (index?: number) => void
  addAddress: (mechanicIndex: number, address: NonNullable<MechanicCreateInput['addresses']>[number]) => void
  removeAddress: (mechanicIndex: number, addressIndex: number) => void
  addError: (username: string, error: any) => void
}

export const useRegisterMechanics = create<RegisterMechanicsStore>()(
  persist(
    set => ({
      mechanics: [],
      errors: [],
      addMechanic: mechanic => {
        return set(state => {
          state.mechanics.push(mechanic)
          return { ...state }
        })
      },
      removeMechanic: index => {
        return set(state => {
          if (index != null) {
            const removedMechanic = state.mechanics[index]
            state.mechanics = state.mechanics.filter((_, i) => i !== index)
            state.errors = state.errors.filter(error => error.username !== removedMechanic.username)
          } else {
            state.mechanics = []
            state.errors = []
          }
          return { ...state }
        })
      },
      addAddress: (mechanicIndex, address) => {
        return set(state => {
          state.mechanics[mechanicIndex].addresses.push(address)
          return { ...state }
        })
      },
      removeAddress: (mechanicIndex, addressIndex) => {
        return set(state => {
          state.mechanics[mechanicIndex].addresses = state.mechanics[mechanicIndex].addresses.filter(
            (_, i) => i !== addressIndex
          )
          return { ...state }
        })
      },
      addError: (username, error) => {
        return set(state => {
          const existingError = state.errors.find(error => error.username === username)
          if (existingError) {
            existingError.error = error
            return { ...state }
          } else {
            state.errors.push({ username, error })
          }
          return { ...state }
        })
      }
    }),
    {
      name: 'register-mechanics'
    }
  )
)
