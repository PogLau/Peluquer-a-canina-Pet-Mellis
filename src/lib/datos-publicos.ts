import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { loadCatalog, type Catalog } from './catalogo'
import { whatsappLink } from './whatsapp'

/*
  Datos públicos para el panel de cliente (Inicio y Cotizador), leídos de Payload en el servidor.
  `cache` evita repetir la consulta dentro de un mismo pedido.
  Si la base no responde, devuelven null y la página muestra un aviso en vez de romperse.
*/

export const getCatalogo = cache(async (): Promise<Catalog | null> => {
  try {
    return await loadCatalog(await getPayload({ config }))
  } catch {
    return null
  }
})

export type DatosLocal = {
  direccion: string
  whatsapp: string | null
  horarios: Array<{ dia: string; abre: string; cierra: string }>
}

const dias: Record<string, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
}

export const getDatosLocal = cache(async (): Promise<DatosLocal> => {
  let direccion = 'Merlo, Buenos Aires'
  let telefono = process.env.WHATSAPP_LOCAL ?? ''
  let horarios: DatosLocal['horarios'] = []
  try {
    const payload = await getPayload({ config })
    const c = await payload.findGlobal({ slug: 'configuracion', depth: 0 })
    direccion = c.direccion || direccion
    telefono = c.whatsappLocal || telefono
    horarios = (c.horarios ?? []).map((h) => ({ dia: dias[h.dia] ?? h.dia, abre: h.abre, cierra: h.cierra }))
  } catch {
    // Sin base: se muestran los valores por defecto
  }

  let whatsapp: string | null = null
  if (!/x/i.test(telefono)) {
    try {
      whatsapp = whatsappLink(telefono, 'Hola, quería consultar por un turno para mi perro.')
    } catch {
      whatsapp = null
    }
  }
  return { direccion, whatsapp, horarios }
})
