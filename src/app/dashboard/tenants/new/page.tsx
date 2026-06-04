'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Topbar } from '@/components/platform/Topbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { api } from '@/lib/api'

interface ProvisionResult {
  tenant: { id: string; name: string; slug: string; email: string }
  tempPassword: string
}

export default function NewTenantPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', slug: '', email: '', phone: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [result, setResult] = useState<ProvisionResult | null>(null)
  const [copied, setCopied] = useState(false)

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  function autoSlug(name: string) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    update('slug', slug)
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.slug.trim()) errs.slug = 'Required'
    else if (!/^[a-z0-9-]+$/.test(form.slug)) errs.slug = 'Lowercase letters, numbers and hyphens only'
    if (!form.email.trim()) errs.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setError('')
    try {
      const data = await api.post<ProvisionResult>('/api/admin/tenants', form)
      setResult(data)
    } catch (err: any) {
      setError(err.message ?? 'Failed to provision tenant')
    } finally {
      setLoading(false)
    }
  }

  function copyPassword() {
    if (result) {
      navigator.clipboard.writeText(result.tempPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const dbName = form.slug ? `inflix_${form.slug.replace(/-/g, '_')}` : ''

  // ── SUCCESS STATE ──────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          title="Tenant Provisioned"
          subtitle="The new wholesaler account is ready"
          action={<Link href="/dashboard/tenants"><Button variant="ghost" size="sm">← Tenants</Button></Link>}
        />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-lg flex flex-col gap-4">

            {/* Success banner */}
            <div className="card p-5 border-emerald-500/30 bg-emerald-500/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-white">{result.tenant.name}</p>
                  <p className="text-sm text-white/50">Provisioned successfully</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                <div><p className="text-white/40 text-xs">Slug</p><p className="text-white font-mono">{result.tenant.slug}</p></div>
                <div><p className="text-white/40 text-xs">Email</p><p className="text-white">{result.tenant.email}</p></div>
              </div>
            </div>

            {/* Temp password — must be shared with the admin */}
            <div className="card p-5 border-amber-500/30 bg-amber-500/10">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-3">
                ⚠️ Temporary Password — Share with Admin
              </p>
              <div className="flex items-center gap-3">
                <code className="flex-1 bg-black/40 rounded px-4 py-3 text-white font-mono text-lg tracking-widest">
                  {result.tempPassword}
                </code>
                <Button variant="ghost" size="sm" onClick={copyPassword}>
                  {copied ? '✓ Copied' : 'Copy'}
                </Button>
              </div>
              <p className="text-xs text-amber-400/70 mt-3">
                This password is shown <strong>once only</strong>. The admin logs in at{' '}
                <span className="font-mono">desk.inflix.uk</span> with their email and this password.
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/dashboard/tenants">
                <Button variant="ghost">Back to Tenants</Button>
              </Link>
              <Link href="/dashboard/tenants/new">
                <Button onClick={() => setResult(null)}>Provision Another</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── FORM STATE ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar
        title="Provision Tenant"
        subtitle="Create a new wholesaler account with a dedicated database"
        action={<Link href="/dashboard/tenants"><Button variant="ghost" size="sm">← Tenants</Button></Link>}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg">
          <div className="card p-5 flex flex-col gap-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">Business Details</p>
            <Input label="Business Name" placeholder="e.g. Northern Parts Ltd" value={form.name}
              onChange={(e) => { update('name', e.target.value); if (!form.slug) autoSlug(e.target.value) }}
              error={errors.name} />
            <Input label="Slug" placeholder="e.g. northern-parts" value={form.slug}
              onChange={(e) => update('slug', e.target.value.toLowerCase())} error={errors.slug}
              hint={form.slug ? `Store: ${form.slug}.inflix.co.uk  ·  DB: ${dbName}` : 'Auto-generated from business name'} />
            <Input label="Admin Email" type="email" placeholder="admin@theirdomain.co.uk" value={form.email}
              onChange={(e) => update('email', e.target.value)} error={errors.email} />
            <Input label="Phone (optional)" type="tel" placeholder="+44 7700 000000" value={form.phone}
              onChange={(e) => update('phone', e.target.value)} />
          </div>

          <div className="card p-4 border-amber-500/20 bg-amber-500/5">
            <p className="text-xs text-amber-400 leading-relaxed">
              <strong>What happens on provisioning:</strong> A dedicated PostgreSQL database is created,
              migrations run, an admin user is created, and a temporary password is shown once.
              Share it with the admin so they can log in at <strong>desk.inflix.uk</strong>.
            </p>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3">
            <Link href="/dashboard/tenants"><Button type="button" variant="ghost">Cancel</Button></Link>
            <Button type="submit" loading={loading}>{loading ? 'Provisioning…' : 'Provision Tenant'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
