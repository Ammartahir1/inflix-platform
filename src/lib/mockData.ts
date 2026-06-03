import type { Tenant, PlatformStats } from '@/types'

export const mockTenants: Tenant[] = [
  {
    id: 'ten-1',
    name: 'Demo Wholesale',
    slug: 'demo',
    email: 'admin@demo.inflix.co.uk',
    phone: '+447700000000',
    dbName: 'inflix_demo',
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ten-2',
    name: 'Northern Parts Ltd',
    slug: 'northern-parts',
    email: 'admin@northern-parts.inflix.co.uk',
    phone: '+447700111000',
    dbName: 'inflix_northern_parts',
    isActive: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ten-3',
    name: 'London Mobile Supply',
    slug: 'london-mobile',
    email: 'admin@london-mobile.inflix.co.uk',
    phone: null,
    dbName: 'inflix_london_mobile',
    isActive: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ten-4',
    name: 'Midlands Tech',
    slug: 'midlands-tech',
    email: 'admin@midlands-tech.inflix.co.uk',
    phone: '+447711222333',
    dbName: 'inflix_midlands_tech',
    isActive: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockStats: PlatformStats = {
  totalTenants: mockTenants.length,
  activeTenants: mockTenants.filter((t) => t.isActive).length,
  suspendedTenants: mockTenants.filter((t) => !t.isActive).length,
  provisionedThisMonth: mockTenants.filter(
    (t) => new Date(t.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  ).length,
}
