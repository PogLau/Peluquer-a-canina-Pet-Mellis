import type { Metadata } from 'next'

import { SolicitudCard } from '@/components/panel/SolicitudCard'
import { EmptyState, PageHeader } from '@/components/ui'
import { requireStaff } from '@/lib/panel/sesion'
import { listRequests } from '@/lib/panel/turnos'

export const metadata: Metadata = { title: 'Solicitudes' }

export default async function SolicitudesPage() {
  const { payload, user } = await requireStaff()
  const solicitudes = await listRequests(payload, user)

  return (
    <>
      <PageHeader eyebrow="Pedidos desde la web" title="solicitudes">
        Al aceptar se abre WhatsApp con la confirmación lista: revisala antes de mandarla.
      </PageHeader>
      {solicitudes.length === 0 ? (
        <EmptyState icon="bandeja" title="nada pendiente">
          Cuando un cliente pida un turno desde la web, aparece acá.
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-5">
          {solicitudes.map((turno) => (
            <li key={turno.id}>
              <SolicitudCard turno={turno} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
