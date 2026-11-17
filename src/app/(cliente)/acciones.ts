'use server'

import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { cancelClientAppointment, ClienteError } from '@/lib/cliente/libreta'
import type { RespuestaReserva } from '@/components/cliente/reserva/AsistenteReserva'
import { createBooking, type ReservaInput } from '@/lib/cliente/reserva'
import { getClienteSession, olvidarTutor, recordarTutor } from '@/lib/enlace-cliente'
import { bookingRequestMessage } from '@/lib/mensajes'
import { whatsappLink } from '@/lib/whatsapp'

/*
  Acciones del panel de cliente (sin login). La identidad sale siempre de la cookie del enlace
  personal, nunca de lo que mande el navegador.
*/

const LIMITE_POR_HORA = 5
const pedidos = new Map<string, number[]>()

// Límite simple en memoria por IP. Alcanza para la demo; en producción, usar un almacén compartido.
async function superaLimite(): Promise<boolean> {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'local'
  const ahora = Date.now()
  const recientes = (pedidos.get(ip) ?? []).filter((t) => ahora - t < 60 * 60 * 1000)
  if (recientes.length >= LIMITE_POR_HORA) return true
  pedidos.set(ip, [...recientes, ahora])
  return false
}

export type { RespuestaReserva }

async function whatsappLocal(): Promise<string | null> {
  const payload = await getPayload({ config })
  const c = await payload.findGlobal({ slug: 'configuracion', depth: 0, overrideAccess: true })
  const tel = c.whatsappLocal || process.env.WHATSAPP_LOCAL || ''
  return /^\d{10,15}$/.test(tel) ? tel : null
}

export async function reservarTurno(
  input: ReservaInput,
  resumen: { mascota: string; servicios: string[] },
): Promise<RespuestaReserva> {
  if (await superaLimite()) {
    return {
      ok: false,
      error: 'Hiciste muchos pedidos seguidos. Esperá un rato o escribinos por WhatsApp.',
    }
  }
  const sesion = await getClienteSession()
  const payload = sesion?.payload ?? (await getPayload({ config }))
  try {
    const r = await createBooking(payload, input, sesion?.tutor ?? null)
    if (!r.ok) return r
    if (r.tokenNuevo) await recordarTutor(r.tokenNuevo)
    revalidatePath('/', 'layout')
    revalidatePath('/panel', 'layout')

    const tel = await whatsappLocal()
    const avisarLink = tel
      ? whatsappLink(
          tel,
          bookingRequestMessage({
            tutor: sesion?.tutor.nombre ?? input.tutorNombre,
            mascota: resumen.mascota,
            fechaHora: new Date(input.fechaHora),
            servicios: resumen.servicios,
            precioEstimado: r.precioEstimado,
          }),
        )
      : null
    return {
      ok: true,
      precioEstimado: r.precioEstimado,
      avisarLink,
      conEnlace: !!(sesion || r.tokenNuevo),
    }
  } catch {
    return { ok: false, error: 'No pudimos guardar el pedido. Probá de nuevo en un momento.' }
  }
}

export async function cancelarTurno(
  turnoId: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sesion = await getClienteSession()
  if (!sesion) return { ok: false, error: 'Abrí tu enlace personal para cancelar.' }
  try {
    await cancelClientAppointment(sesion.payload, sesion.tutor.id, turnoId)
    revalidatePath('/', 'layout')
    revalidatePath('/panel', 'layout')
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof ClienteError ? error.message : 'No se pudo cancelar. Probá de nuevo.',
    }
  }
}

/** Para teléfonos compartidos: borra el enlace guardado en este teléfono. */
export async function olvidarEsteTelefono() {
  await olvidarTutor()
  revalidatePath('/', 'layout')
}
