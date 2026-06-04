'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Topbar } from '@/components/platform/Topbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { api } from '@/lib/api'
import type { Tenant } from '@/types'

export default function TenantDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '' })

  useEffect(() => {
    api.get<Tenant>(`/api/admin/tenants/${params.id}`)
      .then((t) => {
        setTenant(t)
        setForm({ name: t.name, email: t.email, phone: t.phone ?? '' })
      })
      .catch((err) => {
        if (err.message?.includes('404') || err.message?.includes('not found')) {
          setNotFound(true)
        } else {
          setError(err.message ?? 'Failed to load tenant')
        }
      })
      .finally(() => setLoading(false))
  }, [params.id])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!tenant) return
    setSaving(true)
    setError('')
    try {
      const updated = await api.patch<Tenant>(`/api/admin/tenants/${tenant.id}`, {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
      })
      setTenant(updated)
    } catch (err: any) {
      setError(err.message ?? 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus() {
    if (!tenant) return
    setSaving(true)
    setError('')
    try {
      const updated = await api.patch<Tenant>(`/api/admin/tenants/${tenant.id}`, {
        isActive: !tenant.isActive,
      })
      setTenant(updated)
    } catch (err: any) {
      setError(err.message ?? 'Failed to update status')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          title="Loading…"
          subtitle=""
          action={<Link href="/dashboard/tenants"><Button variant="ghost" size="sm">← Tenants</Button></Link>}
        />
        <div className="flex-1 p-6">
          <p className="text-white/40 text-sm">Loading tenant…</p>
        </div>
      </div>
    )
  }

  if (notFound || !tenant) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          title="Tenant Not Found"
          subtitle=""
          action={<Link href="/dashboard/tenants"><Button variant="ghost" size="sm">← Tenants</Button></Link>}
        />
        <div className="flex-1 p-6">
          <p className="text-white/40 text-sm">This tenant does not exist.</p>
          <Button className="mt-4" onClick={() => router.push('/dashboard/tenants')}>Back to Tenants</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar
        title={tenant.name}
        subtitle={`${tenant.slug}.inflix.uk`}
        action={
          <Link href="/dashboard/tenants">
            <Button variant="ghost" size="sm">← Tenants</Button>
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 max-w-xl">
        {/* Status card */}
        <div className="card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wide">Status</p>
            <Badge variant={tenant.isActive ? 'green' : 'red'} className="mt-1">
              {tenant.isActive ? 'Active' : 'Suspended'}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">Since {formatDate(tenant.createdAt)}</span>
            <Button
              variant={tenant.isActive ? 'danger' : 'gold'}
              size="sm"
              onClick={toggleStatus}
              loading={saving}
            >
              {tenant.isActive ? 'Suspend' : 'Reactivate'}
            </Button>
          </div>
        </div>

        {/* Database info */}
        <div className="card p-4 flex flex-col gap-2">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">
            Infrastructure
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Database</span>
            <span className="font-mono text-xs text-white/80 bg-white/10 px-2 py-1 rounded">
              {tenant.dbName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Store URL</span>
            <span className="font-mono text-xs text-gold">
              {tenant.slug}.inflix.uk
            </span>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSave} className="card p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">
            Tenant Details
          </p>
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wide block mb-1">
              Slug
            </label>
            <p className="input bg-ink-muted/50 text-white/40 cursor-not-allowed select-none">
              {tenant.slug}
            </p>
          </div>
          <Input
            label="Business Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Admin Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" loading={saving} className="w-fit">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  )
}
