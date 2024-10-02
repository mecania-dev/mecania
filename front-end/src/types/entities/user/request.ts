import { User } from '.'
import { Chat } from '../chat'

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
