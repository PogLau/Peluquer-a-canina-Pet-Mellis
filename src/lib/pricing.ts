/*
  Reglas de precios de Pet Mellis (tarifario 2027).

  Los precios son orientativos: cada servicio tiene un rango «desde–hasta» por tamaño, y el precio
  final se confirma al revisar el manto en el local.

  precio_servicio = aplicaRecargoManto ? redondear_a_100(precio[tamaño] × multiplicador[manto]) : precio[tamaño]
  total           = Σ servicios + Σ extras fijos + Σ extras en % (sobre los servicios) + desenredado de nudos

  - Todo se calcula dos veces: con los precios «desde» y con los «hasta». El total es un rango.
  - El desenredado de nudos se suma UNA sola vez, en su propia línea,
    y solo si hay al menos un servicio con recargo por manto.
  - La tarjeta de un servicio muestra su precio sin el desenredado.

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
  /** Precio «desde» por tamaño. */
  precios: Record<Size, number>
  /** Precio «hasta» por tamaño. Si falta, el rango es un solo valor. */
  preciosHasta?: Partial<Record<Size, number>>
  aplicaRecargoManto: boolean
  popular?: boolean
}

export type Extra = {
  id: string
  nombre: string
  descripcion?: string
  /**
   * `fijo` (por defecto): `precio` y `precioHasta` son pesos.
   * `porcentaje`: `precio` y `precioHasta` son porcentajes sobre el subtotal de servicios
   * (por ejemplo, manejo especial +15 % a 25 %).
   */
  tipo?: 'fijo' | 'porcentaje'
  precio: number
  precioHasta?: number
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
  /** Precio «desde». */
  monto: number
  /** Precio «hasta» (igual a monto si no hay rango). */
  montoHasta: number
}

export type Quote = {
  lineas: QuoteLine[]
  subtotalServicios: number
  subtotalExtras: number
  recargoNudos: number
  /** Total «desde». */
  total: number
  /** Total «hasta». */
  totalHasta: number
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

function applyCoat(base: number, service: Service, coat: Coat, config: PricingConfig): number {
  if (!service.aplicaRecargoManto) return base
  // El multiplicador se pasa a centésimos para evitar errores de coma flotante (8500 × 1,15)
  const hundredths = Math.round(config.multiplicadoresManto[coat] * 100)
  return roundTo100((base * hundredths) / 100)
}

/** Precio «desde» de un servicio para un tamaño y un manto. No incluye el desenredado de nudos. */
export function servicePrice(service: Service, size: Size, coat: Coat, config: PricingConfig): number {
  return applyCoat(service.precios[size], service, coat, config)
}

/** Rango «desde–hasta» de un servicio para un tamaño y un manto. */
export function servicePriceRange(
  service: Service,
  size: Size,
  coat: Coat,
  config: PricingConfig,
): { desde: number; hasta: number } {
  const desde = servicePrice(service, size, coat, config)
  const hastaBase = service.preciosHasta?.[size]
  const hasta = hastaBase === undefined ? desde : applyCoat(hastaBase, service, coat, config)
  return { desde, hasta: Math.max(desde, hasta) }
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

  const lineasServicios: QuoteLine[] = servicios.map((s) => {
    const { desde, hasta } = servicePriceRange(s, input.tamano, input.manto, config)
    return { id: s.id, tipo: 'servicio', nombre: s.nombre, monto: desde, montoHasta: hasta }
  })
  const serviciosDesde = lineasServicios.reduce((acc, l) => acc + l.monto, 0)
  const serviciosHasta = lineasServicios.reduce((acc, l) => acc + l.montoHasta, 0)

  const lineasExtras: QuoteLine[] = extras.map((e) => {
    const hasta = Math.max(e.precio, e.precioHasta ?? e.precio)
    if (e.tipo === 'porcentaje') {
      const rango = hasta !== e.precio ? `${e.precio} a ${hasta}` : `${e.precio}`
      return {
        id: e.id,
        tipo: 'extra',
        nombre: `${e.nombre} (+${rango} %)`,
        monto: roundTo100((serviciosDesde * e.precio) / 100),
        montoHasta: roundTo100((serviciosHasta * hasta) / 100),
      }
    }
    return { id: e.id, tipo: 'extra', nombre: e.nombre, monto: e.precio, montoHasta: hasta }
  })

  const aplicaNudos = servicios.some((s) => s.aplicaRecargoManto)
  const recargoNudos = aplicaNudos ? config.recargosNudos[input.nudos] : 0

  const lineas = [...lineasServicios, ...lineasExtras]
  if (recargoNudos > 0) {
    lineas.push({
      id: 'recargo-nudos',
      tipo: 'recargo',
      nombre: `Desenredado de nudos (${knotsLabels[input.nudos].toLowerCase()})`,
      monto: recargoNudos,
      montoHasta: recargoNudos,
    })
  }

  const subtotalExtras = lineasExtras.reduce((acc, l) => acc + l.monto, 0)
  const subtotalExtrasHasta = lineasExtras.reduce((acc, l) => acc + l.montoHasta, 0)

  return {
    lineas,
    subtotalServicios: serviciosDesde,
    subtotalExtras,
    recargoNudos,
    total: serviciosDesde + subtotalExtras + recargoNudos,
    totalHasta: serviciosHasta + subtotalExtrasHasta + recargoNudos,
  }
}
