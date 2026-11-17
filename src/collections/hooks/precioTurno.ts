import type { CollectionBeforeChangeHook } from 'payload'

import { loadCatalog } from '../../lib/catalogo'
import { buildQuote, type Coat, type Knots, type Size } from '../../lib/pricing'

type Rel = number | { id: number } | null | undefined

const idOf = (v: Rel): number | null => (v && typeof v === 'object' ? v.id : (v ?? null))
const idsOf = (list: Rel[] | null | undefined): number[] =>
  (list ?? []).map(idOf).filter((x): x is number => x !== null)

const CAMPOS_DE_PRECIO = ['mascota', 'servicios', 'extras', 'nudos'] as const

/**
 * El precio estimado de un turno lo calcula el servidor con el cotizador (buildQuote) y los precios
 * vigentes: nunca se confía en un precio que mande el navegador. Se recalcula al crear el turno
 * y cuando cambian la mascota, los servicios, los extras o los nudos.
 */
export const calcularPrecioTurno: CollectionBeforeChangeHook = async ({ data, originalDoc, operation, req }) => {
  const cambio = operation === 'create' || CAMPOS_DE_PRECIO.some((campo) => campo in data)
  if (!cambio) return data

  const merged = { ...originalDoc, ...data }
  const mascotaId = idOf(merged.mascota)
  if (!mascotaId) return data

  const mascota = await req.payload.findByID({ collection: 'mascotas', id: mascotaId, depth: 0, req })
  const servicioIds = idsOf(merged.servicios)
  const extraIds = idsOf(merged.extras)

  const [servicios, extras, catalog] = await Promise.all([
    servicioIds.length
      ? req.payload.find({ collection: 'servicios', where: { id: { in: servicioIds } }, depth: 0, limit: 100, req })
      : null,
    extraIds.length
      ? req.payload.find({ collection: 'extras', where: { id: { in: extraIds } }, depth: 0, limit: 100, req })
      : null,
    loadCatalog(req.payload),
  ])

  const quote = buildQuote(
    {
      tamano: mascota.tamano as Size,
      manto: mascota.manto as Coat,
      nudos: (merged.nudos ?? 'sin') as Knots,
      servicioIds: servicios?.docs.map((s) => s.slug) ?? [],
      extraIds: extras?.docs.map((e) => e.slug) ?? [],
    },
    catalog,
    catalog.config,
  )
  return { ...data, precioEstimado: quote.total }
}
