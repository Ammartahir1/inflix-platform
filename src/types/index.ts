export interface Tenant {
  id: string
  name: string
  slug: string
  email: string
  phone?: string | null
  dbName: string
  isActive: boolean
  createdAt: string
}

export interface PlatformStats {
  totalTenants: number
  activeTenants: number
  suspendedTenants: number
  provisionedThisMonth: number
}

export interface SuperAdminUser {
  id: string
  email: string
  role: 'super_admin'
}
