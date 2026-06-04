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

interface AdminUser { id: string; email: string; name: string; role: string; createdAt: string }

function ResetPasswordForm({ userId, onReset, resetting }: {
  userId: string
  onReset: (id: string, password: string) => void
  resetting: boolean
}) {
  const [show, setShow] = useState(false)
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    if (pw.length < 8) { setErr('Min. 8 characters'); return }
    if (pw !== confirm) { setErr('Passwords do not match'); return }
    onReset(userId, pw)
    setPw(''); setConfirm(''); setShow(false)
  }

  if (!show) return (
    <button onClick={() => setShow(true)} className="text-xs text-white/30 hover:text-white/60 transition-colors text-left">
      + Set custom password
    </button>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-1">
      <div className="flex gap-2">
        <Input placeholder="New password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
        <Input placeholder="Confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>
      {err && <p className="text-red-400 text-xs">{err}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={resetting}>Set Password</Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setShow(false)}>Cancel</Button>
      </div>
    </form>
  )
}

export default function TenantDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '' })

  // Admin users state
  const [users, setUsers] = useState<AdminUser[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [showNewUser, setShowNewUser] = useState(false)
  const [newUser, setNewUser] = useState({ email: '', name: '', password: '', confirm: '' })
  const [newUserError, setNewUserError] = useState('')
  const [newUserSaving, setNewUserSaving] = useState(false)
  const [resetResults, setResetResults] = useState<Record<string, string>>({})
  const [resetting, setResetting] = useState<string | null>(null)

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

    // Load admin users
    setUsersLoading(true)
    api.get<AdminUser[]>(`/api/admin/tenants/${params.id}/users`)
      .then(setUsers)
      .catch(() => {})
      .finally(() => setUsersLoading(false))
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

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setNewUserError('')
    if (!newUser.email || !newUser.password) { setNewUserError('Email and password required'); return }
    if (newUser.password.length < 8) { setNewUserError('Password must be at least 8 characters'); return }
    if (newUser.password !== newUser.confirm) { setNewUserError('Passwords do not match'); return }
    setNewUserSaving(true)
    try {
      const user = await api.post<AdminUser>(`/api/admin/tenants/${params.id}/users`, {
        email: newUser.email, name: newUser.name || newUser.email, password: newUser.password,
      })
      setUsers((prev) => [...prev, user])
      setNewUser({ email: '', name: '', password: '', confirm: '' })
      setShowNewUser(false)
    } catch (err: any) {
      setNewUserError(err.message ?? 'Failed to create user')
    } finally {
      setNewUserSaving(false)
    }
  }

  async function handleResetPassword(userId: string, customPassword?: string) {
    setResetting(userId)
    try {
      const { tempPassword } = await api.post<{ tempPassword: string }>(
        `/api/admin/tenants/${params.id}/users/${userId}/reset-password`,
        customPassword ? { password: customPassword } : {}
      )
      setResetResults((prev) => ({ ...prev, [userId]: tempPassword }))
    } catch (err: any) {
      alert(err.message ?? 'Failed to reset password')
    } finally {
      setResetting(null)
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

        {/* ── Admin Users ── */}
        <div className="card p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">Admin Users</p>
            <Button size="sm" onClick={() => setShowNewUser(!showNewUser)}>
              {showNewUser ? 'Cancel' : '+ Add User'}
            </Button>
          </div>

          {/* Create user form */}
          {showNewUser && (
            <form onSubmit={handleCreateUser} className="flex flex-col gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/10">
              <p className="text-xs font-semibold text-white/50">New Admin User</p>
              <Input label="Email" type="email" placeholder="admin@example.com"
                value={newUser.email} onChange={(e) => setNewUser((u) => ({ ...u, email: e.target.value }))} required />
              <Input label="Name (optional)" placeholder="John Smith"
                value={newUser.name} onChange={(e) => setNewUser((u) => ({ ...u, name: e.target.value }))} />
              <Input label="Password" type="password" placeholder="Min. 8 characters"
                value={newUser.password} onChange={(e) => setNewUser((u) => ({ ...u, password: e.target.value }))} required />
              <Input label="Confirm Password" type="password" placeholder="Repeat password"
                value={newUser.confirm} onChange={(e) => setNewUser((u) => ({ ...u, confirm: e.target.value }))} required />
              {newUserError && <p className="text-red-400 text-sm">{newUserError}</p>}
              <div className="flex gap-2">
                <Button type="submit" size="sm" loading={newUserSaving}>Create User</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setShowNewUser(false)}>Cancel</Button>
              </div>
            </form>
          )}

          {/* Users list */}
          {usersLoading ? (
            <p className="text-white/30 text-sm">Loading users…</p>
          ) : users.length === 0 ? (
            <p className="text-white/30 text-sm">No admin users found.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {users.map((u) => (
                <div key={u.id} className="flex flex-col gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{u.name}</p>
                      <p className="text-xs text-white/40">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline"
                        loading={resetting === u.id}
                        onClick={() => handleResetPassword(u.id)}>
                        Generate Temp
                      </Button>
                    </div>
                  </div>

                  {/* Temp password result */}
                  {resetResults[u.id] && (
                    <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-lg px-3 py-2">
                      <p className="text-xs text-white/50 shrink-0">New password:</p>
                      <code className="text-sm text-gold font-mono flex-1">{resetResults[u.id]}</code>
                      <button onClick={() => { navigator.clipboard.writeText(resetResults[u.id]); }}
                        className="text-white/30 hover:text-white/70 transition-colors shrink-0" title="Copy">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Custom password reset */}
                  <ResetPasswordForm userId={u.id} onReset={handleResetPassword} resetting={resetting === u.id} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
