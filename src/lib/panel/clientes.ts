import type { Payload, Where } from 'payload'

import { normalizeWhatsapp } from '@/lib/cliente/reserva'
import { coats, sizes, type Coat, type Size } from '@/lib/pricing'
import type { Usuario } from '@/payload-types'

import { PanelError } from './turnos'

/* Clientes del panel: tutores con sus perros, teléfono y última visita. Alta y edición. */

export type ClienteFila = {
  id: number
  nombre: string
  whatsapp: string
  zona: string | null
  mascotas: string[]
  ultimaVisita: string | null
}

export type MascotaEditable = {
  id: number | null
  nombre: string
  raza: string
  tamano: Size
  manto: Coat
  pesoKg: string
  cuidadosEspeciales: string
}

export type ClienteEditable = {
  id: number | null
  nombre: string
  whatsapp: string
  zona: string
  notas: string
}

export type ErroresCampos = Record<string, string>

async function lastVisits(payload: Payload, user: Usuario, mascotaIds: number[]) {
  const ultima = new Map<number, string>()
  if (!mascotaIds.length) return ultima
  const r = await payload.find({
    collection: 'atenciones',
    where: { mascota: { in: mascotaIds } },
    select: { fecha: true, mascota: true },
    sort: '-fecha',
    depth: 0,
    pagination: false,
    overrideAccess: false,
    user,
  })
  for (const a of r.docs) {
    const id = typeof a.mascota === 'object' ? a.mascota.id : a.mascota
    if (!ultima.has(id)) ultima.set(id, a.fecha)
  }
  return ultima
}

export async function listClients(
  payload: Payload,
  user: Usuario,
  query = '',
): Promise<ClienteFila[]> {
  const q = query.trim().slice(0, 60)
  const digitos = q.replace(/\D/g, '')
  const where: Where | undefined = q
    ? {
        or: [
          { nombre: { like: q } },
          { zona: { like: q } },
          ...(digitos.length >= 3 ? [{ whatsapp: { like: digitos } }] : []),
        ],
      }
    : undefined
  const tutores = await payload.find({
    collection: 'tutores',
    where,
    sort: 'nombre',
    depth: 0,
    limit: 200,
    overrideAccess: false,
    user,
  })
  const ids = tutores.docs.map((t) => t.id)
  const mascotas = ids.length
    ? await payload.find({
        collection: 'mascotas',
        where: { tutor: { in: ids } },
        sort: 'nombre',
        depth: 0,
        pagination: false,
        overrideAccess: false,
        user,
      })
    : { docs: [] }
  const ultima = await lastVisits(
    payload,
    user,
    mascotas.docs.map((m) => m.id),
  )

  return tutores.docs.map((t) => {
    const propias = mascotas.docs.filter(
      (m) => (typeof m.tutor === 'object' ? m.tutor.id : m.tutor) === t.id,
    )
    const fechas = propias
      .map((m) => ultima.get(m.id))
      .filter((f): f is string => !!f)
      .sort()
    return {
      id: t.id,
      nombre: t.nombre,
      whatsapp: t.whatsapp,
      zona: t.zona ?? null,
      mascotas: propias.map((m) => m.nombre),
      ultimaVisita: fechas.at(-1) ?? null,
    }
  })
}

export async function getClient(payload: Payload, user: Usuario, id: number) {
  let t
  try {
    t = await payload.findByID({ collection: 'tutores', id, depth: 0, overrideAccess: false, user })
  } catch {
    return null
  }
  const mascotas = await payload.find({
    collection: 'mascotas',
    where: { tutor: { equals: id } },
    sort: 'nombre',
    depth: 0,
    pagination: false,
    overrideAccess: false,
    user,
  })
  const ultima = await lastVisits(
    payload,
    user,
    mascotas.docs.map((m) => m.id),
  )
  return {
    cliente: {
      id: t.id,
      nombre: t.nombre,
      whatsapp: t.whatsapp,
      zona: t.zona ?? '',
      notas: t.notas ?? '',
    } satisfies ClienteEditable,
    mascotas: mascotas.docs.map((m): MascotaEditable & { ultimaVisita: string | null } => ({
      id: m.id,
      nombre: m.nombre,
      raza: m.raza ?? '',
      tamano: m.tamano,
      manto: m.manto,
      pesoKg: m.pesoKg ? String(m.pesoKg) : '',
      cuidadosEspeciales: m.cuidadosEspeciales ?? '',
      ultimaVisita: ultima.get(m.id) ?? null,
    })),
  }
}

