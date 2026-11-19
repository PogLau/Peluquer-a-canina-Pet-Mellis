import type { EstadoCotizacion } from '@/lib/cotizacion'
import type { Coat, Knots, Size } from '@/lib/pricing'

/* Estado del asistente de reserva y qué falta en cada paso (funciones puras). */

export const pasosReserva = ['Tu perro', 'Servicios', 'Horario', 'Confirmar'] as const

export type EstadoReserva = {
  tutorNombre: string
  whatsapp: string
  /** Una mascota que el tutor ya tiene (con enlace personal); null para cargar una nueva. */
  mascotaId: number | null
  /** `tamano` empieza en null: la persona lo elige (o viene del cotizador). */
  nueva: { nombre: string; raza: string; tamano: Size | null; manto: Coat }
  servicios: string[]
  extras: string[]
  nudos: Knots
  fecha: string | null
  fechaHora: string | null
  notas: string
}

/**
 * Estado de una reserva nueva. Los servicios solo vienen del presupuesto que la persona armó en el
 * cotizador (`preset`); si entra directo a /reservar, empiezan vacíos: nunca se marca uno por defecto.
 */
export function initialBooking(
  preset: Partial<EstadoCotizacion>,
  mascotas: ReadonlyArray<{ id: number }>,
): EstadoReserva {
  return {
    tutorNombre: '',
    whatsapp: '',
    mascotaId: mascotas.length === 1 ? mascotas[0].id : null,
    nueva: {
      nombre: '',
      raza: '',
      tamano: preset.tamano ?? null,
      manto: preset.manto ?? 'corto',
    },
    servicios: preset.servicioIds?.length ? [...preset.servicioIds] : [],
    extras: preset.extraIds ? [...preset.extraIds] : [],
    nudos: preset.nudos ?? 'sin',
    fecha: null,
    fechaHora: null,
    notas: '',
  }
}

/** Qué falta para pasar del paso `paso` (0 a 3). Null si está completo. */
export function missingInStep(paso: number, e: EstadoReserva, conEnlace: boolean): string | null {
  if (paso === 0) {
    if (!conEnlace) {
      if (e.tutorNombre.trim().length < 2) return 'Falta tu nombre.'
      if (!/^\d{10,15}$/.test(e.whatsapp.replace(/\D/g, '')))
        return 'Falta tu WhatsApp con código de área.'
    }
    if (e.mascotaId === null && !e.nueva.nombre.trim()) return 'Falta el nombre de tu perro.'
    if (e.mascotaId === null && !e.nueva.tamano) return 'Elegí el tamaño de tu perro.'
    return null
  }
  if (paso === 1) return e.servicios.length ? null : 'Elegí al menos un servicio.'
  if (paso === 2) return e.fechaHora ? null : 'Elegí un día y un horario.'
  return null
}
