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

/** «14:30» */
export function formatTime(date: Date): string {
  return time.format(date)
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

/** «$ 18.000 a $ 25.000», o un solo precio si no hay rango. */
export function formatRange(desde: number, hasta?: number): string {
  return hasta !== undefined && hasta > desde
    ? `${formatMoney(desde)} a ${formatMoney(hasta)}`
    : formatMoney(desde)
}

/** Precio de un extra: «$ 7.000 a $ 14.000» o «+15 a 25 %». */
export function formatExtraPrice(e: { tipo?: 'fijo' | 'porcentaje'; precio: number; precioHasta?: number }): string {
  if (e.tipo === 'porcentaje') {
    const hasta = e.precioHasta !== undefined && e.precioHasta > e.precio ? ` a ${e.precioHasta}` : ''
    return `+${e.precio}${hasta} %`
  }
  return formatRange(e.precio, e.precioHasta)
}
