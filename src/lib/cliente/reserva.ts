import type { Payload } from 'payload'

import { freeSlots, isSlotFree, type DiaLibre, type OpcionesAgenda } from '@/lib/agenda'
import type { TutorSesion } from '@/lib/enlace-cliente'
import { parseEscaneo, type EscaneoTurno } from '@/lib/ia/cuidado'
import { coats, knots, sizes, type Coat, type Knots, type Size } from '@/lib/pricing'

/*
  Reserva desde la web (sin login). Todo se valida en el servidor:
  el horario tiene que estar libre, la mascota tiene que ser del tutor y el precio lo calcula
  el hook de turnos con los precios vigentes. El turno queda «solicitado» hasta que el salón lo acepte.
*/

export type MascotaDelTutor = {
  id: number
  nombre: string
  raza: string | null
  tamano: Size
  manto: Coat
}

export type ReservaInput = {
  tutorNombre: string
  whatsapp: string
  mascotaId: number | null
  mascota: { nombre: string; raza: string; tamano: string; manto: string } | null
  servicios: string[]
  extras: string[]
  nudos: string
  fechaHora: string
  notas: string
  /** Consulta por foto: viene del cotizador. Se vuelve a validar antes de guardar. */
  escaneo?: EscaneoTurno | null
}

export type ErroresReserva = Partial<
  Record<'tutor' | 'whatsapp' | 'mascota' | 'servicios' | 'fechaHora' | 'notas', string>
>

export type ResultadoReserva =
  | {
      ok: true
      turnoId: number
      precioEstimado: number
      /** Solo si el tutor se creó recién: su enlace queda en este teléfono. */
      tokenNuevo: string | null
    }
  | { ok: false; error: string; errores?: ErroresReserva }

const OCUPAN = ['solicitado', 'confirmado', 'en_atencion', 'listo'] as const

/** Horarios, duración y turnos tomados: lo necesario para calcular los horarios libres. */
export async function agendaOptions(payload: Payload, now = new Date()): Promise<OpcionesAgenda> {
  const [config, turnos] = await Promise.all([
    payload.findGlobal({ slug: 'configuracion', depth: 0, overrideAccess: true }),
    payload.find({
      collection: 'turnos',
      where: {
        and: [
          { fechaHora: { greater_than_equal: now.toISOString() } },
          { estado: { in: [...OCUPAN] } },
        ],
      },
      select: { fechaHora: true },
      pagination: false,
      depth: 0,
      overrideAccess: true,
    }),
  ])
  return {
    horarios: (config.horarios ?? []).map((h) => ({ dia: h.dia, abre: h.abre, cierra: h.cierra })),
    duracionMin: config.duracionTurnoMin ?? 60,
    ocupados: turnos.docs.map((t) => t.fechaHora),
    now,
  }
}

export async function availableDays(payload: Payload, now = new Date()): Promise<DiaLibre[]> {
  return freeSlots(await agendaOptions(payload, now))
}

export async function petsOfTutor(payload: Payload, tutorId: number): Promise<MascotaDelTutor[]> {
  const r = await payload.find({
    collection: 'mascotas',
    where: { tutor: { equals: tutorId } },
    sort: 'nombre',
    depth: 0,
    limit: 20,
    overrideAccess: true,
  })
  return r.docs.map((m) => ({
    id: m.id,
    nombre: m.nombre,
    raza: m.raza ?? null,
    tamano: m.tamano,
    manto: m.manto,
  }))
}

function oneOf<T extends string>(list: readonly T[], v: string): v is T {
  return (list as readonly string[]).includes(v)
}

export function validateBooking(input: ReservaInput, sesion: TutorSesion | null): ErroresReserva {
  const e: ErroresReserva = {}
  if (!sesion) {
    const nombre = input.tutorNombre.trim()
    if (nombre.length < 2 || nombre.length > 80) e.tutor = 'Escribí tu nombre.'
    if (!/^\d{10,15}$/.test(input.whatsapp.replace(/\D/g, '')))
      e.whatsapp = 'Escribí tu WhatsApp con código de área, por ejemplo 11 2233 4455.'
  }
  if (input.mascotaId === null) {
    const m = input.mascota
    if (!m || m.nombre.trim().length < 1 || m.nombre.trim().length > 40)
      e.mascota = 'Escribí el nombre de tu perro.'
    else if (!oneOf(sizes, m.tamano) || !oneOf(coats, m.manto))
      e.mascota = 'Elegí el tamaño y el manto.'
    else if (m.raza.length > 60) e.mascota = 'La raza es muy larga.'
  }
  if (!input.servicios.length) e.servicios = 'Elegí al menos un servicio.'
  if (!oneOf(knots, input.nudos)) e.servicios = 'Elegí cómo están los nudos.'
  if (!input.fechaHora) e.fechaHora = 'Elegí día y horario.'
  if (input.notas.length > 500) e.notas = 'Hasta 500 caracteres.'
  return e
}

