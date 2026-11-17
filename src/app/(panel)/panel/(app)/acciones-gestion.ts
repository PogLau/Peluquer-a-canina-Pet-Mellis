'use server'

import { revalidatePath } from 'next/cache'

import {
  saveClient,
  savePet,
  validateClient,
  validatePet,
  type ClienteEditable,
  type ErroresCampos,
  type MascotaEditable,
} from '@/lib/panel/clientes'
import { savePricing, validatePricing, type PreciosEditables } from '@/lib/panel/precios'
import { requireStaff } from '@/lib/panel/sesion'
import { PanelError } from '@/lib/panel/turnos'

/* Acciones de la Fase 5 (Clientes y Precios). Cada una vuelve a verificar la sesión del salón. */

export type ResultadoGuardar =
  { ok: true; id?: number } | { ok: false; error: string; errores?: ErroresCampos }

async function guardar(fn: () => Promise<number | void>): Promise<ResultadoGuardar> {
  try {
    const id = await fn()
    revalidatePath('/panel', 'layout')
    revalidatePath('/', 'layout')
    return { ok: true, id: id ?? undefined }
  } catch (error) {
    if (error instanceof PanelError) return { ok: false, error: error.message }
    return { ok: false, error: 'No se pudo guardar. Revisá la conexión y probá de nuevo.' }
  }
}

export async function guardarCliente(c: ClienteEditable): Promise<ResultadoGuardar> {
  const { payload, user } = await requireStaff()
  const errores = validateClient(c)
  if (Object.keys(errores).length)
    return { ok: false, error: 'Revisá los campos marcados.', errores }
  return guardar(() => saveClient(payload, user, c))
}

export async function guardarMascota(
  tutorId: number,
  m: MascotaEditable,
): Promise<ResultadoGuardar> {
  const { payload, user } = await requireStaff()
  const errores = validatePet(m)
  if (Object.keys(errores).length)
    return { ok: false, error: 'Revisá los campos marcados.', errores }
  return guardar(() => savePet(payload, user, tutorId, m))
}

export async function guardarPrecios(p: PreciosEditables): Promise<ResultadoGuardar> {
  const { payload, user } = await requireStaff()
  const errores = validatePricing(p)
  if (Object.keys(errores).length)
    return { ok: false, error: 'Revisá los valores marcados.', errores }
  return guardar(() => savePricing(payload, user, p))
}
