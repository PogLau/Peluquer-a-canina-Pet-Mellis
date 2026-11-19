'use client'

import { CancelarTurno } from '@/components/cliente/CancelarTurno'
import { EmptyState, LinkButton, PageHeader, StatusBadge, Ticket } from '@/components/ui'
import { cancelarTurno } from '@/demo/acciones'
import { turnosCliente } from '@/demo/selectores'
import { useEstado } from '@/demo/store'
import { VerComo } from '@/demo/VerComo'
import type { TurnoCliente } from '@/lib/cliente/libreta'
import { formatLongDate, formatMoney, formatTime } from '@/lib/format'

function Turno({ turno }: { turno: TurnoCliente }) {
  const fecha = new Date(turno.fechaHora)
  const cuando = `${formatLongDate(fecha)} a las ${formatTime(fecha)}`
  return (
    <Ticket size="small" className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-xl lowercase">{turno.mascota}</p>
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

function Lista({ turnos }: { turnos: TurnoCliente[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {turnos.map((t) => (
        <li key={t.id}>
          <Turno turno={t} />
        </li>
      ))}
    </ul>
  )
}

export default function MisTurnosDemo() {
  const s = useEstado()
  const tutor = s.tutores.find((t) => t.id === s.clienteId)
  const { proximos, pasados } = turnosCliente(s)

  return (
    <>
      <PageHeader volver
        eyebrow={tutor ? `Hola, ${tutor.nombre.split(' ')[0]}` : 'Sin enlace personal'}
        title="mis turnos"
        actions={
          <LinkButton href="/reservar" size="small" icon="calendario">
            Reservar
          </LinkButton>
        }
      >
        Para cancelar con menos de 24 horas, escribinos por WhatsApp.
      </PageHeader>
      <div className="mb-6">
        <VerComo />
      </div>

      {!tutor ? (
        <EmptyState icon="libreta" title="abrí tu enlace personal">
          Sin enlace no se ven turnos. Elegí un cliente arriba o reservá un turno: al reservar, la
          demo te recuerda.
        </EmptyState>
      ) : (
        <>
          <section aria-labelledby="proximos" className="flex flex-col gap-3">
            <h2 id="proximos" className="text-xl">
              próximos
            </h2>
            {proximos.length === 0 ? (
              <EmptyState icon="calendario" title="no tenés turnos próximos">
                Cuando reserves, el turno aparece acá con su estado.
              </EmptyState>
            ) : (
              <Lista turnos={proximos} />
            )}
          </section>
          {pasados.length > 0 && (
            <section aria-labelledby="pasados" className="mt-8 flex flex-col gap-3">
              <h2 id="pasados" className="text-xl">
                anteriores
              </h2>
              <Lista turnos={pasados} />
            </section>
          )}
        </>
      )}
    </>
  )
}
