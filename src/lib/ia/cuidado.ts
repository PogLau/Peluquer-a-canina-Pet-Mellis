import type { Catalog } from '../catalogo'
import { knotsLabels, type Coat, type Knots } from '../pricing'

/*
  IA Scan & Care: de lo que se ve en la foto a un plan de cuidado.
  La foto (IA o ejemplo de demo) solo describe el pelaje. El tratamiento sale de estas reglas fijas,
  así la sugerencia es predecible y la peluquera la puede explicar. Funciones puras: las usan
  la app real, la demo estática y los tests.
*/

/** Textura que se ve en la foto. `mixto` (rizado y largo a la vez) se cotiza como rizado. */
export const texturas = ['corto', 'largo', 'rizado', 'mixto'] as const
export type Textura = (typeof texturas)[number]

export const hidrataciones = ['buena', 'media', 'baja'] as const
export type Hidratacion = (typeof hidrataciones)[number]

export const tratamientos = ['spa-desenredado', 'hidratacion-profunda', 'corte-raza', 'mantenimiento'] as const
export type Tratamiento = (typeof tratamientos)[number]

export const texturaLabels: Record<Textura, string> = {
  corto: 'Corto',
  largo: 'Largo',
  rizado: 'Rizado',
  mixto: 'Mixto (largo y rizado)',
}

export const hidratacionLabels: Record<Hidratacion, string> = {
  buena: 'Buena',
  media: 'Media',
  baja: 'Baja (pelo seco)',
}

export const tratamientoInfo: Record<
  Tratamiento,
  { nombre: string; detalle: string; servicios: readonly string[]; extras: readonly string[] }
> = {
  'spa-desenredado': {
    nombre: 'Spa de desenredado',
    detalle: 'Baño con acondicionador, desenredado a mano y secado suave. Si los nudos están pegados a la piel, se rebaja en vez de tironear.',
    servicios: ['baño y cepillado'],
    extras: ['limpieza de oidos'],
  },
  'hidratacion-profunda': {
    nombre: 'Baño de hidratación profunda',
    detalle: 'Baño con mascarilla hidratante para recuperar brillo y suavidad, y cepillado final.',
    servicios: ['baño y cepillado'],
    extras: ['perfume hipoalergenico'],
  },
  'corte-raza': {
    nombre: 'Corte de raza',
    detalle: 'Baño completo y corte con el estilo de su raza (o el que pidas).',
    servicios: ['baño y corte'],
    extras: [],
  },
  mantenimiento: {
    nombre: 'Baño de mantenimiento',
    detalle: 'El pelaje está en buen estado: un baño con cepillado lo mantiene así.',
    servicios: ['baño y cepillado'],
    extras: [],
  },
}

/** Manto con el que se cotiza (pricing.ts tiene tres). */
export function mantoDeTextura(t: Textura): Coat {
  return t === 'mixto' ? 'rizado' : t
}

/**
 * Regla del tratamiento, en orden de prioridad:
 * 1. Nudos moderados o severos: primero hay que desenredar.
 * 2. Pelo seco: hidratación.
 * 3. Manto largo, rizado o mixto que crece sin parar: corte de raza.
 * 4. Si no, mantenimiento.
 */
export function tratamientoSugerido(datos: { nudos: Knots; hidratacion: Hidratacion; textura: Textura }): Tratamiento {
  if (datos.nudos === 'moderados' || datos.nudos === 'severos') return 'spa-desenredado'
  if (datos.hidratacion === 'baja') return 'hidratacion-profunda'
  if (datos.textura !== 'corto') return 'corte-raza'
  return 'mantenimiento'
}

/** Descripción del estado del pelaje, armada con los datos (no es texto libre de la IA). */
export function estadoPelaje(datos: { nudos: Knots; hidratacion: Hidratacion }): string {
  const brillo = { buena: 'Pelo con brillo', media: 'Pelo algo opaco', baja: 'Pelo seco y opaco' }[datos.hidratacion]
  const nudos = datos.nudos === 'sin' ? 'sin nudos' : `nudos ${knotsLabels[datos.nudos].toLowerCase()}`
  return `${brillo}, ${nudos}.`
}

const normalizar = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

