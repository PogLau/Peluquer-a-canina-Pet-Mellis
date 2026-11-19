const money = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

/** $ 15.200 */
export function formatMoney(amount: number): string {
  return money.format(amount)
}

const longDate = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'America/Argentina/Buenos_Aires',
})

const time = new Intl.DateTimeFormat('es-AR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'America/Argentina/Buenos_Aires',
})

/** «lunes 16 de noviembre». Nunca escribir fechas fijas: se calculan. */
export function formatLongDate(date: Date): string {
  return longDate.format(date).replace(',', '')
}

/** «14:30 hs». Toda hora que ve la gente lleva «hs» al final. */
export function formatTime(date: Date): string {
  return `${time.format(date)} hs`
}

/** «09:00» → «09:00 hs» (horas que ya vienen como texto: agenda, horarios del local). */
export function conHs(hora: string): string {
  return `${hora} hs`
}

/** Franja horaria: «09:00 a 18:00 hs». */
export function franjaHoraria(abre: string, cierra: string): string {
  return `${abre} a ${cierra} hs`
}

const shortDate = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'short',
  timeZone: 'America/Argentina/Buenos_Aires',
})

/** «18 sep» (columnas de la Ficha Evolutiva) */
export function formatShortDate(date: Date): string {
  return shortDate.format(date).replace('.', '')
}

/** Precio de un extra: «$ 11.000» o «+20 %» (porcentaje sobre los servicios). */
export function formatExtraPrice(e: { tipo?: 'fijo' | 'porcentaje'; precio: number }): string {
  return e.tipo === 'porcentaje' ? `+${e.precio} %` : formatMoney(e.precio)
}
