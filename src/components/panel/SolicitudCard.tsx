'use client'

import { useMemo, useState, useTransition } from 'react'

import { Button, LinkButton, Modal, Notice, TagChip, TextField, Ticket } from '@/components/ui'
import { fromDateTimeLocalAR, toDateTimeLocalAR } from '@/lib/dates'
import { formatLongDate, formatMoney, formatTime } from '@/lib/format'
import {
  confirmationMessage,
  proposalMessage,
  rejectionMessage,
  type DatosTurnoMensaje,
} from '@/lib/mensajes'
import type { TurnoPanel } from '@/lib/panel/turnos'
import { whatsappLink } from '@/lib/whatsapp'
import { EscaneoIngreso } from './EscaneoIngreso'

type Hecho = { titulo: string; link: string | null }

type Respuesta = { ok: true } | { ok: false; error: string }

/** En la app real son acciones del servidor; en la demo estática, funciones sobre los datos del navegador. */
export type AccionesSolicitud = {
  aceptar: (id: number) => Promise<Respuesta>
  rechazar: (id: number) => Promise<Respuesta>
  proponer: (id: number, valor: string) => Promise<Respuesta>
}

function safeLink(phone: string, message: string): string | null {
  try {
    return whatsappLink(phone, message)
  } catch {
    return null
  }
}

