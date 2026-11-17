import type { Payload } from 'payload'

import { csvDate, csvTime, toCSV } from '@/lib/csv'
import { statusLabel } from '@/lib/estados'
import {
  lapsedClients,
  monthAR,
  revenue,
  summarize,
  topServices,
  weekAR,
  type ClienteVisitas,
  type TurnoInforme,
} from '@/lib/informes'
import type { Usuario } from '@/payload-types'

/* Datos de Informes (semana, mes, servicios más pedidos, clientes sin volver) y sus CSV. */

function nombreDe(v: unknown): string {
  return v && typeof v === 'object' && 'nombre' in v ? String((v as { nombre: string }).nombre) : ''
}
function idDe(v: unknown): number | null {
  if (v && typeof v === 'object' && 'id' in v) return (v as { id: number }).id
  return typeof v === 'number' ? v : null
}

export async function loadReport(payload: Payload, user: Usuario, now = new Date()) {
  const semana = weekAR(now)
  const mes = monthAR(now)
  const desde = semana.desde < mes.desde ? semana.desde : mes.desde
  const hasta = semana.hasta > mes.hasta ? semana.hasta : mes.hasta
  const opts = { overrideAccess: false, user, pagination: false } as const

  const [turnosRaw, tutores, mascotas, atenciones, proximos] = await Promise.all([
    payload.find({
      collection: 'turnos',
      where: {
        and: [{ fechaHora: { greater_than_equal: desde } }, { fechaHora: { less_than: hasta } }],
      },
      sort: 'fechaHora',
      depth: 1,
      ...opts,
    }),
    payload.find({ collection: 'tutores', depth: 0, ...opts }),
    payload.find({ collection: 'mascotas', depth: 0, ...opts }),
    payload.find({
      collection: 'atenciones',
      select: { fecha: true, mascota: true, turno: true, precioFinal: true },
      depth: 0,
      ...opts,
    }),
    payload.find({
      collection: 'turnos',
      where: {
        and: [
          { fechaHora: { greater_than_equal: now.toISOString() } },
          { estado: { in: ['solicitado', 'confirmado'] } },
        ],
      },
      select: { tutor: true },
      depth: 0,
      ...opts,
    }),
  ])

  const precioFinal = new Map<number, number>()
  for (const a of atenciones.docs) {
    const turnoId = idDe(a.turno)
    if (turnoId && typeof a.precioFinal === 'number') precioFinal.set(turnoId, a.precioFinal)
  }
  const turnos: TurnoInforme[] = turnosRaw.docs.map((t) => ({
    id: t.id,
    fechaHora: t.fechaHora,
    estado: t.estado,
    precioEstimado: t.precioEstimado ?? null,
    precioFinal: precioFinal.get(t.id) ?? null,
    servicios: (t.servicios ?? []).map(nombreDe).filter(Boolean),
    tutor: nombreDe(t.tutor),
    mascota: nombreDe(t.mascota),
  }))

  const tutorDeMascota = new Map(mascotas.docs.map((m) => [m.id, idDe(m.tutor)]))
  const ultima = new Map<number, string>()
  for (const a of atenciones.docs) {
    const tutor = tutorDeMascota.get(idDe(a.mascota) ?? -1)
    if (tutor && (!ultima.has(tutor) || ultima.get(tutor)! < a.fecha)) ultima.set(tutor, a.fecha)
  }
  const conProximo = new Set(proximos.docs.map((t) => idDe(t.tutor)))
  const clientes: ClienteVisitas[] = tutores.docs.map((t) => ({
    id: t.id,
    nombre: t.nombre,
    whatsapp: t.whatsapp,
    mascotas: mascotas.docs.filter((m) => idDe(m.tutor) === t.id).map((m) => m.nombre),
    ultimaVisita: ultima.get(t.id) ?? null,
    tieneTurnoProximo: conProximo.has(t.id),
  }))

  return {
    semana: summarize(turnos, semana),
    mes: summarize(turnos, mes),
    servicios: topServices(turnos, mes),
    sinVolver: lapsedClients(clientes, now),
    turnosMes: turnos.filter((t) => t.fechaHora >= mes.desde && t.fechaHora < mes.hasta),
  }
}

export type Reporte = Awaited<ReturnType<typeof loadReport>>
export const tiposCSV = ['turnos', 'servicios', 'sin-volver'] as const
export type TipoCSV = (typeof tiposCSV)[number]

export function reportCSV(tipo: TipoCSV, r: Reporte): { nombre: string; contenido: string } {
  const mes = r.mes.periodo.etiqueta
  if (tipo === 'servicios') {
    return {
      nombre: `servicios-mas-pedidos-${mes}.csv`,
      contenido: toCSV(
        ['Servicio', 'Cantidad'],
        r.servicios.map((s) => [s.servicio, s.cantidad]),
      ),
    }
  }
  if (tipo === 'sin-volver') {
    return {
      nombre: 'clientes-sin-volver.csv',
      contenido: toCSV(
        ['Cliente', 'WhatsApp', 'Perros', 'Última visita', 'Días sin venir'],
        r.sinVolver.map((c) => [
          c.nombre,
          c.whatsapp,
          c.mascotas.join(', '),
          csvDate(c.ultimaVisita),
          c.diasSinVenir,
        ]),
      ),
    }
  }
  return {
    nombre: `turnos-${mes}.csv`,
    contenido: toCSV(
      [
        'Fecha',
        'Hora',
        'Cliente',
        'Perro',
        'Servicios',
        'Estado',
        'Precio estimado',
        'Precio final',
        'Ingreso',
      ],
      r.turnosMes.map((t) => [
        csvDate(t.fechaHora),
        csvTime(t.fechaHora),
        t.tutor,
        t.mascota,
        t.servicios.join(' + '),
        statusLabel(t.estado),
        t.precioEstimado,
        t.precioFinal,
        revenue(t),
      ]),
    ),
  }
}
