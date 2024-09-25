import { Service } from '@/types/entities/service'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const initialServices: Service[] = [
  {
    id: 1,
    name: 'Troca de Óleo',
    description: 'Trocar o óleo e o filtro de óleo',
    category: {
      id: 1,
      name: 'Troca de Óleo',
      description: 'Troca de óleo e filtro de óleo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

type ServicesStore = {
  services: Service[]
  addService: (service: Service) => void
  removeService: (serviceId?: number) => void
}

export const useServices = create<ServicesStore>()(
  persist(
    set => ({
      services: initialServices,
      addService: service => {
        return set(state => {
          state.services.push({
            ...service,
            id: state.services.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          return { ...state }
        })
      },
      removeService: serviceId => {
        return set(state => {
          if (!serviceId) return state
          state.services = state.services.filter(c => c.id !== serviceId)
          return { ...state }
        })
      }
    }),
    {
      name: 'services',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
