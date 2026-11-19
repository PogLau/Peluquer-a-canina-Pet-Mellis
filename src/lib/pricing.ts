/*
  Reglas de precios de Pet Mellis (tarifario 2027, precios fijos).

  Cada servicio tiene UN precio por tamaño (sin rangos). Los adicionales tienen un precio fijo
  o un porcentaje fijo sobre los servicios.

  precio_servicio = aplicaRecargoManto ? redondear_a_100(precio[tamaño] × multiplicador[manto]) : precio[tamaño]
  total           = Σ servicios + Σ extras fijos + Σ extras en % (sobre los servicios) + desenredado de nudos

  - El desenredado de nudos se suma UNA sola vez, en su propia línea,
    y solo si hay al menos un servicio con recargo por manto.
  - Ninguna pantalla muestra un precio hasta que la persona eligió tamaño y servicio.

  Funciones puras: no leen la base de datos. Quien las llama les pasa el catálogo.
*/

export const sizes = ['chico', 'mediano', 'grande', 'gigante'] as const
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
  /** Precio fijo por tamaño. */
  precios: Record<Size, number>
  aplicaRecargoManto: boolean
  popular?: boolean
}

export type Extra = {
  id: string
  nombre: string
  descripcion?: string
  /**
   * `fijo` (por defecto): `precio` es un monto en pesos.
   * `porcentaje`: `precio` es un porcentaje fijo sobre el subtotal de servicios (manejo especial).
   */
  tipo?: 'fijo' | 'porcentaje'
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
  grande: { label: 'Grande', detail: '25 a 40 kg' },
  gigante: { label: 'Gigante', detail: 'más de 40 kg' },
}

export const coatLabels: Record<Coat, string> = { corto: 'Corto', largo: 'Largo', rizado: 'Rizado' }

export const knotsLabels: Record<Knots, string> = {
  sin: 'Sin nudos',
  leves: 'Leves',
  moderados: 'Moderados',
  severos: 'Severos',
}

/** Tamaño según el peso en kg: chico hasta 10, mediano hasta 25, grande hasta 40, gigante más de 40. */
export function sizeFromWeight(kg: number): Size {
  if (!Number.isFinite(kg) || kg <= 0) throw new RangeError('El peso tiene que ser un número mayor que 0')
  if (kg <= 10) return 'chico'
  if (kg <= 25) return 'mediano'
  if (kg <= 40) return 'grande'
  return 'gigante'
}

function roundTo100(value: number) {
  return Math.round(value / 100) * 100
}

/** Precio de un servicio para un tamaño y un manto. No incluye el desenredado de nudos. */
export function servicePrice(service: Service, size: Size, coat: Coat, config: PricingConfig): number {
  const base = service.precios[size]
  if (!service.aplicaRecargoManto) return base
  // El multiplicador se pasa a centésimos para evitar errores de coma flotante (8500 × 1,15)
  const hundredths = Math.round(config.multiplicadoresManto[coat] * 100)
  return roundTo100((base * hundredths) / 100)
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
  const subtotalServicios = lineasServicios.reduce((acc, l) => acc + l.monto, 0)

  const lineasExtras: QuoteLine[] = extras.map((e) =>
    e.tipo === 'porcentaje'
      ? {
          id: e.id,
          tipo: 'extra',
          nombre: `${e.nombre} (+${e.precio} %)`,
          monto: roundTo100((subtotalServicios * e.precio) / 100),
        }
      : { id: e.id, tipo: 'extra', nombre: e.nombre, monto: e.precio },
  )

  const aplicaNudos = servicios.some((s) => s.aplicaRecargoManto)
  const recargoNudos = aplicaNudos ? config.recargosNudos[input.nudos] : 0

  const lineas = [...lineasServicios, ...lineasExtras]
  if (recargoNudos > 0) {
    lineas.push({
      id: 'recargo-nudos',
      tipo: 'recargo',
      nombre: `Desenredado de nudos (${knotsLabels[input.nudos].toLowerCase()})`,
      monto: recargoNudos,
    })
  }

  const subtotalExtras = lineasExtras.reduce((acc, l) => acc + l.monto, 0)

  return {
    lineas,
    subtotalServicios,
    subtotalExtras,
    recargoNudos,
    total: subtotalServicios + subtotalExtras + recargoNudos,
  }
}
