import { isSlotFree, type OpcionesAgenda } from '@/lib/agenda'
import { canClientCancel } from '@/lib/cliente/libreta'
import { normalizeWhatsapp, validateBooking, type ReservaInput } from '@/lib/cliente/reserva'
import { nextStatus, statusLabel, type AppointmentStatus } from '@/lib/estados'
import type { Puntajes } from '@/lib/ficha'
import { parseEscaneo } from '@/lib/ia/cuidado'
import { validateVisit } from '@/lib/panel/atenciones'
import {
  parseMultiplier,
  parsePesos,
  preciosDesdeFila,
  validatePricing,
  type PreciosEditables,
} from '@/lib/panel/precios'
import type { Coat, Size } from '@/lib/pricing'

import { nextId, priceOf, tokenDemo, type DemoState, type DTurno, type DTutor } from './estado'

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

/** Cliente dueño de ese código de enlace, o null. Un código mal formado nunca coincide. */
export function tutorPorToken(s: DemoState, token: unknown): DTutor | null {
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{32}$/.test(token)) return null
  return s.tutores.find((t) => t.enlaceToken === token) ?? null
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
  // Solo se «recuerda» en este teléfono a quien tiene su enlace o es un cliente nuevo: escribir el
  // WhatsApp de otra persona no da acceso a sus datos (privacidad, igual que en la app real).
  let recordar = true
  if (sesion) tutorId = sesion.id
  else {
    const whatsapp = normalizeWhatsapp(input.whatsapp)
    const existente = s.tutores.find((t) => t.whatsapp === whatsapp)
    if (existente) {
      tutorId = existente.id
      recordar = false
    } else {
      const [conId, id] = nextId(estado)
      estado = {
        ...conId,
        tutores: [
          ...conId.tutores,
          { id, nombre: input.tutorNombre.trim(), whatsapp, zona: '', enlaceToken: tokenDemo() },
        ],
      }
      tutorId = id
    }
  }

  let mascotaId: number
  // Sin enlace no se tocan los perros ya cargados de ese cliente: se suma uno nuevo y la peluquera
  // lo revisa al aceptar la solicitud.
  const propias = sesion ? estado.mascotas.filter((m) => m.tutorId === tutorId) : []
  if (input.mascotaId !== null) {
    if (!propias.some((m) => m.id === input.mascotaId))
      throw new DemoError('Elegí uno de tus perros.')
    mascotaId = input.mascotaId
  } else {
    const m = input.mascota!
    const igual = propias.find(
      (p) => p.nombre.trim().toLowerCase() === m.nombre.trim().toLowerCase(),
    )
    if (igual) {
      // Mismo tutor y mismo nombre: es el mismo perro. Se actualizan sus datos con lo que se acaba
      // de cargar, así el turno y su precio usan el tamaño y el manto que la persona confirmó.
      mascotaId = igual.id
      estado = {
        ...estado,
        mascotas: estado.mascotas.map((p) =>
          p.id === igual.id
            ? {
                ...p,
                tamano: m.tamano as Size,
                manto: m.manto as Coat,
                raza: m.raza.trim() || p.raza,
              }
            : p,
        ),
      }
    } else {
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
    escaneo: parseEscaneo(input.escaneo),
  }
  nuevo.precioEstimado = priceOf(conId, nuevo)
  // Como en la app real: quien reserva por primera vez queda «recordado» en este teléfono
  return {
    estado: {
      ...conId,
      turnos: [...conId.turnos, nuevo],
      clienteId: recordar ? tutorId : s.clienteId,
    },
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

/** Guarda la tabla de precios del panel (ids = posición + 1, ver preciosEditables). Valida como la app real. */
export function guardarPrecios(s: DemoState, p: PreciosEditables): DemoState {
  const errores = validatePricing(p)
  if (Object.keys(errores).length) throw new DemoError('Revisá los valores marcados.')
  return {
    ...s,
    servicios: s.servicios.map((x, i) => {
      const n = p.servicios.find((y) => y.id === i + 1)
      if (!n) return x
      return {
        ...x,
        activo: n.activo,
        popular: n.popular,
        aplicaRecargoManto: n.aplicaRecargoManto,
        ...preciosDesdeFila(n),
      }
    }),
    extras: s.extras.map((x, i) => {
      const n = p.extras.find((y) => y.id === i + 1)
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
