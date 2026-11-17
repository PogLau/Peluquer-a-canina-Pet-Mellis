import type { Payload } from 'payload'

import { dayRangeAR } from '@/lib/dates'
import type { AppointmentStatus } from '@/lib/estados'
import type { Etiqueta, Mascota, Servicio } from '@/payload-types'

/*
  Datos del cliente con su enlace personal. Siempre filtrados por su tutor y nunca con la nota interna.
  Se leen del lado del servidor (overrideAccess) porque el cliente no tiene usuario de Payload.
*/

export type TurnoCliente = {
  id: number
  fechaHora: string
  estado: AppointmentStatus
  mascota: string
  servicios: string[]
  precioEstimado: number | null
  puedeCancelar: boolean
}

export type VisitaCliente = {
  id: number
  fecha: string
  servicios: string[]
  resumenTutor: string | null
  recomendacion: string | null
}

export type LibretaMascota = {
  id: number
  nombre: string
  raza: string | null
  tamano: string
  manto: string
  pesoKg: number | null
  cuidadosEspeciales: string | null
  etiquetas: string[]
  visitas: VisitaCliente[]
  proximaRecomendacion: string | null
}

const DIA_MS = 24 * 60 * 60 * 1000

function nombres(list: unknown[] | null | undefined): string[] {
  return (list ?? [])
    .map((v) => (v && typeof v === 'object' ? (v as Servicio | Etiqueta).nombre : null))
    .filter((n): n is string => !!n)
}

/** Se puede cancelar desde la web si todavía no empezó y faltan más de 24 h. */
export function canClientCancel(
  estado: AppointmentStatus,
  fechaHora: string,
  now = new Date(),
): boolean {
  return (
    (estado === 'solicitado' || estado === 'confirmado') &&
    new Date(fechaHora).getTime() - now.getTime() > DIA_MS
  )
}

export async function listClientAppointments(payload: Payload, tutorId: number, now = new Date()) {
  const r = await payload.find({
    collection: 'turnos',
    where: { tutor: { equals: tutorId } },
    sort: '-fechaHora',
    depth: 1,
    limit: 50,
    overrideAccess: true,
  })
  const turnos: TurnoCliente[] = r.docs.map((t) => ({
    id: t.id,
    fechaHora: t.fechaHora,
    estado: t.estado,
    mascota: typeof t.mascota === 'object' ? t.mascota.nombre : '',
    servicios: nombres(t.servicios),
    precioEstimado: t.precioEstimado ?? null,
    puedeCancelar: canClientCancel(t.estado, t.fechaHora, now),
  }))
  const inicioHoy = new Date(dayRangeAR(now).desde).getTime()
  // Próximos: desde hoy en adelante, más los que siguen en el salón (en atención o listos para retirar)
  // aunque sean de un día anterior. Del más cercano al más lejano.
  const esProximo = (t: TurnoCliente) =>
    t.estado === 'en_atencion' ||
    t.estado === 'listo' ||
    ((t.estado === 'solicitado' || t.estado === 'confirmado') &&
      new Date(t.fechaHora).getTime() >= inicioHoy)
  return {
    proximos: turnos.filter(esProximo).reverse(),
    pasados: turnos.filter((t) => !esProximo(t)),
  }
}

export class ClienteError extends Error {}

export async function cancelClientAppointment(
  payload: Payload,
  tutorId: number,
  turnoId: number,
  now = new Date(),
) {
  let turno
  try {
    turno = await payload.findByID({
      collection: 'turnos',
      id: turnoId,
      depth: 0,
      overrideAccess: true,
    })
  } catch {
    throw new ClienteError('No encontramos ese turno.')
  }
  const dueno = typeof turno.tutor === 'object' ? turno.tutor.id : turno.tutor
  if (dueno !== tutorId) throw new ClienteError('No encontramos ese turno.')
  if (!canClientCancel(turno.estado, turno.fechaHora, now)) {
    throw new ClienteError('Faltan menos de 24 horas: para cancelar, escribinos por WhatsApp.')
  }
  await payload.update({
    collection: 'turnos',
    id: turnoId,
    data: { estado: 'cancelado' },
    overrideAccess: true,
  })
}

export async function listClientPets(payload: Payload, tutorId: number): Promise<LibretaMascota[]> {
  const mascotas = await payload.find({
    collection: 'mascotas',
    where: { tutor: { equals: tutorId } },
    sort: 'nombre',
    depth: 1,
    limit: 20,
    overrideAccess: true,
  })
  const ids = mascotas.docs.map((m) => m.id)
  const atenciones = ids.length
    ? await payload.find({
        collection: 'atenciones',
        where: { mascota: { in: ids } },
        sort: '-fecha',
        depth: 1,
        limit: 200,
        // La nota interna nunca sale del panel
        select: {
          fecha: true,
          mascota: true,
          serviciosRealizados: true,
          resumenTutor: true,
          recomendacion: true,
        },
        overrideAccess: true,
      })
    : { docs: [] }

  return mascotas.docs.map((m: Mascota) => {
    const visitas: VisitaCliente[] = atenciones.docs
      .filter((a) => (typeof a.mascota === 'object' ? a.mascota.id : a.mascota) === m.id)
      .map((a) => ({
        id: a.id,
        fecha: a.fecha,
        servicios: nombres(a.serviciosRealizados),
        resumenTutor: a.resumenTutor ?? null,
        recomendacion: a.recomendacion ?? null,
      }))
    return {
      id: m.id,
      nombre: m.nombre,
      raza: m.raza ?? null,
      tamano: m.tamano,
      manto: m.manto,
      pesoKg: m.pesoKg ?? null,
      cuidadosEspeciales: m.cuidadosEspeciales ?? null,
      etiquetas: nombres(m.etiquetas),
      visitas,
      proximaRecomendacion: visitas.find((v) => v.recomendacion)?.recomendacion ?? null,
    }
  })
}
