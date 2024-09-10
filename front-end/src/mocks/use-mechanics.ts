import { generateCNPJ } from '@/lib/utils'
import { Mechanic } from '@/types/entities/mechanic'
import { faker } from '@faker-js/faker'
import { random, sampleSize } from 'lodash'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { initialServices } from './use-services'

const initialMechanics: Mechanic[] = [
  {
    id: 1,
    firstName: 'Oficina Curitiba',
    lastName: '',
    fiscalIdentification: generateCNPJ(),
    avatarUrl: faker.image.avatarGitHub(),
    username: 'oficinacuritiba',
    email: 'oficinacuritiba@gmail.com',
    phoneNumber: '(41) 99999-9999',
    rating: random(1, 5, true),
    addresses: [
      {
        id: 1,
        userId: 1,
        country: 'Brasil',
        state: 'PR',
        city: 'Curitiba',
        neighborhood: 'Centro',
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 1',
        zip: '80000-000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    services: sampleSize(initialServices, 5),
    groups: ['Mechanic'],
    userPermissions: [],
    isActive: true,
    isStaff: false,
    isSuperuser: false,
    lastLogin: new Date().toISOString(),
    dateJoined: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    firstName: 'Oficina Santa Felicidade',
    lastName: '',
    fiscalIdentification: generateCNPJ(),
    avatarUrl: faker.image.avatarGitHub(),
    username: 'oficinasantafelicidade',
    email: 'oficinasantafelicidade@gmail.com',
    phoneNumber: '(41) 99999-9999',
    rating: random(1, 5, true),
    addresses: [
      {
        id: 2,
        userId: 2,
        country: 'Brasil',
        state: 'PR',
        city: 'Curitiba',
        neighborhood: 'Santa Felicidade',
        street: 'Avenida Manoel Ribas',
        number: '456',
        complement: 'Casa',
        zip: '82000-000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    services: sampleSize(initialServices, 5),
    groups: ['Mechanic'],
    userPermissions: [],
    isActive: true,
    isStaff: false,
    isSuperuser: false,
    lastLogin: new Date().toISOString(),
    dateJoined: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    firstName: 'Oficina Ecoville',
    lastName: '',
    fiscalIdentification: generateCNPJ(),
    avatarUrl: faker.image.avatarGitHub(),
    username: 'oficinaecoville',
    email: 'oficinaecoville@gmail.com',
    phoneNumber: '(41) 99999-9999',
    rating: random(1, 5, true),
    addresses: [
      {
        id: 3,
        userId: 3,
        country: 'Brasil',
        state: 'PR',
        city: 'Curitiba',
        neighborhood: 'Ecoville',
        street: 'Rua Professor Pedro Viriato Parigot de Souza',
        number: '789',
        complement: 'Bloco 2',
        zip: '81200-000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    services: sampleSize(initialServices, 5),
    groups: ['Mechanic'],
    userPermissions: [],
    isActive: true,
    isStaff: false,
    isSuperuser: false,
    lastLogin: new Date().toISOString(),
    dateJoined: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    firstName: 'Oficina Batel',
    lastName: '',
    fiscalIdentification: generateCNPJ(),
    avatarUrl: faker.image.avatarGitHub(),
    username: 'oficinabatel',
    email: 'oficinabatel@gmail.com',
    phoneNumber: '(41) 99999-9999',
    rating: random(1, 5, true),
    addresses: [
      {
        id: 4,
        userId: 4,
        country: 'Brasil',
        state: 'PR',
        city: 'Curitiba',
        neighborhood: 'Batel',
        street: 'Avenida do Batel',
        number: '101',
        complement: 'Sala 5',
        zip: '80420-090',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    services: sampleSize(initialServices, 5),
    groups: ['Mechanic'],
    userPermissions: [],
    isActive: true,
    isStaff: false,
    isSuperuser: false,
    lastLogin: new Date().toISOString(),
    dateJoined: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    firstName: 'Oficina Santo Inácio',
    lastName: '',
    fiscalIdentification: generateCNPJ(),
    avatarUrl: faker.image.avatarGitHub(),
    username: 'oficinasantoinacio',
    email: 'oficinasantoinacio@gmail.com',
    phoneNumber: '(41) 99999-9999',
    rating: random(1, 5, true),
    addresses: [
      {
        id: 5,
        userId: 5,
        country: 'Brasil',
        state: 'PR',
        city: 'Curitiba',
        neighborhood: 'Santo Inácio',
        street: 'Rua Mato Grosso',
        number: '202',
        complement: 'Loja 1',
        zip: '80330-000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    services: sampleSize(initialServices, 5),
    groups: ['Mechanic'],
    userPermissions: [],
    isActive: true,
    isStaff: false,
    isSuperuser: false,
    lastLogin: new Date().toISOString(),
    dateJoined: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 6,
    firstName: 'Oficina Água Verde',
    lastName: '',
    fiscalIdentification: generateCNPJ(),
    avatarUrl: faker.image.avatarGitHub(),
    username: 'oficinaaguaverde',
    email: 'oficinaaguaverde@gmail.com',
    phoneNumber: '(41) 99999-9999',
    rating: random(1, 5, true),
    addresses: [
      {
        id: 6,
        userId: 6,
        country: 'Brasil',
        state: 'PR',
        city: 'Curitiba',
        neighborhood: 'Água Verde',
        street: 'Rua Guilherme Pugsley',
        number: '404',
        complement: 'Bloco 3',
        zip: '80240-020',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    services: sampleSize(initialServices, 5),
    groups: ['Mechanic'],
    userPermissions: [],
    isActive: true,
    isStaff: false,
    isSuperuser: false,
    lastLogin: new Date().toISOString(),
    dateJoined: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 7,
    firstName: 'Oficina Juvevê',
    lastName: '',
    fiscalIdentification: generateCNPJ(),
    avatarUrl: faker.image.avatarGitHub(),
    username: 'oficinajuveve',
    email: 'oficinajuveve@gmail.com',
    phoneNumber: '(41) 99999-9999',
    rating: random(1, 5, true),
    addresses: [
      {
        id: 7,
        userId: 7,
        country: 'Brasil',
        state: 'PR',
        city: 'Curitiba',
        neighborhood: 'Juvevê',
        street: 'Rua Alberto Bolliger',
        number: '505',
        complement: 'Casa',
        zip: '80035-010',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    services: sampleSize(initialServices, 5),
    groups: ['Mechanic'],
    userPermissions: [],
    isActive: true,
    isStaff: false,
    isSuperuser: false,
    lastLogin: new Date().toISOString(),
    dateJoined: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 8,
    firstName: 'Oficina Rebouças',
    lastName: '',
    fiscalIdentification: generateCNPJ(),
    avatarUrl: faker.image.avatarGitHub(),
    username: 'oficinareboucas',
    email: 'oficinareboucas@gmail.com',
    phoneNumber: '(41) 99999-9999',
    rating: random(1, 5, true),
    addresses: [
      {
        id: 8,
        userId: 8,
        country: 'Brasil',
        state: 'PR',
        city: 'Curitiba',
        neighborhood: 'Rebouças',
        street: 'Avenida Silva Jardim',
        number: '1510',
        complement: 'Apto 4',
        zip: '80230-000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    services: sampleSize(initialServices, 5),
    groups: ['Mechanic'],
    userPermissions: [],
    isActive: true,
    isStaff: false,
    isSuperuser: false,
    lastLogin: new Date().toISOString(),
    dateJoined: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 9,
    firstName: 'Oficina Portão',
    lastName: '',
    fiscalIdentification: generateCNPJ(),
    avatarUrl: faker.image.avatarGitHub(),
    username: 'oficinaporto',
    email: 'oficinaporto@gmail.com',
    phoneNumber: '(41) 99999-9999',
    rating: random(1, 5, true),
    addresses: [
      {
        id: 9,
        userId: 9,
        country: 'Brasil',
        state: 'PR',
        city: 'Curitiba',
        neighborhood: 'Portão',
        street: 'Rua João Bettega',
        number: '222',
        complement: 'Bloco A',
        zip: '81070-000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    services: sampleSize(initialServices, 5),
    groups: ['Mechanic'],
    userPermissions: [],
    isActive: true,
    isStaff: false,
    isSuperuser: false,
    lastLogin: new Date().toISOString(),
    dateJoined: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 10,
    firstName: 'Oficina Boqueirão',
    lastName: '',
    fiscalIdentification: generateCNPJ(),
    avatarUrl: faker.image.avatarGitHub(),
    username: 'oficinaboqueirao',
    email: 'oficinaboqueirao@gmail.com',
    phoneNumber: '(41) 99999-9999',
    rating: random(1, 5, true),
    addresses: [
      {
        id: 10,
        userId: 10,
        country: 'Brasil',
        state: 'PR',
        city: 'Curitiba',
        neighborhood: 'Boqueirão',
        street: 'Rua Paulo Setúbal',
        number: '303',
        complement: 'Apto 15',
        zip: '81730-000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    services: sampleSize(initialServices, 5),
    groups: ['Mechanic'],
    userPermissions: [],
    isActive: true,
    isStaff: false,
    isSuperuser: false,
    lastLogin: new Date().toISOString(),
    dateJoined: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 11,
    firstName: 'Oficina Pinheirinho',
    lastName: '',
    fiscalIdentification: generateCNPJ(),
    avatarUrl: faker.image.avatarGitHub(),
    username: 'oficinapinheirinho',
    email: 'oficinapinheirinho@gmail.com',
    phoneNumber: '(41) 99999-9999',
    rating: random(1, 5, true),
    addresses: [
      {
        id: 11,
        userId: 11,
        country: 'Brasil',
        state: 'PR',
        city: 'Curitiba',
        neighborhood: 'Pinheirinho',
        street: 'Rua Nicola Pelanda',
        number: '404',
        complement: 'Loja 3',
        zip: '81830-000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    services: sampleSize(initialServices, 5),
    groups: ['Mechanic'],
    userPermissions: [],
    isActive: true,
    isStaff: false,
    isSuperuser: false,
    lastLogin: new Date().toISOString(),
    dateJoined: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 12,
    firstName: 'Oficina Fazendinha',
    lastName: '',
    fiscalIdentification: generateCNPJ(),
    avatarUrl: faker.image.avatarGitHub(),
    username: 'oficinafazendinha',
    email: 'oficinafazendinha@gmail.com',
    phoneNumber: '(41) 99999-9999',
    rating: random(1, 5, true),
    addresses: [
      {
        id: 12,
        userId: 12,
        country: 'Brasil',
        state: 'PR',
        city: 'Curitiba',
        neighborhood: 'Fazendinha',
        street: 'Rua Carlos Klemtz',
        number: '505',
        complement: 'Casa',
        zip: '81320-000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    services: sampleSize(initialServices, 5),
    groups: ['Mechanic'],
    userPermissions: [],
    isActive: true,
    isStaff: false,
    isSuperuser: false,
    lastLogin: new Date().toISOString(),
    dateJoined: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 13,
    firstName: 'Oficina Mercês',
    lastName: '',
    fiscalIdentification: generateCNPJ(),
    avatarUrl: faker.image.avatarGitHub(),
    username: 'oficinamerces',
    email: 'oficinamerces@gmail.com',
    phoneNumber: '(41) 99999-9999',
    rating: random(1, 5, true),
    addresses: [
      {
        id: 13,
        userId: 13,
        country: 'Brasil',
        state: 'PR',
        city: 'Curitiba',
        neighborhood: 'Mercês',
        street: 'Rua Jacarezinho',
        number: '606',
        complement: 'Apto 6',
        zip: '80810-000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    services: sampleSize(initialServices, 5),
    groups: ['Mechanic'],
    userPermissions: [],
    isActive: true,
    isStaff: false,
    isSuperuser: false,
    lastLogin: new Date().toISOString(),
    dateJoined: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 14,
    firstName: 'Oficina Vila Izabel',
    lastName: '',
    fiscalIdentification: generateCNPJ(),
    avatarUrl: faker.image.avatarGitHub(),
    username: 'oficinavilalizabel',
    email: 'oficinavilalizabel@gmail.com',
    phoneNumber: '(41) 99999-9999',
    rating: random(1, 5, true),
    addresses: [
      {
        id: 14,
        userId: 14,
        country: 'Brasil',
        state: 'PR',
        city: 'Curitiba',
        neighborhood: 'Vila Izabel',
        street: 'Rua Bororós',
        number: '707',
        complement: 'Bloco C',
        zip: '80320-000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    services: sampleSize(initialServices, 5),
    groups: ['Mechanic'],
    userPermissions: [],
    isActive: true,
    isStaff: false,
    isSuperuser: false,
    lastLogin: new Date().toISOString(),
    dateJoined: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 15,
    firstName: 'Oficina Ahú',
    lastName: '',
    fiscalIdentification: generateCNPJ(),
    avatarUrl: faker.image.avatarGitHub(),
    username: 'oficinaahu',
    email: 'oficinaahu@gmail.com',
    phoneNumber: '(41) 99999-9999',
    rating: random(1, 5, true),
    addresses: [
      {
        id: 15,
        userId: 15,
        country: 'Brasil',
        state: 'PR',
        city: 'Curitiba',
        neighborhood: 'Ahú',
        street: 'Rua Colombo',
        number: '808',
        complement: 'Loja 2',
        zip: '80540-000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    services: sampleSize(initialServices, 5),
    groups: ['Mechanic'],
    userPermissions: [],
    isActive: true,
    isStaff: false,
    isSuperuser: false,
    lastLogin: new Date().toISOString(),
    dateJoined: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

type MechanicsStore = {
  mechanics: Mechanic[]
}

export const useMechanics = create<MechanicsStore>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set => ({
      mechanics: []
    }),
    {
      name: 'mechanics',
      storage: createJSONStorage(() => sessionStorage),
      merge: () => ({ mechanics: initialMechanics })
    }
  )
)
