const TOKEN_KEY = 'inflix_platform_token'
const USER_KEY = 'inflix_platform_user'

export interface SuperAdminUser {
  id: string
  email: string
  role: 'super_admin'
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getUser(): SuperAdminUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function setUser(user: SuperAdminUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
