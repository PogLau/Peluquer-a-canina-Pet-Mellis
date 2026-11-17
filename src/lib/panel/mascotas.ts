import type { Payload, Where } from 'payload'

import { buildFicha, suggestRecommendation, type Ficha } from '@/lib/ficha'
import type { Atencione, Etiqueta, Mascota, Servicio, Tutore, Usuario } from '@/payload-types'

import { listUpcomingForPet, type TurnoPanel } from './turnos'

/* Mascotas del panel: buscador y perfil con la Ficha Evolutiva. */

export type MascotaResumen = {
  id: number
  nombre: string
  raza: string | null
  tamano: string
  manto: string
  tutor: string
  alertas: string[]
}

export type AtencionPanel = {
  id: number
  fecha: string
  servicios: string[]
  precioFinal: number | null
  etiquetas: Array<{ nombre: string; tipo: 'alerta' | 'info' }>
  notaInterna: string | null
  resumenTutor: string | null
  recomendacion: string | null
}

export type PerfilMascota = {
  mascota: MascotaResumen & {
    pesoKg: number | null
    nacimiento: string | null
    cuidadosEspeciales: string | null
    etiquetas: Array<{ nombre: string; tipo: 'alerta' | 'info' }>
  }
  tutor: { id: number; nombre: string; whatsapp: string; zona: string | null }
  atenciones: AtencionPanel[]
  ficha: Ficha
  recomendacionSugerida: string
  proximos: TurnoPanel[]
}

function obj<T>(value: unknown): T | null {
  return value && typeof value === 'object' ? (value as T) : null
}

function etiquetasDe(list: unknown[] | null | undefined) {
  return (list ?? [])
    .map((e) => obj<Etiqueta>(e))
    .filter((e): e is Etiqueta => !!e)
    .map((e) => ({ nombre: e.nombre, tipo: e.tipo }))
}

function toResumen(m: Mascota): MascotaResumen {
  const etiquetas = etiquetasDe(m.etiquetas)
  return {
    id: m.id,
    nombre: m.nombre,
    raza: m.raza ?? null,
    tamano: m.tamano,
    manto: m.manto,
    tutor: obj<Tutore>(m.tutor)?.nombre ?? '',
    alertas: etiquetas.filter((e) => e.tipo === 'alerta').map((e) => e.nombre),
  }
}

/** Busca por nombre del perro, raza o nombre del tutor. Sin texto, lista todas. */
export async function searchPets(
  payload: Payload,
  user: Usuario,
  query: string,
): Promise<MascotaResumen[]> {
  const q = query.trim().slice(0, 60)
  const where: Where | undefined = q
    ? { or: [{ nombre: { like: q } }, { raza: { like: q } }, { 'tutor.nombre': { like: q } }] }
    : undefined
  const result = await payload.find({
    collection: 'mascotas',
    where,
    sort: 'nombre',
    depth: 1,
    limit: 50,
    overrideAccess: false,
    user,
  })
  return result.docs.map(toResumen)
}

export function toAtencionPanel(a: Atencione): AtencionPanel {
  return {
    id: a.id,
    fecha: a.fecha,
    servicios: (a.serviciosRealizados ?? [])
      .map((s) => obj<Servicio>(s)?.nombre)
      .filter((n): n is string => !!n),
    precioFinal: a.precioFinal ?? null,
    etiquetas: etiquetasDe(a.etiquetas),
    notaInterna: a.notaInterna ?? null,
    resumenTutor: a.resumenTutor ?? null,
    recomendacion: a.recomendacion ?? null,
  }
}

/** Atenciones de la mascota, de la más nueva a la más vieja. */
export async function listVisits(payload: Payload, user: Usuario, mascotaId: number) {
  const result = await payload.find({
    collection: 'atenciones',
    where: { mascota: { equals: mascotaId } },
    sort: '-fecha',
    depth: 1,
    limit: 50,
    overrideAccess: false,
    user,
  })
  return result.docs
}

export async function getPetProfile(
  payload: Payload,
  user: Usuario,
  id: number,
): Promise<PerfilMascota | null> {
  let mascota: Mascota
  try {
    mascota = await payload.findByID({
      collection: 'mascotas',
      id,
      depth: 1,
      overrideAccess: false,
      user,
    })
  } catch {
    return null
  }
  const [visitas, proximos] = await Promise.all([
    listVisits(payload, user, id),
    listUpcomingForPet(payload, user, id),
  ])
  const ficha = buildFicha(visitas.map((v) => ({ fecha: v.fecha, puntajes: v.puntajes })))
  const tutor = obj<Tutore>(mascota.tutor)
  return {
    mascota: {
      ...toResumen(mascota),
      pesoKg: mascota.pesoKg ?? null,
      nacimiento: mascota.nacimiento ?? null,
      cuidadosEspeciales: mascota.cuidadosEspeciales ?? null,
      etiquetas: etiquetasDe(mascota.etiquetas),
    },
    tutor: {
      id: tutor?.id ?? 0,
      nombre: tutor?.nombre ?? '',
      whatsapp: tutor?.whatsapp ?? '',
      zona: tutor?.zona ?? null,
    },
    atenciones: visitas.map(toAtencionPanel),
    ficha,
    recomendacionSugerida: suggestRecommendation(ficha),
    proximos,
  }
}
