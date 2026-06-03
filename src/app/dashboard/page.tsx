'use client'

import { useEffect, useState } from 'react'
import { Topbar } from '@/components/platform/Topbar'
import { StatsCard } from '@/components/platform/StatsCard'
import { TenantsTable } from '@/components/platform/TenantsTable'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import type { Tenant, PlatformStats } from '@/types'

export default function DashboardPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Tenant[]>('/api/admin/tenants')
      .then(setTenants)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats: PlatformStats = {
    totalTenants: tenants.length,
    activeTenants: tenants.filter((t) => t.isActive).length,
    suspendedTenants: tenants.filter((t) => !t.isActive).length,
    provisionedThisMonth: tenants.filter(
      (t) => new Date(t.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    ).length,
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar
        title="Platform Overview"
        subtitle={loading ? 'Loading…' : `${stats.totalTenants} tenants · ${stats.activeTenants} active`}
        action={
          <Link href="/dashboard/tenants/new">
            <Button>+ New Tenant</Button>
          </Link>
        }
      />
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Tenants" value={stats.totalTenants} icon="🏢" />
          <StatsCard label="Active" value={stats.activeTenants} icon="✅" variant="success" />
          <StatsCard label="Suspended" value={stats.suspendedTenants} icon="⛔" variant={stats.suspendedTenants > 0 ? 'danger' : 'default'} />
          <StatsCard label="New This Month" value={stats.provisionedThisMonth} icon="🆕" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wide mb-3">All Tenants</h2>
          {loading
            ? <p className="text-white/40 text-sm">Loading tenants…</p>
            : <TenantsTable tenants={tenants} />}
        </div>
      </div>
    </div>
  )
}
