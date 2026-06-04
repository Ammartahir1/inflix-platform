'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { setToken, setUser } from '@/lib/auth'
import { Logo } from '@/components/ui/Logo'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'super_admin' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Invalid credentials')
      setToken(data.token)
      setUser({ id: data.user?.id ?? 'sa', email, role: 'super_admin' })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message ?? 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Logo size="xl" />
          <p className="text-white/40 text-sm mt-2">Platform â€” Super Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="superadmin@inflix.uk" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          <Input label="Password" type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" loading={loading} size="lg" className="w-full mt-1">Sign In</Button>
        </form>

        <p className="text-center text-xs text-white/20 mt-6">Restricted to Inflix super admins only</p>
      </div>
    </div>
  )
}
