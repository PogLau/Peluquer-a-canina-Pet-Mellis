import config from '@payload-config'
import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from 'payload'

import { findTutorByToken, recordarTutor } from '@/lib/enlace-cliente'

/** Enlace personal del cliente: lo recuerda en este teléfono y lleva a «Mis turnos». */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const payload = await getPayload({ config })
  const tutor = await findTutorByToken(payload, token)
  if (!tutor) return NextResponse.redirect(new URL('/mis-turnos?enlace=invalido', request.url))
  await recordarTutor(token)
  return NextResponse.redirect(new URL('/mis-turnos', request.url))
}
