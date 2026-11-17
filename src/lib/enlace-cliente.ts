import config from '@payload-config'
import { cookies, headers } from 'next/headers'
import { getPayload, type Payload } from 'payload'

import type { Tutore } from '@/payload-types'

import { esTokenValido, generarToken } from './enlace-token'

/*
  Acceso del cliente sin login (CLAUDE.md §4).
  El salón le manda al tutor su enlace personal /mi/<token>. Al abrirlo, el token queda en una cookie
  de este teléfono y «Mi mascota» y «Mis turnos» muestran solo lo de ese tutor.
  Si el enlace se filtra, el panel genera uno nuevo y el anterior deja de funcionar.
*/

export const COOKIE_CLIENTE = 'pm_cliente'
const UN_ANIO = 60 * 60 * 24 * 365

export type TutorSesion = { id: number; nombre: string; whatsapp: string }

export async function findTutorByToken(
  payload: Payload,
  token: unknown,
): Promise<TutorSesion | null> {
  if (!esTokenValido(token)) return null
  const r = await payload.find({
    collection: 'tutores',
    where: { enlaceToken: { equals: token } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const t = r.docs[0]
  return t ? { id: t.id, nombre: t.nombre, whatsapp: t.whatsapp } : null
}

/** Tutor de este teléfono (por la cookie del enlace personal), o null. */
export async function getClienteSession(): Promise<{
  payload: Payload
  tutor: TutorSesion
} | null> {
  const token = (await cookies()).get(COOKIE_CLIENTE)?.value
  if (!esTokenValido(token)) return null
  const payload = await getPayload({ config })
  const tutor = await findTutorByToken(payload, token)
  return tutor ? { payload, tutor } : null
}

/** Guarda el enlace en este teléfono. Solo desde una acción de servidor o un route handler. */
export async function recordarTutor(token: string) {
  ;(await cookies()).set(COOKIE_CLIENTE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: UN_ANIO,
  })
}

export async function olvidarTutor() {
  ;(await cookies()).delete(COOKIE_CLIENTE)
}

/** Código del enlace del tutor; lo crea si todavía no tiene (tutores anteriores a esta función). */
export async function ensureToken(payload: Payload, tutorId: number): Promise<string> {
  const tutor = (await payload.findByID({
    collection: 'tutores',
    id: tutorId,
    depth: 0,
    overrideAccess: true,
  })) as Tutore
  if (esTokenValido(tutor.enlaceToken)) return tutor.enlaceToken
  return regenerarToken(payload, tutorId)
}

/** Genera un código nuevo: el enlace anterior deja de funcionar en todos los teléfonos. */
export async function regenerarToken(payload: Payload, tutorId: number): Promise<string> {
  const enlaceToken = generarToken()
  await payload.update({
    collection: 'tutores',
    id: tutorId,
    data: { enlaceToken },
    overrideAccess: true,
  })
  return enlaceToken
}

/** Dirección pública de la app: APP_URL si está, si no la del pedido actual. */
export async function appBaseUrl(): Promise<string> {
  const fromEnv = process.env.APP_URL?.replace(/\/$/, '')
  if (fromEnv) return fromEnv
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

export function enlacePersonal(baseUrl: string, token: string): string {
  return `${baseUrl}/mi/${token}`
}

/** Enlace personal listo para mandar por WhatsApp (lo crea si hace falta). */
export async function enlaceDeTutor(payload: Payload, tutorId: number): Promise<string> {
  return enlacePersonal(await appBaseUrl(), await ensureToken(payload, tutorId))
}
