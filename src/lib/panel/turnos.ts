import type { Payload, Where } from 'payload'

import { dayRangeAR } from '@/lib/dates'
import { parseEscaneo, type EscaneoTurno } from '@/lib/ia/cuidado'
import { nextStatus, statusLabel, type AppointmentStatus } from '@/lib/estados'
import type { Etiqueta, Mascota, Servicio, Turno, Tutore, Usuario } from '@/payload-types'

/* Turnos del panel: agenda del día, solicitudes y cambios de estado. */

export type TurnoPanel = {
  id: number
  fechaHora: string
  estado: AppointmentStatus
  origen: 'web' | 'panel'
  precioEstimado: number | null
  notasCliente: string | null
  /** Consulta por foto del pedido (sugerencia sin confirmar). */
  escaneo: EscaneoTurno | null
  servicios: string[]
  mascota: {
    id: number
    nombre: string
    raza: string | null
    cuidadosEspeciales: string | null
    alertas: string[]
  }
  tutor: { id: number; nombre: string; whatsapp: string }
  /** Si ya hay una atención guardada para este turno (Ficha Evolutiva al día). */
  atencionRegistrada: boolean
}

export class PanelError extends Error {}

function asObject<T>(value: unknown): T | null {
  return value && typeof value === 'object' ? (value as T) : null
}

export function toTurnoPanel(turno: Turno, atencionRegistrada = false): TurnoPanel {
  const mascota = asObject<Mascota>(turno.mascota)
  const tutor = asObject<Tutore>(turno.tutor)
  const etiquetas = (mascota?.etiquetas ?? [])
    .map((e) => asObject<Etiqueta>(e))
    .filter((e): e is Etiqueta => !!e)
  return {
    id: turno.id,
    fechaHora: turno.fechaHora,
    estado: turno.estado,
    origen: turno.origen,
    precioEstimado: turno.precioEstimado ?? null,
    notasCliente: turno.notasCliente ?? null,
    escaneo: parseEscaneo(turno.escaneo),
    servicios: (turno.servicios ?? [])
      .map((s) => asObject<Servicio>(s)?.nombre)
      .filter((n): n is string => !!n),
    mascota: {
      id: mascota?.id ?? 0,
      nombre: mascota?.nombre ?? 'Mascota',
      raza: mascota?.raza ?? null,
      cuidadosEspeciales: mascota?.cuidadosEspeciales ?? null,
      alertas: etiquetas.filter((e) => e.tipo === 'alerta').map((e) => e.nombre),
    },
    tutor: {
      id: tutor?.id ?? 0,
      nombre: tutor?.nombre ?? 'Tutor',
      whatsapp: tutor?.whatsapp ?? '',
    },
    atencionRegistrada,
  }
}

async function findTurnos(payload: Payload, user: Usuario, where: Where): Promise<TurnoPanel[]> {
  const result = await payload.find({
    collection: 'turnos',
    where,
    sort: 'fechaHora',
    depth: 2,
    limit: 100,
    pagination: false,
    overrideAccess: false,
    user,
  })
  // Qué turnos ya tienen su atención guardada (para avisar antes de finalizar uno sin registro)
  const ids = result.docs.map((t) => t.id)
  const atenciones = ids.length
    ? await payload.find({
        collection: 'atenciones',
        where: { turno: { in: ids } },
        depth: 0,
        pagination: false,
        select: { turno: true },
        overrideAccess: false,
        user,
      })
    : { docs: [] }
  const registrados = new Set(
    atenciones.docs.map((a) => (typeof a.turno === 'object' ? a.turno?.id : a.turno)),
  )
  return result.docs.map((t) => toTurnoPanel(t, registrados.has(t.id)))
}

/** Agenda de hoy en Buenos Aires, sin los cancelados ni las solicitudes sin confirmar. */
export function listTodayAppointments(payload: Payload, user: Usuario, now = new Date()) {
  const { desde, hasta } = dayRangeAR(now)
  return findTurnos(payload, user, {
    and: [
      { fechaHora: { greater_than_equal: desde } },
      { fechaHora: { less_than: hasta } },
      { estado: { not_in: ['cancelado', 'solicitado'] } },
    ],
  })
}

/** Solicitudes que llegaron desde la web y esperan respuesta. */
export function listRequests(payload: Payload, user: Usuario) {
  return findTurnos(payload, user, { estado: { equals: 'solicitado' } })
}

/** Próximos turnos de una mascota (para su perfil). */
export function listUpcomingForPet(
  payload: Payload,
  user: Usuario,
  mascotaId: number,
  now = new Date(),
) {
  return findTurnos(payload, user, {
    and: [
      { mascota: { equals: mascotaId } },
      { fechaHora: { greater_than_equal: dayRangeAR(now).desde } },
      { estado: { not_in: ['cancelado', 'finalizado'] } },
    ],
  })
}

export async function getAppointment(
  payload: Payload,
  user: Usuario,
  id: number,
): Promise<TurnoPanel | null> {
  try {
    const turno = await payload.findByID({
      collection: 'turnos',
      id,
      depth: 2,
      overrideAccess: false,
      user,
    })
    return toTurnoPanel(turno)
  } catch {
    return null
  }
}

async function setStatus(
  payload: Payload,
  user: Usuario,
  id: number,
  from: AppointmentStatus,
  data: Partial<Turno>,
) {
  const actual = await getAppointment(payload, user, id)
  if (!actual) throw new PanelError('No encontramos ese turno.')
  // Evita aplicar dos veces el mismo toque (doble clic o dos pestañas abiertas)
  if (actual.estado !== from)
    throw new PanelError(`El turno ya estaba en «${statusLabel(actual.estado).toLowerCase()}».`)
  const turno = await payload.update({
    collection: 'turnos',
    id,
    data,
    depth: 2,
    overrideAccess: false,
    user,
  })
  return toTurnoPanel(turno)
}

/** Un toque: confirmado → en atención → listo → finalizado. */
export async function advanceAppointment(
  payload: Payload,
  user: Usuario,
  id: number,
  from: AppointmentStatus,
) {
  const next = nextStatus(from)
  if (!next) throw new PanelError('Este turno ya terminó.')
  return setStatus(payload, user, id, from, { estado: next.estado })
}

export function acceptRequest(payload: Payload, user: Usuario, id: number) {
  return setStatus(payload, user, id, 'solicitado', { estado: 'confirmado' })
}

export function rejectRequest(payload: Payload, user: Usuario, id: number) {
  return setStatus(payload, user, id, 'solicitado', { estado: 'cancelado' })
}

/** Cambia el horario de la solicitud; queda «solicitado» hasta que el tutor responda. */
export async function proposeTime(
  payload: Payload,
  user: Usuario,
  id: number,
  fechaHora: Date,
  now = new Date(),
) {
  if (fechaHora.getTime() < now.getTime())
    throw new PanelError('Elegí un horario que no haya pasado.')
  return setStatus(payload, user, id, 'solicitado', { fechaHora: fechaHora.toISOString() })
}
