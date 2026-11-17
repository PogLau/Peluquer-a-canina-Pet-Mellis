'use client'

import type { RespuestaReserva } from '@/components/cliente/reserva/AsistenteReserva'
import type { AccionesSolicitud } from '@/components/panel/SolicitudCard'
import type { ReservaInput } from '@/lib/cliente/reserva'
import { fromDateTimeLocalAR } from '@/lib/dates'
import type { AppointmentStatus } from '@/lib/estados'
import { bookingRequestMessage, summaryMessage } from '@/lib/mensajes'
import type { RegistroInput, ResultadoRegistro } from '@/lib/panel/atenciones'
import { validatePricing, type PreciosEditables } from '@/lib/panel/precios'
import { whatsappLink } from '@/lib/whatsapp'

import { WHATSAPP_SALON, type DemoState } from './estado'
import * as op from './operaciones'
import { servicioPorIndice } from './selectores'
import { aplicar, leerEstado } from './store'

/*
  Acciones de la demo con la misma forma que las acciones del servidor de la app real:
  los componentes compartidos (SolicitudCard, FormularioAtencion, AsistenteReserva…) las reciben por props.
*/

type Respuesta = { ok: true } | { ok: false; error: string }

const resultado = (error: string | null): Respuesta => (error ? { ok: false, error } : { ok: true })

/** Enlace personal de la demo: abre «Mis turnos» como ese cliente (en la app real es /mi/<token>). */
export function enlaceDemo(tutorId: number): string {
  const base = typeof window === 'undefined' ? '' : window.location.origin
  return `${base}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/mi/?c=${tutorId}`
}

export const accionesSolicitud: AccionesSolicitud = {
  aceptar: async (id) => resultado(aplicar((s) => op.aceptar(s, id))),
  rechazar: async (id) => resultado(aplicar((s) => op.rechazar(s, id))),
  proponer: async (id, valor) => {
    const fecha = fromDateTimeLocalAR(valor)
    if (!fecha) return { ok: false, error: 'Elegí día y hora.' }
    return resultado(aplicar((s) => op.proponer(s, id, fecha)))
  },
}

export async function avanzarTurno(id: number, desde: AppointmentStatus): Promise<Respuesta> {
  return resultado(aplicar((s) => op.avanzar(s, id, desde)))
}

export async function registrarAtencion(input: RegistroInput): Promise<ResultadoRegistro> {
  let atencionId = 0
  let antes: DemoState | null = null
  const error = aplicar((s) => {
    antes = s
    const [siguiente, id] = op.registrarAtencion(s, {
      turnoId: input.turnoId,
      servicios: input.servicios
        .map((n) => servicioPorIndice(s, n))
        .filter((x): x is string => !!x),
      precioFinal: input.precioFinal,
      etiquetaIds: input.etiquetas,
      puntajes: input.puntajes,
      notaInterna: input.notaInterna,
      resumenTutor: input.resumenTutor,
      recomendacion: input.recomendacion,
    })
    atencionId = id
    return siguiente
  })
  if (error || !antes) return { ok: false, error: error ?? 'No se pudo guardar.' }
  const s = antes as DemoState
  const turno = s.turnos.find((t) => t.id === input.turnoId)!
  const tutor = s.tutores.find((t) => t.id === turno.tutorId)!
  const mascota = s.mascotas.find((m) => m.id === turno.mascotaId)!
  return {
    ok: true,
    atencionId,
    telefono: tutor.whatsapp,
    mensaje: summaryMessage({
      tutor: tutor.nombre,
      mascota: mascota.nombre,
      fecha: new Date(),
      servicios: input.servicios
        .map((n) => s.servicios[n - 1]?.nombre)
        .filter((x): x is string => !!x),
      resumenTutor: input.resumenTutor,
      recomendacion: input.recomendacion,
      enlace: enlaceDemo(tutor.id),
    }),
  }
}

export async function guardarRecomendacion(atencionId: number, texto: string): Promise<Respuesta> {
  return resultado(aplicar((s) => op.editarRecomendacion(s, atencionId, texto)))
}

export async function guardarPrecios(p: PreciosEditables) {
  const errores = validatePricing(p)
  if (Object.keys(errores).length)
    return { ok: false as const, error: 'Revisá los valores marcados.', errores }
  return resultado(aplicar((s) => op.guardarPrecios(s, p)))
}

export async function reservarTurno(
  input: ReservaInput,
  resumen: { mascota: string; servicios: string[] },
): Promise<RespuestaReserva> {
  let precio = 0
  const conEnlace = !!leerEstado()?.clienteId && input.whatsapp === ''
  const error = aplicar((s) => {
    const r = op.reservar(s, input, conEnlace)
    precio = r.precio
    return r.estado
  })
  if (error) return { ok: false, error }
  const estado = leerEstado()!
  const tutor = estado.tutores.find((t) => t.id === estado.clienteId)
  return {
    ok: true,
    precioEstimado: precio,
    conEnlace: true,
    avisarLink: whatsappLink(
      WHATSAPP_SALON,
      bookingRequestMessage({
        tutor: tutor?.nombre ?? input.tutorNombre,
        mascota: resumen.mascota,
        fechaHora: new Date(input.fechaHora),
        servicios: resumen.servicios,
        precioEstimado: precio,
      }),
    ),
  }
}

export async function cancelarTurno(id: number): Promise<Respuesta> {
  return resultado(aplicar((s) => op.cancelar(s, id)))
}

/** «Ver como» un cliente (en la app real, abrir su enlace personal). Null: un visitante sin enlace. */
export function verComo(tutorId: number | null) {
  aplicar((s) => ({ ...s, clienteId: tutorId }))
}
