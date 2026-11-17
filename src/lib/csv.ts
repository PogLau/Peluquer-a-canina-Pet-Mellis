/*
  CSV para abrir en Excel o Google Sheets en español:
  separado por punto y coma (la coma es el decimal), con BOM para que las tildes se vean bien
  y fin de línea CRLF.
*/

export type Celda = string | number | null | undefined

function celda(value: Celda): string {
  if (value === null || value === undefined) return ''
  const texto = String(value)
  // Evita que una celda que empieza con = + - @ se interprete como fórmula al abrir el archivo
  const seguro = /^[=+\-@]/.test(texto) && typeof value !== 'number' ? `'${texto}` : texto
  return /[;"\r\n]/.test(seguro) ? `"${seguro.replace(/"/g, '""')}"` : seguro
}

const BOM = String.fromCharCode(0xfeff)

export function toCSV(encabezados: string[], filas: Celda[][]): string {
  return (
    BOM + [encabezados, ...filas].map((fila) => fila.map(celda).join(';')).join('\r\n') + '\r\n'
  )
}

const fechaCorta = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'America/Argentina/Buenos_Aires',
})
const hora = new Intl.DateTimeFormat('es-AR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'America/Argentina/Buenos_Aires',
})

/** 17/11/2026 */
export function csvDate(iso: string | null): string {
  return iso ? fechaCorta.format(new Date(iso)) : ''
}

/** 14:30 */
export function csvTime(iso: string): string {
  return hora.format(new Date(iso))
}
