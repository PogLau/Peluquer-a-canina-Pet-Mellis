import { addDays } from './dates'
import { formatLongDate, formatMoney, formatTime } from './format'

/*
  Mensajes de WhatsApp que arma el panel. Nunca se envían solos: se abren en wa.me
  y la peluquera los revisa antes de mandarlos.
*/

export type DatosTurnoMensaje = {
  tutor: string
  mascota: string
  fechaHora: Date
  servicios: string[]
  precioEstimado?: number | null
  /** Enlace personal del cliente (/mi/<token>) para ver su libreta y sus turnos. */
  enlace?: string | null
}

function lineaEnlace(enlace?: string | null): string[] {
  return enlace ? [`Tu libreta y tus turnos, sin contraseña: ${enlace}`] : []
}

function primerNombre(nombre: string): string {
  return nombre.trim().split(/\s+/)[0] ?? nombre
}

function listar(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`
}

function cuando(fecha: Date): string {
  return `el ${formatLongDate(fecha)} a las ${formatTime(fecha)}`
}

export function confirmationMessage(t: DatosTurnoMensaje): string {
  const lineas = [
    `Hola, ${primerNombre(t.tutor)}. Te confirmamos el turno de ${t.mascota} ${cuando(t.fechaHora)} en Los Mellis.`,
    `Servicios: ${listar(t.servicios.map((s) => s.toLowerCase()))}.`,
  ]
  if (t.precioEstimado) lineas.push(`Precio: ${formatMoney(t.precioEstimado)}.`)
  lineas.push('Si necesitás cambiar algo, avisanos por acá.', ...lineaEnlace(t.enlace))
  return lineas.join('\n')
}

export function proposalMessage(t: DatosTurnoMensaje, nuevaFecha: Date): string {
  return [
    `Hola, ${primerNombre(t.tutor)}. Para ${t.mascota} no tenemos lugar ${cuando(t.fechaHora)}.`,
    `¿Te sirve ${cuando(nuevaFecha)}? Respondé por acá y lo dejamos confirmado.`,
  ].join('\n')
}

export function rejectionMessage(t: DatosTurnoMensaje): string {
  return [
    `Hola, ${primerNombre(t.tutor)}. No vamos a poder atender a ${t.mascota} ${cuando(t.fechaHora)}.`,
    'Si querés, escribinos y buscamos otro día.',
  ].join('\n')
}

export type DatosResumen = {
  tutor: string
  mascota: string
  fecha: Date
  servicios: string[]
  resumenTutor?: string | null
  recomendacion?: string | null
  /** Días hasta la próxima visita sugerida. */
  proximaEnDias?: number
  enlace?: string | null
}

export function summaryMessage(r: DatosResumen): string {
  const lineas = [`Hola, ${primerNombre(r.tutor)}. ${r.mascota} ya está listo para retirar.`, '']
  if (r.servicios.length)
    lineas.push(`Qué hicimos: ${listar(r.servicios.map((s) => s.toLowerCase()))}.`)
  if (r.resumenTutor?.trim()) lineas.push(`Cómo se portó: ${r.resumenTutor.trim()}`)
  if (r.recomendacion?.trim()) lineas.push(`Para la próxima: ${r.recomendacion.trim()}`)
  const proxima = addDays(r.fecha, r.proximaEnDias ?? 30)
  lineas.push(
    `Te sugerimos volver alrededor del ${formatLongDate(proxima)}.`,
    ...lineaEnlace(r.enlace),
  )
  lineas.push('', 'Los Mellis · Peluquería canina')
  return lineas.join('\n')
}

export type DatosPedido = {
  tutor: string
  mascota: string
  fechaHora: Date
  servicios: string[]
  precioEstimado: number
}

/** Mensaje del cliente al salón después de pedir un turno desde la web. */
export function bookingRequestMessage(p: DatosPedido): string {
  return [
    `Hola, soy ${p.tutor.trim()}. Pedí un turno desde la web para ${p.mascota} ${cuando(p.fechaHora)}.`,
    `Servicios: ${listar(p.servicios.map((s) => s.toLowerCase()))}. Precio: ${formatMoney(p.precioEstimado)}.`,
    '¿Me lo confirman? Gracias.',
  ].join('\n')
}
