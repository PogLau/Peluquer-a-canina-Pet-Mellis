import { dayRangeAR } from './dates'
import { formatLongDate } from './format'

/*
  Horarios libres para reservar (funciones puras).
  Una sola peluquera: cada turno ocupa `duracionMin` y no se superponen.
  Todo se calcula en hora de Buenos Aires (UTC−3, sin horario de verano).
*/

export const diasSemana = [
  'domingo',
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
] as const
export type DiaSemana = (typeof diasSemana)[number]

export type HorarioDia = { dia: string; abre: string; cierra: string }
export type HoraLibre = { hora: string; iso: string }
export type DiaLibre = { fecha: string; etiqueta: string; horas: HoraLibre[] }

export type OpcionesAgenda = {
  horarios: HorarioDia[]
  duracionMin: number
  /** Inicio (ISO) de los turnos que ya ocupan lugar (no cancelados). */
  ocupados: string[]
  now?: Date
  /** Cuántos días mostrar desde hoy. */
  dias?: number
  /** No se puede reservar con menos de esta anticipación. */
  anticipacionMin?: number
}

const AR_OFFSET_MS = 3 * 60 * 60 * 1000
const MIN = 60 * 1000

function minutos(hhmm: string): number | null {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm)
  return m ? Number(m[1]) * 60 + Number(m[2]) : null
}

function hhmm(totalMin: number): string {
  return `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`
}

export function freeSlots({
  horarios,
  duracionMin,
  ocupados,
  now = new Date(),
  dias = 14,
  anticipacionMin = 120,
}: OpcionesAgenda): DiaLibre[] {
  const dur = Math.max(15, duracionMin || 60)
  const tomados = ocupados.map((iso) => new Date(iso).getTime()).filter((t) => !Number.isNaN(t))
  const desdeMinimo = now.getTime() + anticipacionMin * MIN
  const resultado: DiaLibre[] = []

  for (let d = 0; d < dias; d++) {
    const inicioDia = new Date(dayRangeAR(now, d).desde).getTime()
    const dia = diasSemana[new Date(inicioDia - AR_OFFSET_MS).getUTCDay()]
    const horario = horarios.find((h) => h.dia === dia)
    if (!horario) continue
    const abre = minutos(horario.abre)
    const cierra = minutos(horario.cierra)
    if (abre === null || cierra === null) continue

    const horas: HoraLibre[] = []
    for (let m = abre; m + dur <= cierra; m += dur) {
      const inicio = inicioDia + m * MIN
      if (inicio < desdeMinimo) continue
      const choca = tomados.some((t) => t < inicio + dur * MIN && inicio < t + dur * MIN)
      if (!choca) horas.push({ hora: hhmm(m), iso: new Date(inicio).toISOString() })
    }
    if (horas.length) {
      const fecha = new Date(inicioDia - AR_OFFSET_MS).toISOString().slice(0, 10)
      resultado.push({
        fecha,
        etiqueta: formatLongDate(new Date(inicioDia + 12 * 60 * MIN)),
        horas,
      })
    }
  }
  return resultado
}

/** El servidor vuelve a chequear el horario elegido: tiene que estar entre los libres. */
export function isSlotFree(iso: string, opciones: OpcionesAgenda): boolean {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return false
  return freeSlots(opciones).some((d) => d.horas.some((h) => new Date(h.iso).getTime() === t))
}
