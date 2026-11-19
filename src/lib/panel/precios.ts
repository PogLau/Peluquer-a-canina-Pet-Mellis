import type { Payload } from 'payload'

import type { Extra, Service, Size } from '@/lib/pricing'
import type { Usuario } from '@/payload-types'

import type { ErroresCampos } from './clientes'

/*
  Servicios y precios editables desde el panel. Es la misma base que lee el cotizador:
  un precio guardado acá se ve al instante en /cotizar. Los turnos ya pedidos conservan su precio.
  Los números viajan como texto (lo que escribe la peluquera) y se validan acá.
*/

/** Un precio fijo por tamaño (sin rangos). */
export const camposPrecio = ['precioChico', 'precioMediano', 'precioGrande', 'precioGigante'] as const
export type CampoPrecio = (typeof camposPrecio)[number]

export type ServicioPrecio = {
  id: number
  nombre: string
  aplicaRecargoManto: boolean
  popular: boolean
  activo: boolean
} & Record<CampoPrecio, string>

export type ExtraPrecio = {
  id: number
  nombre: string
  /** `porcentaje`: precio es un % fijo sobre los servicios. */
  tipo: 'fijo' | 'porcentaje'
  precio: string
  activo: boolean
}

export type PreciosEditables = {
  servicios: ServicioPrecio[]
  extras: ExtraPrecio[]
  multiplicadores: { corto: string; largo: string; rizado: string }
  recargos: { leves: string; moderados: string; severos: string }
}

const MAX_PRECIO = 10_000_000

/** «15.000», «15000» o «$ 15.000» → 15000. Null si no es un entero válido. */
export function parsePesos(value: string): number | null {
  const limpio = value.replace(/[$\s.]/g, '')
  if (!/^\d+$/.test(limpio)) return null
  const n = Number(limpio)
  return n <= MAX_PRECIO ? n : null
}

/** «1,15» o «1.15» → 1.15. Entre 1 y 3. */
export function parseMultiplier(value: string): number | null {
  const n = Number(value.trim().replace(',', '.'))
  return Number.isFinite(n) && n >= 1 && n <= 3 ? Math.round(n * 100) / 100 : null
}

export async function getPricing(payload: Payload, user: Usuario): Promise<PreciosEditables> {
  const [servicios, extras, config] = await Promise.all([
    payload.find({
      collection: 'servicios',
      sort: 'orden',
      depth: 0,
      pagination: false,
      overrideAccess: false,
      user,
    }),
    payload.find({
      collection: 'extras',
      sort: 'orden',
      depth: 0,
      pagination: false,
      overrideAccess: false,
      user,
    }),
    payload.findGlobal({ slug: 'configuracion', depth: 0, overrideAccess: false, user }),
  ])
  const s = (n: number | null | undefined, fallback: number) => String(n ?? fallback)
  return {
    servicios: servicios.docs.map((x) => ({
      id: x.id,
      nombre: x.nombre,
      precioChico: String(x.precioChico),
      precioMediano: String(x.precioMediano),
      precioGrande: String(x.precioGrande),
      precioGigante: String(x.precioGigante ?? x.precioGrande),
      aplicaRecargoManto: x.aplicaRecargoManto ?? true,
      popular: x.popular ?? false,
      activo: x.activo ?? true,
    })),
    extras: extras.docs.map((x) => ({
      id: x.id,
      nombre: x.nombre,
      tipo: x.tipo ?? 'fijo',
      precio: String(x.precio),
      activo: x.activo ?? true,
    })),
    multiplicadores: {
      corto: s(config.multiplicadoresManto?.corto, 1),
      largo: s(config.multiplicadoresManto?.largo, 1),
      rizado: s(config.multiplicadoresManto?.rizado, 1),
    },
    recargos: {
      leves: s(config.recargosNudos?.leves, 12000),
      moderados: s(config.recargosNudos?.moderados, 18000),
      severos: s(config.recargosNudos?.severos, 25000),
    },
  }
}

