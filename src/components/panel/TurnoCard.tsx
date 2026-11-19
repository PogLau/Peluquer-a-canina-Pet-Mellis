import Link from 'next/link'
import type { ReactNode } from 'react'

import { Icon, LinkButton, StatusBadge, TagChip, Ticket, type ButtonVariant } from '@/components/ui'
import { nextStatus, type AppointmentStatus } from '@/lib/estados'
import { formatMoney, formatTime } from '@/lib/format'
import type { TurnoPanel } from '@/lib/panel/turnos'
import type { SinRegistro } from './BotonAvanzar'
import { EscaneoIngreso } from './EscaneoIngreso'

export type AccionTurno = {
  id: number
  estado: AppointmentStatus
  accion: string
  variant: ButtonVariant
  /** Presente si el turno pasaría a «listo» o «finalizado» sin su atención registrada. */
  sinRegistro?: SinRegistro
}

export type RutasPanel = {
  mascota: (id: number) => string
  registrar: (turnoId: number) => string
}

/** Rutas de la app real. La demo estática usa ?id= porque no puede generar una página por perro. */
export const rutasPanel: RutasPanel = {
  mascota: (id) => `/panel/mascotas/${id}`,
  registrar: (turnoId) => `/panel/registrar/${turnoId}`,
}

type Props = {
  turno: TurnoPanel
  /** Botón para pasar al estado siguiente (en la app real, AvanzarTurno con su acción del servidor). */
  renderAccion: (a: AccionTurno) => ReactNode
  rutas?: RutasPanel
}

/** Turno de la agenda de hoy: hora, perro, alertas de la ficha y la acción que sigue. */
export function TurnoCard({ turno, renderAccion, rutas = rutasPanel }: Props) {
  const next = nextStatus(turno.estado)
  const enAtencion = turno.estado === 'en_atencion'
  const terminado = turno.estado === 'finalizado'
  // Atendido (o por cerrarse) sin la visita guardada en la Ficha Evolutiva
  const faltaRegistro =
    !turno.atencionRegistrada && (enAtencion || turno.estado === 'listo' || terminado)
  const nombre = turno.mascota.nombre

  return (
    <Ticket
      as="article"
      aria-labelledby={`turno-${turno.id}`}
      className={terminado ? 'opacity-75' : undefined}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex items-center gap-3 sm:w-24 sm:flex-col sm:items-start">
          <p className="cifras font-display text-2xl font-bold">
            {formatTime(new Date(turno.fechaHora))}
          </p>
          <StatusBadge status={turno.estado} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div>
            <h2 id={`turno-${turno.id}`} className="text-xl">
              <Link
                href={rutas.mascota(turno.mascota.id)}
                className="underline-offset-4 hover:underline"
              >
                {turno.mascota.nombre}
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

          {turno.escaneo && turno.estado !== 'finalizado' && (
            <EscaneoIngreso escaneo={turno.escaneo} compacto />
          )}

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
          {faltaRegistro && (
            <p className="flex items-center gap-1.5 text-sm font-bold text-aviso">
              <Icon name="alerta" size={16} />
              {terminado
                ? `Finalizado sin atención registrada: la ficha de ${nombre} no tiene esta visita.`
                : 'Falta registrar la atención.'}
            </p>
          )}
        </div>

        {!terminado && (
          <div className="flex flex-wrap gap-2 sm:w-48 sm:flex-col sm:items-stretch">
            {(enAtencion || turno.estado === 'listo') && !turno.atencionRegistrada && (
              <LinkButton href={rutas.registrar(turno.id)} size="small" icon="libreta">
                Registrar atención
              </LinkButton>
            )}
            {next &&
              renderAccion({
                id: turno.id,
                estado: turno.estado,
                accion: next.accion,
                variant: faltaRegistro ? 'secondary' : 'primary',
                sinRegistro:
                  faltaRegistro && (next.estado === 'listo' || next.estado === 'finalizado')
                    ? { nombre, registrarHref: rutas.registrar(turno.id) }
                    : undefined,
              })}
          </div>
        )}
      </div>
    </Ticket>
  )
}
