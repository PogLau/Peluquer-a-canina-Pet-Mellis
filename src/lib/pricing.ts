/*
  Reglas de precios de Pet Mellis (CLAUDE.md §8).

  precio_servicio = aplicaRecargoManto ? redondear_a_100(base[tamaño] × multiplicador[manto]) : base[tamaño]
  total           = Σ servicios + Σ extras + recargoNudos

  - El recargo por nudos se suma UNA sola vez, en su propia línea,
    y solo si hay al menos un servicio con recargo por manto.
  - La tarjeta de un servicio muestra su precio sin el recargo por nudos.

  Funciones puras: no leen la base de datos. Quien las llama les pasa el catálogo
  (en la Fase 2 sale de Payload; por ahora, de `catalogo-demo.ts`).
*/

export const sizes = ['chico', 'mediano', 'grande'] as const
export type Size = (typeof sizes)[number]

export const coats = ['corto', 'largo', 'rizado'] as const
export type Coat = (typeof coats)[number]

export const knots = ['sin', 'leves', 'moderados', 'severos'] as const
export type Knots = (typeof knots)[number]

export type Service = {
  id: string
  nombre: string
  descripcion: string
  duracion: string
  precios: Record<Size, number>
  aplicaRecargoManto: boolean
  popular?: boolean
}

export type Extra = {
  id: string
  nombre: string
  descripcion?: string
  precio: number
}

export type PricingConfig = {
  multiplicadoresManto: Record<Coat, number>
  recargosNudos: Record<Knots, number>
}

export type QuoteInput = {
  tamano: Size
  manto: Coat
  nudos: Knots
  servicioIds: readonly string[]
  extraIds: readonly string[]
}

export type QuoteLine = {
  id: string
  tipo: 'servicio' | 'extra' | 'recargo'
  nombre: string
  monto: number
}

export type Quote = {
  lineas: QuoteLine[]
  subtotalServicios: number
  subtotalExtras: number
  recargoNudos: number
  total: number
}

export const sizeLabels: Record<Size, { label: string; detail: string }> = {
  chico: { label: 'Chico', detail: 'hasta 10 kg' },
  mediano: { label: 'Mediano', detail: '10 a 25 kg' },
  grande: { label: 'Grande', detail: 'más de 25 kg' },
}

export const coatLabels: Record<Coat, string> = { corto: 'Corto', largo: 'Largo', rizado: 'Rizado' }

export const knotsLabels: Record<Knots, string> = {
  sin: 'Sin nudos',
  leves: 'Leves',
  moderados: 'Moderados',
  severos: 'Severos',
}

/** Tamaño según el peso en kg: chico hasta 10, mediano de 10 a 25, grande más de 25. */
export function sizeFromWeight(kg: number): Size {
  if (!Number.isFinite(kg) || kg <= 0) throw new RangeError('El peso tiene que ser un número mayor que 0')
  if (kg <= 10) return 'chico'
  if (kg <= 25) return 'mediano'
  return 'grande'
}

function roundTo100(value: number) {
  return Math.round(value / 100) * 100
}

/**
 * Precio de un servicio para un tamaño y un manto. No incluye el recargo por nudos.
 * El multiplicador se pasa a centésimos para evitar errores de coma flotante (8500 × 1,15).
 */
export function servicePrice(service: Service, size: Size, coat: Coat, config: PricingConfig): number {
  const base = service.precios[size]
  if (!service.aplicaRecargoManto) return base
  const hundredths = Math.round(config.multiplicadoresManto[coat] * 100)
  return roundTo100((base * hundredths) / 100)
}

/** Precio «desde» para la tarjeta del Inicio: el menor precio base, sin recargos. */
export function startingPrice(service: Service): number {
  return Math.min(...sizes.map((s) => service.precios[s]))
}

export function buildQuote(
  input: QuoteInput,
  catalog: { servicios: readonly Service[]; extras: readonly Extra[] },
  config: PricingConfig,
): Quote {
  const servicios = catalog.servicios.filter((s) => input.servicioIds.includes(s.id))
  const extras = catalog.extras.filter((e) => input.extraIds.includes(e.id))

  const lineasServicios: QuoteLine[] = servicios.map((s) => ({
    id: s.id,
    tipo: 'servicio',
    nombre: s.nombre,
    monto: servicePrice(s, input.tamano, input.manto, config),
  }))
  const lineasExtras: QuoteLine[] = extras.map((e) => ({ id: e.id, tipo: 'extra', nombre: e.nombre, monto: e.precio }))

  const aplicaNudos = servicios.some((s) => s.aplicaRecargoManto)
  const recargoNudos = aplicaNudos ? config.recargosNudos[input.nudos] : 0

  const lineas = [...lineasServicios, ...lineasExtras]
  if (recargoNudos > 0) {
    lineas.push({
      id: 'recargo-nudos',
      tipo: 'recargo',
      nombre: `Recargo por nudos (${knotsLabels[input.nudos].toLowerCase()})`,
      monto: recargoNudos,
    })
  }

  const subtotalServicios = lineasServicios.reduce((acc, l) => acc + l.monto, 0)
  const subtotalExtras = lineasExtras.reduce((acc, l) => acc + l.monto, 0)

  return {
    lineas,
    subtotalServicios,
    subtotalExtras,
    recargoNudos,
    total: subtotalServicios + subtotalExtras + recargoNudos,
  }
}
