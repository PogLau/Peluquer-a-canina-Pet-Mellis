import { isSlotFree, type OpcionesAgenda } from '@/lib/agenda'
import { canClientCancel } from '@/lib/cliente/libreta'
import { normalizeWhatsapp, validateBooking, type ReservaInput } from '@/lib/cliente/reserva'
import { nextStatus, statusLabel, type AppointmentStatus } from '@/lib/estados'
import type { Puntajes } from '@/lib/ficha'
import { validateVisit } from '@/lib/panel/atenciones'
import { parseMultiplier, parsePesos } from '@/lib/panel/precios'
import type { Coat, Size } from '@/lib/pricing'

import { nextId, priceOf, type DemoState, type DTurno } from './estado'

/*
  Operaciones de la demo: las mismas reglas que la app real (estados, horarios libres,
  validaciones, precios), pero sobre el estado guardado en el navegador.
  Cada una devuelve un estado nuevo; si algo no se puede, lanza DemoError con el motivo.
*/

export class DemoError extends Error {}

const OCUPAN: AppointmentStatus[] = ['solicitado', 'confirmado', 'en_atencion', 'listo']

export function agendaOf(s: DemoState, now = new Date()): OpcionesAgenda {
  return {
    horarios: s.horarios,
    duracionMin: s.duracionMin,
    ocupados: s.turnos
      .filter((t) => OCUPAN.includes(t.estado) && new Date(t.fechaHora) >= now)
      .map((t) => t.fechaHora),
    now,
  }
}

function turno(s: DemoState, id: number): DTurno {
  const t = s.turnos.find((x) => x.id === id)
  if (!t) throw new DemoError('No encontramos ese turno.')
  return t
}

function actualizar(s: DemoState, id: number, patch: Partial<DTurno>): DemoState {
  return { ...s, turnos: s.turnos.map((t) => (t.id === id ? { ...t, ...patch } : t)) }
}

function cambiarEstado(s: DemoState, id: number, desde: AppointmentStatus, a: AppointmentStatus) {
  const t = turno(s, id)
  if (t.estado !== desde)
    throw new DemoError(`El turno ya estaba en «${statusLabel(t.estado).toLowerCase()}».`)
  return actualizar(s, id, { estado: a })
}

/** Un toque: confirmado → en atención → listo → finalizado. */
export function avanzar(s: DemoState, id: number, desde: AppointmentStatus): DemoState {
  const next = nextStatus(desde)
  if (!next) throw new DemoError('Este turno ya terminó.')
  return cambiarEstado(s, id, desde, next.estado)
}

export const aceptar = (s: DemoState, id: number) =>
  cambiarEstado(s, id, 'solicitado', 'confirmado')
export const rechazar = (s: DemoState, id: number) =>
  cambiarEstado(s, id, 'solicitado', 'cancelado')

export function proponer(s: DemoState, id: number, fecha: Date, now = new Date()): DemoState {
  if (fecha < now) throw new DemoError('Elegí un horario que no haya pasado.')
  if (turno(s, id).estado !== 'solicitado') throw new DemoError('Esta solicitud ya se respondió.')
  return actualizar(s, id, { fechaHora: fecha.toISOString() })
}

export type RegistroDemo = {
  turnoId: number
  servicios: string[]
  precioFinal: number | null
  etiquetaIds: number[]
  puntajes: Puntajes
  notaInterna: string
  resumenTutor: string
  recomendacion: string
}

export function registrarAtencion(
  s: DemoState,
  r: RegistroDemo,
  now = new Date(),
): [DemoState, number] {
  const errores = validateVisit({
    ...r,
    servicios: r.servicios.map((_, i) => i + 1),
    etiquetas: r.etiquetaIds,
  })
  const primero = Object.values(errores)[0]
  if (primero) throw new DemoError(primero)
  const t = turno(s, r.turnoId)
  if (s.atenciones.some((a) => a.turnoId === t.id))
    throw new DemoError('Esta atención ya está registrada.')
  if (t.estado === 'solicitado' || t.estado === 'cancelado')
    throw new DemoError('Primero confirmá el turno.')

  const [conId, id] = nextId(s)
  let siguiente: DemoState = {
    ...conId,
    atenciones: [
      ...conId.atenciones,
      {
        id,
        fecha: now.toISOString(),
        mascotaId: t.mascotaId,
        turnoId: t.id,
        servicios: r.servicios,
        precioFinal: r.precioFinal,
        puntajes: r.puntajes,
        etiquetaIds: r.etiquetaIds,
        notaInterna: r.notaInterna.trim(),
        resumenTutor: r.resumenTutor.trim(),
        recomendacion: r.recomendacion.trim(),
      },
    ],
  }
  if (t.estado === 'confirmado' || t.estado === 'en_atencion')
    siguiente = actualizar(siguiente, t.id, { estado: 'listo' })
  return [siguiente, id]
}

export function editarRecomendacion(s: DemoState, atencionId: number, texto: string): DemoState {
  return {
    ...s,
    atenciones: s.atenciones.map((a) =>
      a.id === atencionId ? { ...a, recomendacion: texto.trim() } : a,
    ),
  }
}

/**
 * Reserva desde la web. `conEnlace`: el visitante está «como» un cliente (en la app real, por su enlace personal).
 * Devuelve también si se creó un cliente nuevo: en ese caso la demo lo deja como cliente actual.
 */
