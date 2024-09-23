import { MechanicCreateInput, MechanicCreateOutput } from '@/http/user/create-mechanic'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type RegisterMechanicsStore = {
  mechanics: MechanicCreateOutput[]
  addMechanic: (mechanic: MechanicCreateOutput) => void
  removeMechanic: (index?: number) => void
  addAddress: (mechanicIndex: number, address: NonNullable<MechanicCreateInput['addresses']>[number]) => void
  removeAddress: (mechanicIndex: number, addressIndex: number) => void
}

export const useRegisterMechanics = create<RegisterMechanicsStore>()(
  persist(
    set => ({
      mechanics: [],
      addMechanic: mechanic => {
        return set(state => {
          state.mechanics.push(mechanic)
          return { ...state }
        })
      },
      removeMechanic: index => {
        return set(state => {
          if (index) {
            state.mechanics = state.mechanics.filter((_, i) => i !== index)
          } else {
            state.mechanics = []
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
      }
    }),
    {
      name: 'register-mechanics'
    }
  )
)
