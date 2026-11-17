import type { Payload } from 'payload'

import { scoreAspects } from '@/collections/options'
import { buildFicha, suggestRecommendation, type Puntajes } from '@/lib/ficha'
import { summaryMessage } from '@/lib/mensajes'
import type { Mascota, Tutore, Usuario } from '@/payload-types'

import { listVisits } from './mascotas'
import { PanelError, toTurnoPanel, type TurnoPanel } from './turnos'

/* Registrar atención: lo que se hizo, cómo se portó y qué conviene la próxima vez. */

export type OpcionCatalogo = { id: number; nombre: string }
export type OpcionEtiqueta = OpcionCatalogo & { tipo: 'alerta' | 'info' }

export type DatosRegistro = {
  turno: TurnoPanel
  serviciosTurno: number[]
  servicios: OpcionCatalogo[]
  etiquetas: OpcionEtiqueta[]
  etiquetasMascota: number[]
  recomendacionSugerida: string
  atencionExistente: number | null
}

export type RegistroInput = {
  turnoId: number
  servicios: number[]
  precioFinal: number | null
  etiquetas: number[]
  puntajes: Puntajes
  notaInterna: string
  resumenTutor: string
  recomendacion: string
}

export type ErroresRegistro = Partial<Record<keyof RegistroInput, string>>

export type ResultadoRegistro =
  | { ok: true; atencionId: number; mensaje: string; telefono: string }
  | { ok: false; error: string; errores?: ErroresRegistro }

const MAX_TEXTO = 2000

function ids(list: unknown[] | null | undefined): number[] {
  return (list ?? [])
    .map((v) => (v && typeof v === 'object' && 'id' in v ? (v as { id: number }).id : v))
    .filter((v): v is number => typeof v === 'number')
}

async function existingVisit(
  payload: Payload,
  user: Usuario,
  turnoId: number,
): Promise<number | null> {
  const found = await payload.find({
    collection: 'atenciones',
    where: { turno: { equals: turnoId } },
    limit: 1,
    depth: 0,
    overrideAccess: false,
    user,
  })
  return found.docs[0]?.id ?? null
}

export async function getRegisterData(
  payload: Payload,
  user: Usuario,
  turnoId: number,
): Promise<DatosRegistro | null> {
  let turnoRaw
  try {
    turnoRaw = await payload.findByID({
      collection: 'turnos',
      id: turnoId,
      depth: 2,
      overrideAccess: false,
      user,
    })
  } catch {
    return null
  }
  const turno = toTurnoPanel(turnoRaw)
  const mascota = typeof turnoRaw.mascota === 'object' ? (turnoRaw.mascota as Mascota) : null
  const [servicios, etiquetas, visitas, atencionExistente] = await Promise.all([
    payload.find({
      collection: 'servicios',
      sort: 'nombre',
      limit: 50,
      depth: 0,
      overrideAccess: false,
      user,
    }),
    payload.find({
      collection: 'etiquetas',
      sort: 'nombre',
      limit: 100,
      depth: 0,
      overrideAccess: false,
      user,
    }),
    listVisits(payload, user, turno.mascota.id),
    existingVisit(payload, user, turnoId),
  ])
  const ficha = buildFicha(visitas.map((v) => ({ fecha: v.fecha, puntajes: v.puntajes })))
  return {
    turno,
    serviciosTurno: ids(turnoRaw.servicios),
    servicios: servicios.docs.map((s) => ({ id: s.id, nombre: s.nombre })),
    etiquetas: etiquetas.docs.map((e) => ({ id: e.id, nombre: e.nombre, tipo: e.tipo })),
    etiquetasMascota: ids(mascota?.etiquetas),
    recomendacionSugerida: suggestRecommendation(ficha),
    atencionExistente,
  }
}

