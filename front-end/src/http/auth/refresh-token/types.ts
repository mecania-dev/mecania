import { User } from '@/types/entities/user'

export interface RefreshTokenRequest {
  refresh: string
}

export interface RefreshTokenResponse {
  access: string
  refresh: string
  user: User
}
