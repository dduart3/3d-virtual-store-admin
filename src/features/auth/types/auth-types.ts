export interface Role {
  id: number
  name: string
  description: string
  created_at: string
}

export interface UserProfile {
  id: string
  username: string
  email: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  role_id: number
  role?: Role // Joined data
}
