import { coats, knots, sizes, type Coat, type Knots, type Size } from '../pricing'

/*
  Sugerencia de datos de la mascota a partir de una foto.
  La IA (o un ejemplo de demo) solo SUGIERE tamaño, manto y nudos: el precio lo calcula
  siempre pricing.ts con los valores de la base de datos.
*/

export type Confianza = 'alta' | 'media' | 'baja'

export type Sugerencia = {
  raza: string
  tamano: Size
  manto: Coat
  nudos: Knots
  observaciones: string
  /** Por dato. El tamaño casi siempre es «baja»: una foto no tiene escala. */
  confianza: { tamano: Confianza; manto: Confianza; nudos: Confianza }
  /** `ejemplo`: resultado precargado de la demo. `ia`: análisis real de la foto. */
  origen: 'ejemplo' | 'ia'
}

export type ResultadoSugerencia =
  | { ok: true; sugerencia: Sugerencia }
  | { ok: false; motivo: 'sin-ia' | 'no-es-perro' | 'archivo-invalido' | 'limite' | 'error'; mensaje: string }

const confianzas = ['alta', 'media', 'baja'] as const

function isOneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value)
}

function text(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const clean = value.replace(/\s+/g, ' ').trim()
  return clean ? clean.slice(0, max) : null
}

/**
 * Valida la respuesta de la IA. Si algo no cumple el contrato devuelve null y el cotizador
 * no precarga nada: nunca se completa un campo con un valor que no existe en el cotizador.
 */
export function parseSugerencia(raw: unknown): Omit<Sugerencia, 'origen'> | { esPerro: false } | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (r.esPerro === false) return { esPerro: false }

  const raza = text(r.raza, 60)
  const observaciones = text(r.observaciones, 240) ?? ''
  const c = (r.confianza ?? {}) as Record<string, unknown>
  if (!raza || !isOneOf(sizes, r.tamano) || !isOneOf(coats, r.manto) || !isOneOf(knots, r.nudos)) return null

  return {
    raza,
    tamano: r.tamano,
    manto: r.manto,
    nudos: r.nudos,
    observaciones,
    confianza: {
      tamano: isOneOf(confianzas, c.tamano) ? c.tamano : 'baja',
      manto: isOneOf(confianzas, c.manto) ? c.manto : 'media',
      nudos: isOneOf(confianzas, c.nudos) ? c.nudos : 'media',
    },
  }
}
