'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Table, Thead, Tbody, Th, Td, Tr } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { api } from '@/lib/api'
import type { Tenant } from '@/types'

export function TenantsTable({ tenants, onDeleted }: { tenants: Tenant[], onDeleted?: (id: string) => void }) {
  const router = useRouter()
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete(id: string) {
    setDeleting(true)
    try {
      await api.delete(`/api/admin/tenants/${id}`)
      setConfirmId(null)
      onDeleted?.(id)
    } catch (err: any) {
      alert(err.message ?? 'Failed to delete tenant')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="card overflow-hidden">
        <Table>
          <Thead>
            <tr>
              <Th>Tenant</Th>
              <Th>Slug</Th>
              <Th>Database</Th>
              <Th>Status</Th>
              <Th>Provisioned</Th>
              <Th></Th>
            </tr>
          </Thead>
          <Tbody>
            {tenants.map((t) => (
              <Tr key={t.id} onClick={() => router.push(`/dashboard/tenants/${t.id}`)}>
                <Td>
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">{t.email}</p>
                  </div>
                </Td>
                <Td>
                  <span className="font-mono text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded">
                    {t.slug}.inflix.uk
                  </span>
                </Td>
                <Td>
                  <span className="font-mono text-xs text-white/40">{t.dbName}</span>
                </Td>
                <Td>
                  <Badge variant={t.isActive ? 'green' : 'red'}>
                    {t.isActive ? 'Active' : 'Suspended'}
                  </Badge>
                </Td>
                <Td>
                  <span className="text-white/50">{formatDate(t.createdAt)}</span>
                </Td>
                <Td>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmId(t.id) }}
                    className="p-1.5 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Delete tenant"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </Td>
              </Tr>
            ))}
            {tenants.length === 0 && (
              <Tr>
                <Td className="text-center text-white/40 py-10" colSpan={6}>
                  No tenants provisioned yet
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </div>

      {/* Delete confirmation modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmId(null)} />
          <div className="relative z-10 card p-6 w-full max-w-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">Delete Tenant</p>
                <p className="text-sm text-white/40 mt-0.5">
                  {tenants.find(t => t.id === confirmId)?.name}
                </p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              This will remove the tenant record. The database will <strong className="text-white/80">not</strong> be dropped automatically — you may need to remove it manually.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setConfirmId(null)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" loading={deleting} onClick={() => handleDelete(confirmId)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
