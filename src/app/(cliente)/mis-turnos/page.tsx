import type { Metadata } from 'next'

import { CancelarTurno } from '@/components/cliente/CancelarTurno'
import { cancelarTurno } from '../acciones'
import { OlvidarTelefono } from '@/components/cliente/OlvidarTelefono'
import { SinEnlace } from '@/components/cliente/SinEnlace'
import { EmptyState, LinkButton, PageHeader, StatusBadge, Ticket } from '@/components/ui'
import { listClientAppointments, type TurnoCliente } from '@/lib/cliente/libreta'
import { getClienteSession } from '@/lib/enlace-cliente'
import { formatLongDate, formatMoney, formatTime } from '@/lib/format'

export const metadata: Metadata = { title: 'Mis turnos' }
export const dynamic = 'force-dynamic'

function Turno({ turno }: { turno: TurnoCliente }) {
  const fecha = new Date(turno.fechaHora)
  const cuando = `${formatLongDate(fecha)} a las ${formatTime(fecha)}`
  return (
    <Ticket size="small" className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-xl titulo">{turno.mascota}</p>
        <StatusBadge status={turno.estado} />
      </div>
      <p className="font-bold">{cuando}</p>
      <p className="text-sm text-texto-suave">
        {turno.servicios.join(' + ')}
        {turno.precioEstimado ? (
          <span className="cifras"> · {formatMoney(turno.precioEstimado)}</span>
        ) : null}
      </p>
      {turno.estado === 'listo' && (
        <p className="text-sm font-bold text-exito">Ya podés pasar a buscarlo.</p>
      )}
      {turno.puedeCancelar && (
        <div>
          <CancelarTurno
            id={turno.id}
            descripcion={`${turno.mascota} del ${cuando}`}
            cancelar={cancelarTurno}
          />
        </div>
      )}
    </Ticket>
  )
}

export default async function MisTurnosPage({
  searchParams,
}: {
  searchParams: Promise<{ enlace?: string }>
}) {
  const sesion = await getClienteSession()
  const { enlace } = await searchParams
  if (!sesion) {
    return (
      <>
        <PageHeader volver title="mis turnos" />
        <SinEnlace invalido={enlace === 'invalido'} />
      </>
    )
  }

  const { proximos, pasados } = await listClientAppointments(sesion.payload, sesion.tutor.id)
  return (
    <>
      <PageHeader volver
        eyebrow={`Hola, ${sesion.tutor.nombre.split(' ')[0]}`}
        title="mis turnos"
        actions={
          <LinkButton href="/reservar" size="small" icon="calendario">
            Reservar otro
          </LinkButton>
        }
      >
        Para cancelar con menos de 24 horas, escribinos por WhatsApp.
      </PageHeader>

      <section aria-labelledby="proximos" className="flex flex-col gap-3">
        <h2 id="proximos" className="text-xl">
          próximos
        </h2>
        {proximos.length === 0 ? (
          <EmptyState icon="calendario" title="no tenés turnos próximos">
            Cuando reserves, el turno aparece acá con su estado.
          </EmptyState>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {proximos.map((t) => (
              <li key={t.id}>
                <Turno turno={t} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {pasados.length > 0 && (
        <section aria-labelledby="pasados" className="mt-8 flex flex-col gap-3">
          <h2 id="pasados" className="text-xl">
            anteriores
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {pasados.map((t) => (
              <li key={t.id}>
                <Turno turno={t} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <OlvidarTelefono nombre={sesion.tutor.nombre} />
    </>
  )
}
