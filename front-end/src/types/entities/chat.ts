import { Message } from './message'
import { Service } from './service'
import { User } from './user'

export interface Chat {
  id?: number
  title: string
  users: User[]
  messages: Message[]
  status: 'active' | 'closed'
  recommendations?: Service[]
  createdAt: string
  updatedAt: string
}
