'use client'

import { useRouter } from 'next/navigation'
import { Table, Thead, Tbody, Th, Td, Tr } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import type { Tenant } from '@/types'

export function TenantsTable({ tenants }: { tenants: Tenant[] }) {
  const router = useRouter()

  return (
    <div className="card overflow-hidden">
      <Table>
        <Thead>
          <tr>
            <Th>Tenant</Th>
            <Th>Slug</Th>
            <Th>Database</Th>
            <Th>Status</Th>
            <Th>Provisioned</Th>
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
                  {t.slug}.inflix.co.uk
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
            </Tr>
          ))}
          {tenants.length === 0 && (
            <Tr>
              <Td className="text-center text-white/40 py-10" colSpan={5}>
                No tenants provisioned yet
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </div>
  )
}