/** Normaliza un WhatsApp argentino escrito a mano a formato internacional (549 + área + número). */
export function normalizeWhatsapp(value: string): string {
  let d = value.replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  if (d.startsWith('54')) return d.startsWith('549') ? d : `549${d.slice(2)}`
  if (d.startsWith('0')) d = d.slice(1)
  return `549${d.replace(/^(\d{2,4})15/, '$1')}`
}

export async function createBooking(
  payload: Payload,
  input: ReservaInput,
  sesion: TutorSesion | null,
  now = new Date(),
): Promise<ResultadoReserva> {
  const errores = validateBooking(input, sesion)
  if (Object.keys(errores).length)
    return { ok: false, error: 'Revisá los datos marcados.', errores }

  if (!isSlotFree(input.fechaHora, await agendaOptions(payload, now))) {
    return {
      ok: false,
      error: 'Ese horario se acaba de ocupar. Elegí otro.',
      errores: { fechaHora: 'Ese horario ya no está libre.' },
    }
  }

  const [servicios, extras] = await Promise.all([
    payload.find({
      collection: 'servicios',
      where: { and: [{ slug: { in: input.servicios } }, { activo: { equals: true } }] },
      depth: 0,
      overrideAccess: true,
    }),
    input.extras.length
      ? payload.find({
          collection: 'extras',
          where: { and: [{ slug: { in: input.extras } }, { activo: { equals: true } }] },
          depth: 0,
          overrideAccess: true,
        })
      : null,
  ])
  if (servicios.docs.length !== new Set(input.servicios).size) {
    return {
      ok: false,
      error: 'Alguno de los servicios ya no está disponible.',
      errores: { servicios: 'Volvé a elegir los servicios.' },
    }
  }

  // Tutor: el del enlace personal; si no, se busca por WhatsApp o se crea
  let tutorId: number
  let tokenNuevo: string | null = null
  if (sesion) tutorId = sesion.id
  else {
    const whatsapp = normalizeWhatsapp(input.whatsapp)
    const existente = await payload.find({
      collection: 'tutores',
      where: { whatsapp: { equals: whatsapp } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existente.docs[0]) tutorId = existente.docs[0].id
    else {
      const nuevo = await payload.create({
        collection: 'tutores',
        data: { nombre: input.tutorNombre.trim(), whatsapp },
        overrideAccess: true,
      })
      tutorId = nuevo.id
      tokenNuevo = nuevo.enlaceToken ?? null
    }
  }

  // Mascota: una de las suyas, la misma por nombre, o una nueva
  let mascotaId: number
  // Sin enlace personal no se leen ni se modifican los perros ya cargados de ese cliente (alguien
  // podría escribir el WhatsApp de otra persona): se suma uno nuevo y la peluquera lo revisa.
  const propias = sesion ? await petsOfTutor(payload, tutorId) : []
  if (input.mascotaId !== null) {
    if (!sesion || !propias.some((m) => m.id === input.mascotaId)) {
      return {
        ok: false,
        error: 'Elegí uno de tus perros.',
        errores: { mascota: 'Elegí uno de tus perros.' },
      }
    }
    mascotaId = input.mascotaId
  } else {
    const m = input.mascota!
    const igual = propias.find(
      (p) => p.nombre.trim().toLowerCase() === m.nombre.trim().toLowerCase(),
    )
    if (igual) {
      // Mismo tutor y mismo nombre: es el mismo perro. Se actualizan sus datos con lo que se acaba
      // de cargar, así el turno y su precio usan el tamaño y el manto que la persona confirmó.
      await payload.update({
        collection: 'mascotas',
        id: igual.id,
        data: {
          tamano: m.tamano as Size,
          manto: m.manto as Coat,
          ...(m.raza.trim() ? { raza: m.raza.trim() } : {}),
        },
        overrideAccess: true,
      })
    }
    mascotaId = igual
      ? igual.id
      : (
          await payload.create({
            collection: 'mascotas',
            data: {
              nombre: m.nombre.trim(),
              raza: m.raza.trim() || null,
              tamano: m.tamano as Size,
              manto: m.manto as Coat,
              tutor: tutorId,
            },
            overrideAccess: true,
          })
        ).id
  }

  const turno = await payload.create({
    collection: 'turnos',
    data: {
      fechaHora: input.fechaHora,
      estado: 'solicitado',
      origen: 'web',
      tutor: tutorId,
      mascota: mascotaId,
      servicios: servicios.docs.map((s) => s.id),
      extras: extras?.docs.map((x) => x.id) ?? [],
      nudos: input.nudos as Knots,
      notasCliente: input.notas.trim() || null,
      escaneo: parseEscaneo(input.escaneo),
    },
    overrideAccess: true,
  })
  return { ok: true, turnoId: turno.id, precioEstimado: turno.precioEstimado ?? 0, tokenNuevo }
}
