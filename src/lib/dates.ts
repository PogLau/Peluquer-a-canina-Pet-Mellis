/*
  Fechas en la hora de Buenos Aires (UTC−3 todo el año, sin horario de verano).
  El servidor puede correr en UTC (Vercel): por eso los rangos se calculan acá y no con new Date() local.
*/
const AR_OFFSET_MS = 3 * 60 * 60 * 1000

function partsAR(date: Date): { y: number; m: number; d: number } {
  const shifted = new Date(date.getTime() - AR_OFFSET_MS)
  return { y: shifted.getUTCFullYear(), m: shifted.getUTCMonth(), d: shifted.getUTCDate() }
}

/** Inicio (incluido) y fin (excluido) del día en Buenos Aires, `dias` días desde `now`. En ISO UTC. */
export function dayRangeAR(now: Date = new Date(), dias = 0): { desde: string; hasta: string } {
  const { y, m, d } = partsAR(now)
  const desde = new Date(Date.UTC(y, m, d + dias) + AR_OFFSET_MS)
  const hasta = new Date(Date.UTC(y, m, d + dias + 1) + AR_OFFSET_MS)
  return { desde: desde.toISOString(), hasta: hasta.toISOString() }
}

/** Suma días a una fecha (para «próxima visita sugerida»). */
export function addDays(date: Date, dias: number): Date {
  return new Date(date.getTime() + dias * 24 * 60 * 60 * 1000)
}

/** Valor para un <input type="datetime-local"> en hora de Buenos Aires: «2026-11-17T14:30». */
export function toDateTimeLocalAR(date: Date): string {
  return new Date(date.getTime() - AR_OFFSET_MS).toISOString().slice(0, 16)
}

/** Lee un «2026-11-17T14:30» escrito en hora de Buenos Aires. Devuelve null si no es válido. */
export function fromDateTimeLocalAR(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null
  const date = new Date(`${value}:00.000-03:00`)
  return Number.isNaN(date.getTime()) ? null : date
}