/** Valida lo que manda el formulario. Devuelve los errores por campo (vacío si está todo bien). */
export function validateVisit(input: RegistroInput): ErroresRegistro {
  const errores: ErroresRegistro = {}
  if (!Number.isInteger(input.turnoId)) errores.turnoId = 'Falta el turno.'
  if (!Array.isArray(input.servicios) || input.servicios.length === 0)
    errores.servicios = 'Elegí al menos un servicio.'
  if (
    input.precioFinal !== null &&
    (!Number.isInteger(input.precioFinal) || input.precioFinal < 0)
  ) {
    errores.precioFinal = 'Ingresá un precio en pesos, sin centavos.'
  }
  const fuera = scoreAspects.some(({ name }) => {
    const v = input.puntajes?.[name]
    return v !== null && v !== undefined && !(Number.isInteger(v) && v >= 1 && v <= 5)
  })
  if (fuera) errores.puntajes = 'Los puntajes van del 1 al 5.'
  for (const campo of ['notaInterna', 'resumenTutor', 'recomendacion'] as const) {
    if ((input[campo] ?? '').length > MAX_TEXTO) errores[campo] = `Hasta ${MAX_TEXTO} caracteres.`
  }
  return errores
}

export async function registerVisit(
  payload: Payload,
  user: Usuario,
  input: RegistroInput,
  now = new Date(),
): Promise<ResultadoRegistro> {
  const errores = validateVisit(input)
  if (Object.keys(errores).length)
    return { ok: false, error: 'Revisá los campos marcados.', errores }

  const datos = await getRegisterData(payload, user, input.turnoId)
  if (!datos) return { ok: false, error: 'No encontramos ese turno.' }
  if (datos.atencionExistente) return { ok: false, error: 'Esta atención ya está registrada.' }
  if (datos.turno.estado === 'cancelado' || datos.turno.estado === 'solicitado') {
    return { ok: false, error: 'Primero confirmá el turno.' }
  }

  const puntajes = Object.fromEntries(
    scoreAspects.map(({ name }) => [name, input.puntajes?.[name] ?? null]),
  )
  const atencion = await payload.create({
    collection: 'atenciones',
    data: {
      fecha: now.toISOString(),
      mascota: datos.turno.mascota.id,
      turno: input.turnoId,
      serviciosRealizados: input.servicios,
      precioFinal: input.precioFinal,
      etiquetas: input.etiquetas,
      puntajes,
      notaInterna: input.notaInterna.trim() || null,
      resumenTutor: input.resumenTutor.trim() || null,
      recomendacion: input.recomendacion.trim() || null,
    },
    overrideAccess: false,
    user,
  })

  // La mascota queda lista para retirar: el tutor lo ve en «Mis turnos»
  if (datos.turno.estado === 'confirmado' || datos.turno.estado === 'en_atencion') {
    await payload.update({
      collection: 'turnos',
      id: input.turnoId,
      data: { estado: 'listo' },
      overrideAccess: false,
      user,
    })
  }

  const nombres = new Map(datos.servicios.map((s) => [s.id, s.nombre]))
  const mensaje = summaryMessage({
    tutor: datos.turno.tutor.nombre,
    mascota: datos.turno.mascota.nombre,
    fecha: now,
    servicios: input.servicios.map((id) => nombres.get(id)).filter((n): n is string => !!n),
    resumenTutor: input.resumenTutor,
    recomendacion: input.recomendacion,
  })
  return { ok: true, atencionId: atencion.id, mensaje, telefono: datos.turno.tutor.whatsapp }
}

/** Edita la recomendación para la próxima visita (la última atención de la ficha). */
export async function updateRecommendation(
  payload: Payload,
  user: Usuario,
  atencionId: number,
  texto: string,
) {
  if (texto.length > MAX_TEXTO) throw new PanelError(`Hasta ${MAX_TEXTO} caracteres.`)
  await payload.update({
    collection: 'atenciones',
    id: atencionId,
    data: { recomendacion: texto.trim() || null },
    overrideAccess: false,
    user,
  })
}

/** Mensaje de resumen de una atención ya registrada (para reenviarlo desde la ficha). */
export async function summaryForVisit(payload: Payload, user: Usuario, atencionId: number) {
  const a = await payload.findByID({
    collection: 'atenciones',
    id: atencionId,
    depth: 2,
    overrideAccess: false,
    user,
  })
  const mascota = a.mascota as Mascota
  const tutor = mascota.tutor as Tutore
  const servicios = (a.serviciosRealizados ?? [])
    .map((s) => (typeof s === 'object' ? s.nombre : null))
    .filter((n): n is string => !!n)
  return {
    telefono: tutor.whatsapp,
    mensaje: summaryMessage({
      tutor: tutor.nombre,
      mascota: mascota.nombre,
      fecha: new Date(a.fecha),
      servicios,
      resumenTutor: a.resumenTutor,
      recomendacion: a.recomendacion,
    }),
  }
}