/** Solicitud desde la web: aceptar (abre WhatsApp), proponer otro horario o rechazar. */
export function SolicitudCard({
  turno,
  enlace,
  acciones,
}: {
  turno: TurnoPanel
  enlace?: string | null
  acciones: AccionesSolicitud
}) {
  const {
    aceptar: aceptarSolicitud,
    rechazar: rechazarSolicitud,
    proponer: proponerHorario,
  } = acciones
  const fecha = new Date(turno.fechaHora)
  const datos: DatosTurnoMensaje = useMemo(
    () => ({
      tutor: turno.tutor.nombre,
      mascota: turno.mascota.nombre,
      fechaHora: new Date(turno.fechaHora),
      servicios: turno.servicios,
      precioEstimado: turno.precioEstimado,
      enlace,
    }),
    [turno, enlace],
  )
  const linkConfirmar = safeLink(turno.tutor.whatsapp, confirmationMessage(datos))

  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [hecho, setHecho] = useState<Hecho | null>(null)
  const [modal, setModal] = useState<'proponer' | 'rechazar' | null>(null)
  const [nuevaFecha, setNuevaFecha] = useState(() =>
    toDateTimeLocalAR(new Date(fecha.getTime() + 60 * 60 * 1000)),
  )

  function correr(accion: () => Promise<{ ok: boolean; error?: string }>, ok: Hecho) {
    startTransition(async () => {
      const r = await accion()
      if (r.ok) {
        setError(null)
        setModal(null)
        setHecho(ok)
      } else setError(r.error ?? 'No se pudo guardar.')
    })
  }

  if (hecho) {
    return (
      <Ticket size="small" className="flex flex-col gap-3">
        <Notice tone="exito" role="status" title={hecho.titulo} />
        {hecho.link && (
          <LinkButton href={hecho.link} external variant="highlight" size="small" icon="whatsapp">
            Abrir WhatsApp con el mensaje
          </LinkButton>
        )}
      </Ticket>
    )
  }

  const fechaPropuesta = fromDateTimeLocalAR(nuevaFecha)

  return (
    <Ticket as="article" aria-labelledby={`sol-${turno.id}`} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`sol-${turno.id}`} className="text-xl">
          {turno.mascota.nombre.toLowerCase()}
        </h2>
        <p className="rotulo text-verde">
          {formatLongDate(fecha)} · {formatTime(fecha)}
        </p>
      </div>
      <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
        <dt className="font-bold">Tutor</dt>
        <dd>{turno.tutor.nombre}</dd>
        <dt className="font-bold">Servicios</dt>
        <dd>
          {turno.servicios.join(' + ')}
          {turno.precioEstimado ? (
            <span className="cifras"> · {formatMoney(turno.precioEstimado)}</span>
          ) : null}
        </dd>
        {turno.notasCliente && (
          <>
            <dt className="font-bold">Nota</dt>
            <dd className="text-texto-suave">«{turno.notasCliente}»</dd>
          </>
        )}
      </dl>
      {turno.escaneo && <EscaneoIngreso escaneo={turno.escaneo} />}
      {turno.mascota.alertas.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Alertas de la ficha">
          {turno.mascota.alertas.map((a) => (
            <li key={a}>
              <TagChip kind="alerta">{a}</TagChip>
            </li>
          ))}
        </ul>
      )}
      {error && <Notice tone="peligro" role="alert" title={error} />}

      <div className="flex flex-wrap gap-3">
        {linkConfirmar ? (
          <LinkButton
            href={linkConfirmar}
            external
            size="small"
            icon="whatsapp"
            aria-disabled={pending}
            onClick={() =>
              correr(() => aceptarSolicitud(turno.id), {
                titulo: 'Turno confirmado.',
                link: linkConfirmar,
              })
            }
          >
            Aceptar y avisar
          </LinkButton>
        ) : (
          <Button
            size="small"
            icon="check"
            disabled={pending}
            onClick={() =>
              correr(() => aceptarSolicitud(turno.id), { titulo: 'Turno confirmado.', link: null })
            }
          >
            Aceptar
          </Button>
        )}
        <Button variant="secondary" size="small" icon="reloj" onClick={() => setModal('proponer')}>
          Proponer otro horario
        </Button>
        <Button variant="ghost" size="small" onClick={() => setModal('rechazar')}>
          Rechazar
        </Button>
      </div>

      <Modal
        open={modal === 'proponer'}
        onClose={() => setModal(null)}
        title="proponer otro horario"
        footer={
          <>
            <Button variant="ghost" size="small" onClick={() => setModal(null)}>
              Cancelar
            </Button>
            <Button
              size="small"
              disabled={pending || !fechaPropuesta}
              onClick={() =>
                fechaPropuesta &&
                correr(() => proponerHorario(turno.id, nuevaFecha), {
                  titulo: `Horario cambiado al ${formatLongDate(fechaPropuesta)} a las ${formatTime(fechaPropuesta)}. Queda como solicitud hasta que respondan.`,
                  link: safeLink(turno.tutor.whatsapp, proposalMessage(datos, fechaPropuesta)),
                })
              }
            >
              Guardar y avisar
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <TextField
            label="Nuevo día y hora"
            type="datetime-local"
            step={1800}
            value={nuevaFecha}
            onChange={(e) => setNuevaFecha(e.target.value)}
            hint="Después vas a poder mandar el mensaje por WhatsApp."
          />
          {fechaPropuesta && (
            <p className="whitespace-pre-line rounded-sm bg-superficie-alt p-3 text-sm">
              {proposalMessage(datos, fechaPropuesta)}
            </p>
          )}
        </div>
      </Modal>

      <Modal
        open={modal === 'rechazar'}
        onClose={() => setModal(null)}
        title="rechazar solicitud"
        footer={
          <>
            <Button variant="ghost" size="small" onClick={() => setModal(null)}>
              Volver
            </Button>
            <Button
              size="small"
              disabled={pending}
              onClick={() =>
                correr(() => rechazarSolicitud(turno.id), {
                  titulo: 'Solicitud rechazada.',
                  link: safeLink(turno.tutor.whatsapp, rejectionMessage(datos)),
                })
              }
            >
              Rechazar
            </Button>
          </>
        }
      >
        <p className="text-sm">
          El turno de {turno.mascota.nombre} queda cancelado. Después vas a poder avisarle a{' '}
          {turno.tutor.nombre} por WhatsApp.
        </p>
      </Modal>
    </Ticket>
  )
}
