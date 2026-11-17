'use server'

import { revalidatePath } from 'next/cache'

import { fromDateTimeLocalAR } from '@/lib/dates'
import { appBaseUrl, enlaceDeTutor, enlacePersonal, regenerarToken } from '@/lib/enlace-cliente'
import { appointmentStatuses, type AppointmentStatus } from '@/lib/estados'
import {
  registerVisit,
  summaryForVisit,
  updateRecommendation,
  type RegistroInput,
} from '@/lib/panel/atenciones'
import { requireStaff } from '@/lib/panel/sesion'
import {
  acceptRequest,
  advanceAppointment,
  PanelError,
  proposeTime,
  rejectRequest,
} from '@/lib/panel/turnos'

/*
  Acciones del panel. Cada una vuelve a verificar la sesión: una acción de servidor
  se puede llamar directo, sin pasar por la página.
*/

export type Resultado = { ok: true } | { ok: false; error: string }

/**
 * `refrescar: false` deja la pantalla actual como está. Lo usan las solicitudes: si se recargara la lista,
 * la tarjeta aceptada o rechazada desaparecería junto con su botón para avisar por WhatsApp.
 * Las páginas del panel son dinámicas, así que al navegar se ven los datos nuevos igual.
 */
async function run(fn: () => Promise<unknown>, refrescar = true): Promise<Resultado> {
  try {
    await fn()
    if (refrescar) {
      revalidatePath('/panel', 'layout')
      revalidatePath('/', 'layout')
    }
    return { ok: true }
  } catch (error) {
    if (error instanceof PanelError) return { ok: false, error: error.message }
    return { ok: false, error: 'No se pudo guardar. Revisá la conexión y probá de nuevo.' }
  }
}

function isStatus(value: string): value is AppointmentStatus {
  return (appointmentStatuses as readonly string[]).includes(value)
}

export async function avanzarTurno(id: number, desde: string): Promise<Resultado> {
  const { payload, user } = await requireStaff()
  if (!isStatus(desde)) return { ok: false, error: 'Estado desconocido.' }
  return run(() => advanceAppointment(payload, user, id, desde))
}

export async function aceptarSolicitud(id: number): Promise<Resultado> {
  const { payload, user } = await requireStaff()
  return run(() => acceptRequest(payload, user, id), false)
}

export async function rechazarSolicitud(id: number): Promise<Resultado> {
  const { payload, user } = await requireStaff()
  return run(() => rejectRequest(payload, user, id), false)
}

/** `valor` viene de un <input type="datetime-local"> en hora de Buenos Aires. */
export async function proponerHorario(id: number, valor: string): Promise<Resultado> {
  const { payload, user } = await requireStaff()
  const fecha = fromDateTimeLocalAR(valor)
  if (!fecha) return { ok: false, error: 'Elegí día y hora.' }
  return run(() => proposeTime(payload, user, id, fecha), false)
}

export async function registrarAtencion(input: RegistroInput) {
  const { payload, user } = await requireStaff()
  try {
    const resultado = await registerVisit(payload, user, input, new Date(), (id) =>
      enlaceDeTutor(payload, id),
    )
    if (resultado.ok) {
      revalidatePath('/panel', 'layout')
      revalidatePath('/', 'layout')
    }
    return resultado
  } catch {
    return { ok: false as const, error: 'No se pudo guardar la atención. Probá de nuevo.' }
  }
}

export async function guardarRecomendacion(atencionId: number, texto: string): Promise<Resultado> {
  const { payload, user } = await requireStaff()
  return run(() => updateRecommendation(payload, user, atencionId, texto))
}

export async function resumenDeAtencion(atencionId: number) {
  const { payload, user } = await requireStaff()
  try {
    return {
      ok: true as const,
      ...(await summaryForVisit(payload, user, atencionId, (id) => enlaceDeTutor(payload, id))),
    }
  } catch {
    return { ok: false as const, error: 'No encontramos esa atención.' }
  }
}

/** Genera un enlace personal nuevo para el tutor: el anterior deja de funcionar. */
export async function regenerarEnlace(
  tutorId: number,
): Promise<{ ok: true; enlace: string } | { ok: false; error: string }> {
  const { payload } = await requireStaff()
  try {
    const token = await regenerarToken(payload, tutorId)
    revalidatePath('/panel', 'layout')
    return { ok: true, enlace: enlacePersonal(await appBaseUrl(), token) }
  } catch {
    return { ok: false, error: 'No se pudo generar el enlace. Probá de nuevo.' }
  }
}
