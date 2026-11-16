import type { Sugerencia } from './ia/sugerencia'
import { coats, knots, sizes, type Coat, type Knots, type QuoteInput, type Size } from './pricing'

/* Estado del cotizador y sus transiciones (funciones puras, testeables sin interfaz). */

export type EstadoCotizacion = QuoteInput

export function estadoInicial(servicioPopular?: string): EstadoCotizacion {
  return {
    tamano: 'chico',
    manto: 'corto',
    nudos: 'sin',
    servicioIds: servicioPopular ? [servicioPopular] : [],
    extraIds: [],
  }
}

/** Aplica una sugerencia: cambia tamaño, manto y nudos; respeta los servicios y extras elegidos. */
export function aplicarSugerencia(estado: EstadoCotizacion, sugerencia: Sugerencia): EstadoCotizacion {
  return { ...estado, tamano: sugerencia.tamano, manto: sugerencia.manto, nudos: sugerencia.nudos }
}

export function alternar(lista: readonly string[], id: string): string[] {
  return lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]
}

/** Enlace a la reserva con el presupuesto precargado. */
export function reservarHref(estado: EstadoCotizacion): string {
  const params = new URLSearchParams({
    tamano: estado.tamano,
    manto: estado.manto,
    nudos: estado.nudos,
  })
  if (estado.servicioIds.length) params.set('servicios', estado.servicioIds.join(','))
  if (estado.extraIds.length) params.set('extras', estado.extraIds.join(','))
  return `/reservar?${params.toString()}`
}

/** Lee el presupuesto de la URL (para la reserva). Ignora valores desconocidos. */
export function estadoDesdeParams(params: URLSearchParams): Partial<EstadoCotizacion> {
  const pick = <T extends string>(list: readonly T[], v: string | null) =>
    v && (list as readonly string[]).includes(v) ? (v as T) : undefined
  const listOf = (v: string | null) => (v ? v.split(',').filter((x) => /^[a-z0-9-]+$/.test(x)) : undefined)
  return {
    tamano: pick<Size>(sizes, params.get('tamano')),
    manto: pick<Coat>(coats, params.get('manto')),
    nudos: pick<Knots>(knots, params.get('nudos')),
    servicioIds: listOf(params.get('servicios')),
    extraIds: listOf(params.get('extras')),
  }
}
