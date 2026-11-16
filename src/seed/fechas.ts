/*
  Fechas del seed, siempre relativas al día en que corre (nunca fijas).
  Buenos Aires es UTC−3 todo el año (sin horario de verano).
*/
const AR_OFFSET_HOURS = 3

function todayInBuenosAires(now: Date): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return { y: get('year'), m: get('month'), d: get('day') }
}

/** Fecha en Buenos Aires: `dias` desde hoy, a la hora `hh:mm`. Devuelve ISO en UTC. */
export function arDate(dias: number, hhmm: string, now = new Date()): string {
  const { y, m, d } = todayInBuenosAires(now)
  const [hh, mm] = hhmm.split(':').map(Number)
  return new Date(Date.UTC(y, m - 1, d + dias, hh + AR_OFFSET_HOURS, mm)).toISOString()
}
