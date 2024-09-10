import { Vehicle, VehicleCreate } from '@/types/entities/vehicle'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type VehiclesStore = {
  vehicles: Vehicle[]
  addVehicle: (vehicle: VehicleCreate) => void
  removeVehicle: (vehicleId?: number) => void
}

export const useVehicles = create<VehiclesStore>()(
  persist(
    set => ({
      vehicles: [],
      addVehicle: vehicle => {
        return set(state => {
          state.vehicles.push({
            ...vehicle,
            id: state.vehicles.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          return { ...state }
        })
      },
      removeVehicle: vehicleId => {
        return set(state => {
          if (!vehicleId) return state
          state.vehicles = state.vehicles.filter(c => c.id !== vehicleId)
          return { ...state }
        })
      }
    }),
    {
      name: 'vehicles',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
