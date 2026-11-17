import { dayRangeAR } from './dates'
import type { AppointmentStatus } from './estados'

/*
  Informes del salón (funciones puras, en hora de Buenos Aires).
  Ingresos estimados: precio final de la atención si existe; si no, el precio estimado del turno.
  Los cancelados no suman.
*/

export type TurnoInforme = {
  id: number
  fechaHora: string
  estado: AppointmentStatus
  precioEstimado: number | null
  precioFinal: number | null
  servicios: string[]
  tutor: string
  mascota: string
}

export type ClienteVisitas = {
  id: number
  nombre: string
  whatsapp: string
  mascotas: string[]
  ultimaVisita: string | null
  tieneTurnoProximo: boolean
}

export type Periodo = { desde: string; hasta: string; etiqueta: string }

export type ResumenPeriodo = {
  periodo: Periodo
  total: number
  porEstado: Record<AppointmentStatus, number>
  cancelados: number
  ingresos: number
}

const AR_OFFSET_MS = 3 * 60 * 60 * 1000
const DIA_MS = 24 * 60 * 60 * 1000
const meses = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

/** Semana de lunes a domingo que contiene `now`. */
export function weekAR(now = new Date()): Periodo {
  const hoy = new Date(dayRangeAR(now).desde).getTime()
  const diaSemana = new Date(hoy - AR_OFFSET_MS).getUTCDay() // 0 = domingo
  const desde = hoy - ((diaSemana + 6) % 7) * DIA_MS
  return {
    desde: new Date(desde).toISOString(),
    hasta: new Date(desde + 7 * DIA_MS).toISOString(),
    etiqueta: 'esta semana',
  }
}

/** Mes calendario que contiene `now`. */
export function monthAR(now = new Date()): Periodo {
  const local = new Date(now.getTime() - AR_OFFSET_MS)
  const y = local.getUTCFullYear()
  const m = local.getUTCMonth()
  return {
    desde: new Date(Date.UTC(y, m, 1) + AR_OFFSET_MS).toISOString(),
    hasta: new Date(Date.UTC(y, m + 1, 1) + AR_OFFSET_MS).toISOString(),
    etiqueta: meses[m],
  }
}

export function inPeriod(t: { fechaHora: string }, p: Periodo): boolean {
  return t.fechaHora >= p.desde && t.fechaHora < p.hasta
}

export function revenue(t: TurnoInforme): number {
  if (t.estado === 'cancelado') return 0
  return t.precioFinal ?? t.precioEstimado ?? 0
}

export function summarize(turnos: TurnoInforme[], periodo: Periodo): ResumenPeriodo {
  const del = turnos.filter((t) => inPeriod(t, periodo))
  const porEstado = {
    solicitado: 0,
    confirmado: 0,
    en_atencion: 0,
    listo: 0,
    finalizado: 0,
    cancelado: 0,
  }
  for (const t of del) porEstado[t.estado]++
  return {
    periodo,
    total: del.length - porEstado.cancelado,
    porEstado,
    cancelados: porEstado.cancelado,
    ingresos: del.reduce((s, t) => s + revenue(t), 0),
  }
}

/** Servicios más pedidos (sin cancelados), de mayor a menor. */
export function topServices(
  turnos: TurnoInforme[],
  periodo: Periodo,
): Array<{ servicio: string; cantidad: number }> {
  const cuenta = new Map<string, number>()
  for (const t of turnos) {
    if (t.estado === 'cancelado' || !inPeriod(t, periodo)) continue
    for (const s of t.servicios) cuenta.set(s, (cuenta.get(s) ?? 0) + 1)
  }
  return [...cuenta.entries()]
    .map(([servicio, cantidad]) => ({ servicio, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad || a.servicio.localeCompare(b.servicio, 'es'))
}

/** Clientes que vinieron alguna vez, no vuelven hace más de `dias` y no tienen un turno próximo. */
export function lapsedClients(clientes: ClienteVisitas[], now = new Date(), dias = 60) {
  const limite = now.getTime() - dias * DIA_MS
  return clientes
    .filter(
      (c) => c.ultimaVisita && new Date(c.ultimaVisita).getTime() < limite && !c.tieneTurnoProximo,
    )
    .map((c) => ({
      ...c,
      diasSinVenir: Math.floor((now.getTime() - new Date(c.ultimaVisita!).getTime()) / DIA_MS),
    }))
    .sort((a, b) => b.diasSinVenir - a.diasSinVenir)
}
