import {
  extras as extrasBase,
  pricingConfig,
  servicios as serviciosBase,
} from '@/lib/catalogo-demo'
import type { Catalog } from '@/lib/catalogo'
import type { AppointmentStatus } from '@/lib/estados'
import type { Puntajes } from '@/lib/ficha'
import type { EscaneoTurno } from '@/lib/ia/cuidado'
import {
  buildQuote,
  type Coat,
  type Extra,
  type Knots,
  type PricingConfig,
  type Service,
  type Size,
} from '@/lib/pricing'
import { ATENCIONES_TOBY, ETIQUETAS, HORARIOS_DEMO, PERROS, TURNOS } from '@/seed/datos'
import { arDate } from '@/seed/fechas'

/*
  Estado de la demo: los mismos datos ficticios del seed, pero guardados en el navegador.
  Nada sale del dispositivo. Las fechas se arman relativas al día en que se abre la demo.
*/

// 2: IA Scan & Care (los turnos guardan el escaneo de ingreso)
export const VERSION_DEMO = 2
export const WHATSAPP_SALON = '5491151770132'

export type DServicio = Service & { activo: boolean }
export type DExtra = Extra & { activo: boolean }
export type DEtiqueta = { id: number; nombre: string; tipo: 'alerta' | 'info' }
export type DTutor = { id: number; nombre: string; whatsapp: string; zona: string }
export type DMascota = {
  id: number
  tutorId: number
  nombre: string
  raza: string
  tamano: Size
  manto: Coat
  pesoKg: number | null
  cuidadosEspeciales: string
  etiquetaIds: number[]
}
export type DTurno = {
  id: number
  fechaHora: string
  estado: AppointmentStatus
  tutorId: number
  mascotaId: number
  servicios: string[]
  extras: string[]
  nudos: Knots
  precioEstimado: number
  origen: 'web' | 'panel'
  notasCliente: string
  /** IA Scan & Care del pedido. Opcional: estados guardados antes no lo tienen. */
  escaneo?: EscaneoTurno | null
}
export type DAtencion = {
  id: number
  fecha: string
  mascotaId: number
  turnoId: number | null
  servicios: string[]
  precioFinal: number | null
  puntajes: Puntajes
  etiquetaIds: number[]
  notaInterna: string
  resumenTutor: string
  recomendacion: string
}

export type DemoState = {
  version: number
  creado: string
  servicios: DServicio[]
  extras: DExtra[]
  pricing: PricingConfig
  horarios: Array<{ dia: string; abre: string; cierra: string }>
  duracionMin: number
  etiquetas: DEtiqueta[]
  tutores: DTutor[]
  mascotas: DMascota[]
  turnos: DTurno[]
  atenciones: DAtencion[]
  /** Tutor con el que se ve «Mis turnos» y «Mi mascota» (en la app real, por su enlace personal). */
  clienteId: number | null
  ultimoId: number
}

/** Catálogo activo, con la forma que usan el cotizador y buildQuote. */
export function catalogOf(s: DemoState): Catalog {
  return {
    servicios: s.servicios.filter((x) => x.activo),
    extras: s.extras.filter((x) => x.activo),
    config: s.pricing,
  }
}

export function priceOf(
  s: DemoState,
  t: Pick<DTurno, 'mascotaId' | 'servicios' | 'extras' | 'nudos'>,
): number {
  const m = s.mascotas.find((x) => x.id === t.mascotaId)
  if (!m) return 0
  const quote = buildQuote(
    {
      tamano: m.tamano,
      manto: m.manto,
      nudos: t.nudos,
      servicioIds: t.servicios,
      extraIds: t.extras,
    },
    { servicios: s.servicios, extras: s.extras },
    s.pricing,
  )
  return quote.total
}

/** Estado inicial: el seed de la demo con fechas relativas a `now`. */
export function initialState(now = new Date()): DemoState {
  let id = 0
  const nuevoId = () => ++id
  const etiquetas = ETIQUETAS.map((e) => ({ id: nuevoId(), ...e }))
  const etiquetaId = (nombre: string) => etiquetas.find((e) => e.nombre === nombre)!.id

  const tutores: DTutor[] = []
  const mascotas: DMascota[] = []
  for (const p of PERROS) {
    const tutor = { id: nuevoId(), ...p.tutor }
    tutores.push(tutor)
    mascotas.push({
      id: nuevoId(),
      tutorId: tutor.id,
      nombre: p.nombre,
      raza: p.raza,
      tamano: p.tamano,
      manto: p.manto,
      pesoKg: p.pesoKg,
      cuidadosEspeciales: p.cuidados ?? '',
      etiquetaIds: p.etiquetas.map(etiquetaId),
    })
  }
  const mascotaDe = (nombre: string) => mascotas.find((m) => m.nombre === nombre)!

  const base: DemoState = {
    version: VERSION_DEMO,
    creado: now.toISOString(),
    servicios: serviciosBase.map((s) => ({ ...s, activo: true })),
    extras: extrasBase.map((x) => ({ ...x, activo: true })),
    pricing: structuredClone(pricingConfig),
    horarios: HORARIOS_DEMO.map((h) => ({ ...h })),
    duracionMin: 60,
    etiquetas,
    tutores,
    mascotas,
    turnos: [],
    atenciones: [],
    clienteId: tutores[0].id,
    ultimoId: 0,
  }

  for (const t of TURNOS) {
    const m = mascotaDe(t.perro)
    const turno: DTurno = {
      id: nuevoId(),
      fechaHora: arDate(t.dias, t.hora, now),
      estado: t.estado,
      tutorId: m.tutorId,
      mascotaId: m.id,
      servicios: t.servicios,
      extras: t.extras ?? [],
      nudos: t.nudos,
      precioEstimado: 0,
      origen: t.origen,
      notasCliente: t.notasCliente ?? '',
      escaneo: t.escaneo ?? null,
    }
    turno.precioEstimado = priceOf(base, turno)
    base.turnos.push(turno)
  }

  const toby = mascotaDe('Toby')
  for (const a of ATENCIONES_TOBY) {
    const turno: DTurno = {
      id: nuevoId(),
      fechaHora: arDate(a.dias, '11:00', now),
      estado: 'finalizado',
      tutorId: toby.tutorId,
      mascotaId: toby.id,
      servicios: ['bano-corte'],
      extras: [],
      nudos: 'leves',
      precioEstimado: 0,
      origen: 'panel',
      notasCliente: '',
    }
    turno.precioEstimado = priceOf(base, turno)
    base.turnos.push(turno)
    base.atenciones.push({
      id: nuevoId(),
      fecha: arDate(a.dias, '13:30', now),
      mascotaId: toby.id,
      turnoId: turno.id,
      servicios: ['bano-corte'],
      precioFinal: turno.precioEstimado,
      puntajes: a.puntajes,
      etiquetaIds: a.etiquetas.map(etiquetaId),
      notaInterna: a.notaInterna,
      resumenTutor: a.resumenTutor,
      recomendacion: a.recomendacion,
    })
  }
  base.ultimoId = id
  return base
}

/** Copia del estado con un id nuevo reservado. */
export function nextId(s: DemoState): [DemoState, number] {
  const id = s.ultimoId + 1
  return [{ ...s, ultimoId: id }, id]
}
