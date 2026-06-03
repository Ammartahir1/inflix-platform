'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Topbar } from '@/components/platform/Topbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { api } from '@/lib/api'

export default function NewTenantPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdPassword, setCreatedPassword] = useState('')
  const [form, setForm] = useState({ name: '', slug: '', email: '', phone: '', adminPassword: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

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
    if (form.adminPassword && form.adminPassword.length < 8) errs.adminPassword = 'Minimum 8 characters'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setError('')
    try {
      const result = await api.post('/api/admin/tenants', form)
      if (!form.adminPassword) {
        setCreatedPassword(result.tempPassword)
        setLoading(false)
        return
      }
      router.push('/dashboard/tenants')
    } catch (err: any) {
      setError(err.message ?? 'Failed to provision tenant')
      setLoading(false)
    }
  }

  const dbName = form.slug ? `inflix_${form.slug.replace(/-/g, '_')}` : ''

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
            <Input label="Admin Password" type="password" placeholder="Min 8 chars (leave blank to auto-generate)"
              value={form.adminPassword} onChange={(e) => update('adminPassword', e.target.value)}
              error={errors.adminPassword}
              hint="If left blank, a secure password will be generated and returned." />
          </div>

          <div className="card p-4 border-amber-500/20 bg-amber-500/5">
            <p className="text-xs text-amber-400 leading-relaxed">
              <strong>What happens on provisioning:</strong> A dedicated PostgreSQL database is created,
              migrations are run, an admin user is created, and a welcome email is sent automatically.
            </p>
          </div>

          {createdPassword && (
            <div className="card p-4 border-green-500/30 bg-green-500/10 flex flex-col gap-2">
              <p className="text-xs font-semibold text-green-400 uppercase tracking-wide">Tenant provisioned!</p>
              <p className="text-xs text-white/60">Save this admin password — it won't be shown again:</p>
              <code className="text-sm text-green-400 font-mono break-all">{createdPassword}</code>
              <Button size="sm" variant="outline" className="mt-1 w-fit" onClick={() => router.push('/dashboard/tenants')}>Go to Tenants</Button>
            </div>
          )}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => router.push('/dashboard/tenants')}>Cancel</Button>
            <Button type="submit" loading={loading}>{loading ? 'Provisioning…' : 'Provision Tenant'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
