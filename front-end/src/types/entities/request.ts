import { Chat } from './chat'
import { User } from './user'

export interface Request {
  id: number
  chat: Chat
  driver: User
  mechanic: User
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  updatedAt: string
}

export type RequestCreate = Pick<Request, 'chat' | 'driver' | 'mechanic' | 'message'>