/** Errores por campo, con claves como «servicios.2.precioChico» o «recargos.leves». */
export function validatePricing(p: PreciosEditables): ErroresCampos {
  const e: ErroresCampos = {}
  const precio = 'Precio en pesos, sin centavos.'
  p.servicios.forEach((s, i) => {
    for (const campo of camposPrecio) {
      if (parsePesos(s[campo]) === null) e[`servicios.${i}.${campo}`] = precio
    }
  })
  p.extras.forEach((x, i) => {
    const valor = parsePesos(x.precio)
    if (valor === null) e[`extras.${i}.precio`] = precio
    else if (x.tipo === 'porcentaje' && valor > 100) e[`extras.${i}.precio`] = 'Porcentaje entre 0 y 100.'
  })
  for (const k of ['corto', 'largo', 'rizado'] as const) {
    if (parseMultiplier(p.multiplicadores[k]) === null)
      e[`multiplicadores.${k}`] = 'Entre 1 y 3, por ejemplo 1,15.'
  }
  for (const k of ['leves', 'moderados', 'severos'] as const) {
    if (parsePesos(p.recargos[k]) === null) e[`recargos.${k}`] = precio
  }
  if (!p.servicios.some((s) => s.activo)) e.servicios = 'Dejá al menos un servicio activo.'
  return e
}

export async function savePricing(
  payload: Payload,
  user: Usuario,
  p: PreciosEditables,
): Promise<void> {
  await Promise.all([
    ...p.servicios.map((s) =>
      payload.update({
        collection: 'servicios',
        id: s.id,
        data: {
          precioChico: parsePesos(s.precioChico)!,
          precioMediano: parsePesos(s.precioMediano)!,
          precioGrande: parsePesos(s.precioGrande)!,
          precioGigante: parsePesos(s.precioGigante)!,
          // Columnas de la versión con rangos: se vacían (sin uso; precios fijos)
          precioChicoHasta: null,
          precioMedianoHasta: null,
          precioGrandeHasta: null,
          precioGiganteHasta: null,
          aplicaRecargoManto: s.aplicaRecargoManto,
          popular: s.popular,
          activo: s.activo,
        },
        overrideAccess: false,
        user,
      }),
    ),
    ...p.extras.map((x) =>
      payload.update({
        collection: 'extras',
        id: x.id,
        data: { precio: parsePesos(x.precio)!, precioHasta: null, activo: x.activo },
        overrideAccess: false,
        user,
      }),
    ),
  ])
  await payload.updateGlobal({
    slug: 'configuracion',
    data: {
      multiplicadoresManto: {
        corto: parseMultiplier(p.multiplicadores.corto)!,
        largo: parseMultiplier(p.multiplicadores.largo)!,
        rizado: parseMultiplier(p.multiplicadores.rizado)!,
      },
      recargosNudos: {
        leves: parsePesos(p.recargos.leves)!,
        moderados: parsePesos(p.recargos.moderados)!,
        severos: parsePesos(p.recargos.severos)!,
      },
    },
    overrideAccess: false,
    user,
  })
}

/* ---------- Conversión entre el catálogo (pricing.ts) y la tabla editable (demo estática) ---------- */

const tamanosCampo: ReadonlyArray<[Size, CampoPrecio]> = [
  ['chico', 'precioChico'],
  ['mediano', 'precioMediano'],
  ['grande', 'precioGrande'],
  ['gigante', 'precioGigante'],
]

/** Precios de un servicio del catálogo como texto para la tabla editable. */
export function preciosDeServicio(s: Service): Record<CampoPrecio, string> {
  const out = {} as Record<CampoPrecio, string>
  for (const [size, campo] of tamanosCampo) out[campo] = String(s.precios[size])
  return out
}

/** Lee la fila editable (ya validada) y devuelve los precios del catálogo. */
export function preciosDesdeFila(fila: Record<CampoPrecio, string>): Pick<Service, 'precios'> {
  const precios = {} as Service['precios']
  for (const [size, campo] of tamanosCampo) precios[size] = parsePesos(fila[campo])!
  return { precios }
}

/** Fila editable de un extra del catálogo. */
export function filaDeExtra(x: Extra): Pick<ExtraPrecio, 'tipo' | 'precio'> {
  return { tipo: x.tipo ?? 'fijo', precio: String(x.precio) }
}