export function validateClient(c: ClienteEditable): ErroresCampos {
  const e: ErroresCampos = {}
  if (c.nombre.trim().length < 2 || c.nombre.trim().length > 80)
    e.nombre = 'Escribí el nombre (2 a 80 letras).'
  if (!/^\d{10,15}$/.test(c.whatsapp.replace(/\D/g, '')))
    e.whatsapp = 'WhatsApp con código de área, por ejemplo 11 2233 4455.'
  if (c.zona.length > 60) e.zona = 'Hasta 60 caracteres.'
  if (c.notas.length > 1000) e.notas = 'Hasta 1000 caracteres.'
  return e
}

/** Crea o actualiza un tutor. Devuelve su id. El WhatsApp no puede repetirse. */
export async function saveClient(
  payload: Payload,
  user: Usuario,
  c: ClienteEditable,
): Promise<number> {
  const whatsapp = normalizeWhatsapp(c.whatsapp)
  const repetido = await payload.find({
    collection: 'tutores',
    where: { whatsapp: { equals: whatsapp } },
    limit: 1,
    depth: 0,
    overrideAccess: false,
    user,
  })
  const otro = repetido.docs[0]
  if (otro && otro.id !== c.id) throw new PanelError(`Ese WhatsApp ya es de ${otro.nombre}.`)
  const data = {
    nombre: c.nombre.trim(),
    whatsapp,
    zona: c.zona.trim() || null,
    notas: c.notas.trim() || null,
  }
  if (c.id) {
    await payload.update({ collection: 'tutores', id: c.id, data, overrideAccess: false, user })
    return c.id
  }
  return (await payload.create({ collection: 'tutores', data, overrideAccess: false, user })).id
}

export function validatePet(m: MascotaEditable): ErroresCampos {
  const e: ErroresCampos = {}
  if (!m.nombre.trim() || m.nombre.trim().length > 40) e.nombre = 'Escribí el nombre del perro.'
  if (!(sizes as readonly string[]).includes(m.tamano)) e.tamano = 'Elegí el tamaño.'
  if (!(coats as readonly string[]).includes(m.manto)) e.manto = 'Elegí el manto.'
  const peso = m.pesoKg.trim().replace(',', '.')
  if (peso && !(Number(peso) > 0 && Number(peso) < 120)) e.pesoKg = 'Peso en kg, por ejemplo 7,5.'
  if (m.raza.length > 60) e.raza = 'Hasta 60 caracteres.'
  if (m.cuidadosEspeciales.length > 500) e.cuidadosEspeciales = 'Hasta 500 caracteres.'
  return e
}

export async function savePet(
  payload: Payload,
  user: Usuario,
  tutorId: number,
  m: MascotaEditable,
): Promise<number> {
  const peso = m.pesoKg.trim().replace(',', '.')
  const data = {
    nombre: m.nombre.trim(),
    raza: m.raza.trim() || null,
    tamano: m.tamano,
    manto: m.manto,
    pesoKg: peso ? Number(peso) : null,
    cuidadosEspeciales: m.cuidadosEspeciales.trim() || null,
    tutor: tutorId,
  }
  if (m.id) {
    const actual = await payload.findByID({
      collection: 'mascotas',
      id: m.id,
      depth: 0,
      overrideAccess: false,
      user,
    })
    const dueno = typeof actual.tutor === 'object' ? actual.tutor.id : actual.tutor
    if (dueno !== tutorId) throw new PanelError('Ese perro es de otro usuario.')
    await payload.update({ collection: 'mascotas', id: m.id, data, overrideAccess: false, user })
    return m.id
  }
  return (await payload.create({ collection: 'mascotas', data, overrideAccess: false, user })).id
}