/**
 * Servicios y extras del catálogo para un tratamiento. Se buscan por nombre porque en la app real
 * los ids son de la base de datos; si la peluquera renombra un servicio, simplemente no se precarga.
 */
export function planDelCatalogo(t: Tratamiento, catalog: Pick<Catalog, 'servicios' | 'extras'>) {
  const info = tratamientoInfo[t]
  const buscar = <T extends { id: string; nombre: string }>(lista: readonly T[], nombres: readonly string[]) =>
    nombres
      .map((n) => lista.find((x) => normalizar(x.nombre).startsWith(normalizar(n)))?.id)
      .filter((id): id is string => Boolean(id))
  return { servicioIds: buscar(catalog.servicios, info.servicios), extraIds: buscar(catalog.extras, info.extras) }
}

export const origenesEscaneo = ['ejemplo', 'ia', 'manual'] as const
export type OrigenEscaneo = (typeof origenesEscaneo)[number]

export const origenLabels: Record<OrigenEscaneo, string> = {
  ejemplo: 'Ejemplo de demo',
  ia: 'IA beta, sin confirmar',
  manual: 'Cargado por el tutor',
}

/* ---------- El escaneo viaja con la reserva hasta el panel ---------- */

/** Lo que queda guardado en el turno (sin la foto: la foto nunca se guarda). */
export type EscaneoTurno = {
  raza: string
  textura: Textura
  hidratacion: Hidratacion
  nudos: Knots
  tratamiento: Tratamiento
  /**
   * `ejemplo`: resultado precargado de la demo. `ia`: análisis real de la foto.
   * `manual`: lo cargó el tutor mirando su foto. Siempre sin confirmar por la peluquera.
   */
  origen: OrigenEscaneo
}

function isOneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value)
}

const knotsList = ['sin', 'leves', 'moderados', 'severos'] as const

/** Valida un escaneo que llega de la URL, de un formulario o de la base. Si algo falla, null. */
export function parseEscaneo(raw: unknown): EscaneoTurno | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const raza = typeof r.raza === 'string' ? r.raza.replace(/\s+/g, ' ').trim().slice(0, 60) : ''
  if (
    !raza ||
    !isOneOf(texturas, r.textura) ||
    !isOneOf(hidrataciones, r.hidratacion) ||
    !isOneOf(knotsList, r.nudos) ||
    !isOneOf(tratamientos, r.tratamiento) ||
    !isOneOf(origenesEscaneo, r.origen)
  ) {
    return null
  }
  return {
    raza,
    textura: r.textura,
    hidratacion: r.hidratacion,
    nudos: r.nudos,
    tratamiento: r.tratamiento,
    origen: r.origen,
  }
}

/** Parámetros de URL para pasar el escaneo del cotizador a la reserva. */
export function escaneoAParams(e: EscaneoTurno, params: URLSearchParams) {
  params.set('raza', e.raza)
  params.set('textura', e.textura)
  params.set('hidratacion', e.hidratacion)
  params.set('tratamiento', e.tratamiento)
  params.set('origen', e.origen)
}

export function escaneoDesdeParams(params: URLSearchParams): EscaneoTurno | null {
  return parseEscaneo({
    raza: params.get('raza'),
    textura: params.get('textura'),
    hidratacion: params.get('hidratacion'),
    nudos: params.get('nudos'),
    tratamiento: params.get('tratamiento'),
    origen: params.get('origen'),
  })
}

/** Una línea para el panel: «Yorkshire · Largo · pelo seco, nudos leves → Baño de hidratación profunda». */
export function resumenEscaneo(e: EscaneoTurno): string {
  return `${e.raza} · ${texturaLabels[e.textura]} · ${estadoPelaje(e).replace(/\.$/, '').toLowerCase()} → ${tratamientoInfo[e.tratamiento].nombre}`
}

/** Texto inicial para la nota interna al registrar la atención (editable). */
export function notaDeIngreso(e: EscaneoTurno): string {
  return `Escaneo de ingreso (${origenLabels[e.origen].toLowerCase()}): ${estadoPelaje(e)} Plan sugerido: ${tratamientoInfo[e.tratamiento].nombre}.`
}
