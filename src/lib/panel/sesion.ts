import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload, type Payload } from 'payload'

import type { Usuario } from '@/payload-types'

export type StaffSession = { payload: Payload; user: Usuario }

/** Sesión del salón (cookie de Payload). Null si no hay sesión o si no es un usuario del salón. */
export async function getStaffSession(): Promise<StaffSession | null> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'usuarios') return null
  return { payload, user: user as Usuario }
}

/** Para páginas y acciones del panel: sin sesión, manda a ingresar. */
export async function requireStaff(): Promise<StaffSession> {
  const session = await getStaffSession()
  if (!session) redirect('/panel/ingresar')
  return session
}