export function reservar(
  s: DemoState,
  input: ReservaInput,
  conEnlace: boolean,
  now = new Date(),
): { estado: DemoState; turnoId: number; precio: number } {
  const sesion =
    conEnlace && s.clienteId ? (s.tutores.find((t) => t.id === s.clienteId) ?? null) : null
  const errores = validateBooking(
    input,
    sesion ? { id: sesion.id, nombre: sesion.nombre, whatsapp: sesion.whatsapp } : null,
  )
  const primero = Object.values(errores)[0]
  if (primero) throw new DemoError(primero)
  if (!isSlotFree(input.fechaHora, agendaOf(s, now)))
    throw new DemoError('Ese horario se acaba de ocupar. Elegí otro.')

  let estado = s
  let tutorId: number
  if (sesion) tutorId = sesion.id
  else {
    const whatsapp = normalizeWhatsapp(input.whatsapp)
    const existente = s.tutores.find((t) => t.whatsapp === whatsapp)
    if (existente) tutorId = existente.id
    else {
      const [conId, id] = nextId(estado)
      estado = {
        ...conId,
        tutores: [...conId.tutores, { id, nombre: input.tutorNombre.trim(), whatsapp, zona: '' }],
      }
      tutorId = id
    }
  }

  let mascotaId: number
  const propias = estado.mascotas.filter((m) => m.tutorId === tutorId)
  if (input.mascotaId !== null) {
    if (!propias.some((m) => m.id === input.mascotaId))
      throw new DemoError('Elegí uno de tus perros.')
    mascotaId = input.mascotaId
  } else {
    const m = input.mascota!
    const igual = propias.find(
      (p) => p.nombre.trim().toLowerCase() === m.nombre.trim().toLowerCase(),
    )
    if (igual) mascotaId = igual.id
    else {
      const [conId, id] = nextId(estado)
      estado = {
        ...conId,
        mascotas: [
          ...conId.mascotas,
          {
            id,
            tutorId,
            nombre: m.nombre.trim(),
            raza: m.raza.trim(),
            tamano: m.tamano as Size,
            manto: m.manto as Coat,
            pesoKg: null,
            cuidadosEspeciales: '',
            etiquetaIds: [],
          },
        ],
      }
      mascotaId = id
    }
  }

  const [conId, id] = nextId(estado)
  const nuevo: DTurno = {
    id,
    fechaHora: input.fechaHora,
    estado: 'solicitado',
    tutorId,
    mascotaId,
    servicios: input.servicios,
    extras: input.extras,
    nudos: input.nudos as DTurno['nudos'],
    precioEstimado: 0,
    origen: 'web',
    notasCliente: input.notas.trim(),
  }
  nuevo.precioEstimado = priceOf(conId, nuevo)
  // Como en la app real: quien reserva por primera vez queda «recordado» en este teléfono
  return {
    estado: { ...conId, turnos: [...conId.turnos, nuevo], clienteId: tutorId },
    turnoId: id,
    precio: nuevo.precioEstimado,
  }
}

export function cancelar(s: DemoState, turnoId: number, now = new Date()): DemoState {
  const t = turno(s, turnoId)
  if (t.tutorId !== s.clienteId) throw new DemoError('No encontramos ese turno.')
  if (!canClientCancel(t.estado, t.fechaHora, now))
    throw new DemoError('Faltan menos de 24 horas: para cancelar, escribinos por WhatsApp.')
  return actualizar(s, turnoId, { estado: 'cancelado' })
}

export type PreciosDemo = {
  servicios: Record<string, { chico: string; mediano: string; grande: string; activo: boolean }>
  extras: Record<string, { precio: string; activo: boolean }>
  multiplicadores: { corto: string; largo: string; rizado: string }
  recargos: { leves: string; moderados: string; severos: string }
}

/** Errores por campo («servicio.bano-corte.chico», «recargo.leves»…). Vacío si está todo bien. */
export function validarPrecios(p: PreciosDemo): Record<string, string> {
  const e: Record<string, string> = {}
  for (const [id, s] of Object.entries(p.servicios)) {
    for (const t of ['chico', 'mediano', 'grande'] as const)
      if (parsePesos(s[t]) === null) e[`servicio.${id}.${t}`] = 'Precio en pesos, sin centavos.'
  }
  for (const [id, x] of Object.entries(p.extras))
    if (parsePesos(x.precio) === null) e[`extra.${id}`] = 'Precio en pesos, sin centavos.'
  for (const k of ['corto', 'largo', 'rizado'] as const)
    if (parseMultiplier(p.multiplicadores[k]) === null) e[`multiplicador.${k}`] = 'Entre 1 y 3.'
  for (const k of ['leves', 'moderados', 'severos'] as const)
    if (parsePesos(p.recargos[k]) === null) e[`recargo.${k}`] = 'Precio en pesos.'
  if (!Object.values(p.servicios).some((s) => s.activo))
    e.servicios = 'Dejá al menos un servicio activo.'
  return e
}

export function guardarPrecios(s: DemoState, p: PreciosDemo): DemoState {
  return {
    ...s,
    servicios: s.servicios.map((x) => {
      const n = p.servicios[x.id]
      return n
        ? {
            ...x,
            activo: n.activo,
            precios: {
              chico: parsePesos(n.chico)!,
              mediano: parsePesos(n.mediano)!,
              grande: parsePesos(n.grande)!,
            },
          }
        : x
    }),
    extras: s.extras.map((x) => {
      const n = p.extras[x.id]
      return n ? { ...x, activo: n.activo, precio: parsePesos(n.precio)! } : x
    }),
    pricing: {
      multiplicadoresManto: {
        corto: parseMultiplier(p.multiplicadores.corto)!,
        largo: parseMultiplier(p.multiplicadores.largo)!,
        rizado: parseMultiplier(p.multiplicadores.rizado)!,
      },
      recargosNudos: {
        sin: 0,
        leves: parsePesos(p.recargos.leves)!,
        moderados: parsePesos(p.recargos.moderados)!,
        severos: parsePesos(p.recargos.severos)!,
      },
    },
  }
}
