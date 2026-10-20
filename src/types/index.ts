export type Role = 'superadmin' | 'admin' | 'user'

export interface Profile {
  id: string
  user_id: string
  role: Role
  full_name: string | null
  email: string
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  role: Role
}
