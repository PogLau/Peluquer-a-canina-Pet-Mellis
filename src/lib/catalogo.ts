import type { Payload } from 'payload'

import type { Extra, PricingConfig, Service } from './pricing'

export type Catalog = {
  servicios: Service[]
  extras: Extra[]
  config: PricingConfig
}

/**
 * Lee servicios, extras y reglas de precio de Payload y los adapta a pricing.ts.
 * Es la única puerta entre la base de datos y el cotizador: un precio cambiado en el panel se ve acá.
 */
export async function loadCatalog(payload: Payload): Promise<Catalog> {
  const [servicios, extras, configuracion] = await Promise.all([
    payload.find({ collection: 'servicios', where: { activo: { equals: true } }, limit: 100, depth: 0, sort: 'orden' }),
    payload.find({ collection: 'extras', where: { activo: { equals: true } }, limit: 100, depth: 0, sort: 'orden' }),
    payload.findGlobal({ slug: 'configuracion', depth: 0 }),
  ])

  return {
    servicios: servicios.docs.map((s) => ({
      id: s.slug,
      nombre: s.nombre,
      descripcion: s.descripcion ?? '',
      duracion: s.duracion ?? '',
      precios: { chico: s.precioChico, mediano: s.precioMediano, grande: s.precioGrande },
      aplicaRecargoManto: s.aplicaRecargoManto ?? true,
      popular: s.popular ?? false,
    })),
    extras: extras.docs.map((e) => ({
      id: e.slug,
      nombre: e.nombre,
      descripcion: e.descripcion ?? undefined,
      precio: e.precio,
    })),
    config: {
      multiplicadoresManto: {
        corto: configuracion.multiplicadoresManto?.corto ?? 1,
        largo: configuracion.multiplicadoresManto?.largo ?? 1.15,
        rizado: configuracion.multiplicadoresManto?.rizado ?? 1.2,
      },
      recargosNudos: {
        sin: 0,
        leves: configuracion.recargosNudos?.leves ?? 1500,
        moderados: configuracion.recargosNudos?.moderados ?? 3500,
        severos: configuracion.recargosNudos?.severos ?? 6000,
      },
    },
  }
}
