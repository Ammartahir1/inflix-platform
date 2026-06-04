'use client'

import { useEffect, useState } from 'react'
import { Topbar } from '@/components/platform/Topbar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'

interface Application {
  id: string
  businessName: string
  slug: string
  email: string
  phone?: string | null
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    api.get<Application[]>('/api/admin/applications')
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function approve(id: string) {
    setActionId(id)
    try {
      await api.post(`/api/admin/applications/${id}/approve`, {})
      setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: 'approved' } : a))
    } catch (err: any) {
      alert(err.message ?? 'Failed to approve')
    } finally {
      setActionId(null)
    }
  }

  async function reject(id: string) {
    setActionId(id)
    try {
      await api.post(`/api/admin/applications/${id}/reject`, {})
      setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: 'rejected' } : a))
    } catch (err: any) {
      alert(err.message ?? 'Failed to reject')
    } finally {
      setActionId(null)
    }
  }

  const pending = applications.filter((a) => a.status === 'pending').length

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar
        title="Applications"
        subtitle={loading ? 'Loading…' : `${applications.length} total · ${pending} pending`}
      />
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-white/40 text-sm">Loading applications…</p>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-white/40 text-sm">No applications yet.</p>
            <p className="text-white/25 text-xs mt-1">Wholesalers can apply at desk.inflix.uk/auth/register</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-white/40 text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Business</th>
                  <th className="text-left px-4 py-3">Slug</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Applied</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{app.businessName}</td>
                    <td className="px-4 py-3 font-mono text-white/60 text-xs">{app.slug}</td>
                    <td className="px-4 py-3 text-white/60">{app.email}</td>
                    <td className="px-4 py-3 text-white/40 text-xs">
                      {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={app.status === 'approved' ? 'green' : app.status === 'rejected' ? 'red' : 'amber'}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {app.status === 'pending' && (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            onClick={() => approve(app.id)}
                            loading={actionId === app.id}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => reject(app.id)}
                            loading={actionId === app.id}
                            className="text-red-400 hover:text-red-300"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {app.status !== 'pending' && (
                        <span className="text-white/20 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
