import { Service, ServiceCreate } from '@/types/entities/service'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const initialServices: Service[] = [
  {
    id: 1,
    name: 'Troca de Óleo',
    description: 'Trocar o óleo e o filtro de óleo',
    category: 'Manutenção',
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Rodízio de Pneus',
    description: 'Rodiziar os pneus',
    category: 'Manutenção',
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Substituição das Pastilhas de Freio',
    description: 'Substituir as pastilhas de freio',
    category: 'Reparo',
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Diagnóstico de Motor',
    description: 'Diagnosticar problemas no motor',
    category: 'Problemas Mecânicos - Motor e Exaustão',
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Alinhamento e Balanceamento',
    description: 'Alinhar e balancear as rodas',
    category: 'Manutenção',
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Revisão de Suspensão',
    description: 'Revisar e ajustar a suspensão do veículo',
    category: 'Manutenção',
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 7,
    name: 'Troca de Bateria',
    description: 'Substituir a bateria do veículo',
    category: 'Manutenção',
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 8,
    name: 'Reparação de Sistema Elétrico',
    description: 'Reparar problemas no sistema elétrico',
    category: 'Reparo',
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 9,
    name: 'Inspeção de Emissões',
    description: 'Verificar as emissões do veículo',
    category: 'Inspeção',
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 10,
    name: 'Troca de Velas',
    description: 'Substituir as velas de ignição',
    category: 'Manutenção',
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 11,
    name: 'Reparo de Transmissão',
    description: 'Reparar a transmissão do veículo',
    category: 'Reparo',
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 12,
    name: 'Troca de Correia Dentada',
    description: 'Substituir a correia dentada',
    category: 'Manutenção',
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 13,
    name: 'Reparo de Ar-Condicionado',
    description: 'Reparar o sistema de ar-condicionado',
    category: 'Reparo',
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 14,
    name: 'Revisão de Freios',
    description: 'Revisar e ajustar os freios do veículo',
    category: 'Manutenção',
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 15,
    name: 'Pintura e Funilaria',
    description: 'Reparar e pintar a carroceria do veículo',
    category: 'Reparo',
    vehicleType: 'Car',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

type ServicesStore = {
  services: Service[]
  addService: (service: ServiceCreate) => void
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
