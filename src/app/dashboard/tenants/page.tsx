'use client'

import { useEffect, useState } from 'react'
import { Topbar } from '@/components/platform/Topbar'
import { TenantsTable } from '@/components/platform/TenantsTable'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import type { Tenant } from '@/types'

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get<Tenant[]>('/api/admin/tenants')
      .then(setTenants)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const active = tenants.filter((t) => t.isActive).length

  // Filter tenants by name or email
  const filtered = tenants.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar
        title="Tenants"
        subtitle={loading ? 'Loading…' : `${filtered.length} of ${tenants.length} total · ${active} active`}
        action={
          <Link href="/dashboard/tenants/new">
            <Button>+ Provision Tenant</Button>
          </Link>
        }
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search by tenant name or email…',
        }}
      />
      <div className="flex-1 overflow-y-auto p-6">
        {loading
          ? <p className="text-white/40 text-sm">Loading tenants…</p>
          : <TenantsTable tenants={filtered} />}
      </div>
    </div>
  )
}
