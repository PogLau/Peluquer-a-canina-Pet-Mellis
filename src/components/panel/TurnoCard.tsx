import Link from 'next/link'

import { LinkButton, StatusBadge, TagChip, Ticket } from '@/components/ui'
import { nextStatus } from '@/lib/estados'
import { formatMoney, formatTime } from '@/lib/format'
import type { TurnoPanel } from '@/lib/panel/turnos'

import { AvanzarTurno } from './AvanzarTurno'

/** Turno de la agenda de hoy: hora, perro, alertas de la ficha y la acción que sigue. */
export function TurnoCard({ turno }: { turno: TurnoPanel }) {
  const next = nextStatus(turno.estado)
  const enAtencion = turno.estado === 'en_atencion'
  const terminado = turno.estado === 'finalizado'

  return (
    <Ticket
      as="article"
      aria-labelledby={`turno-${turno.id}`}
      className={terminado ? 'opacity-75' : undefined}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex items-center gap-3 sm:w-24 sm:flex-col sm:items-start">
          <p className="cifras font-display text-2xl font-semibold">
            {formatTime(new Date(turno.fechaHora))}
          </p>
          <StatusBadge status={turno.estado} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div>
            <h2 id={`turno-${turno.id}`} className="text-xl">
              <Link
                href={`/panel/mascotas/${turno.mascota.id}`}
                className="underline-offset-4 hover:underline"
              >
                {turno.mascota.nombre.toLowerCase()}
              </Link>
            </h2>
            <p className="text-sm text-texto-suave">
              {[turno.mascota.raza, turno.tutor.nombre].filter(Boolean).join(' · ')}
            </p>
          </div>

          <p className="text-sm">
            {turno.servicios.join(' + ')}
            {turno.precioEstimado ? (
              <span className="cifras text-texto-suave">
                {' '}
                · {formatMoney(turno.precioEstimado)}
              </span>
            ) : null}
          </p>

          {(turno.mascota.alertas.length > 0 || turno.mascota.cuidadosEspeciales) && (
            <div className="flex flex-col gap-2" aria-label="Alertas de la ficha">
              {turno.mascota.alertas.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {turno.mascota.alertas.map((alerta) => (
                    <li key={alerta}>
                      <TagChip kind="alerta">{alerta}</TagChip>
                    </li>
                  ))}
                </ul>
              )}
              {turno.mascota.cuidadosEspeciales && (
                <p className="text-sm font-bold text-aviso">{turno.mascota.cuidadosEspeciales}</p>
              )}
            </div>
          )}
        </div>

        {!terminado && (
          <div className="flex flex-wrap gap-2 sm:w-48 sm:flex-col sm:items-stretch">
            {enAtencion && (
              <LinkButton href={`/panel/registrar/${turno.id}`} size="small" icon="libreta">
                Registrar atención
              </LinkButton>
            )}
            {next && (
              <AvanzarTurno
                id={turno.id}
                estado={turno.estado}
                accion={next.accion}
                variant={enAtencion ? 'secondary' : 'primary'}
              />
            )}
          </div>
        )}
      </div>
    </Ticket>
  )
}
