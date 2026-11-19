import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

/*
  Contraste WCAG AA de los pares de color que usa la interfaz, leídos de globals.css (tema claro).
  Texto normal: 4,5:1 como mínimo.
*/

const css = readFileSync(join(process.cwd(), 'src/styles/globals.css'), 'utf8')
const root = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {')))

function token(name: string): string {
  const match = root.match(new RegExp(`--${name}:\\s*([^;]+);`))
  if (!match) throw new Error(`Falta el token --${name}`)
  const value = match[1].trim()
  const ref = value.match(/^var\(--([a-z-]+)\)$/)
  return ref ? token(ref[1]) : value
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function ratio(a: string, b: string): number {
  const [l1, l2] = [luminance(token(a)), luminance(token(b))].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

// [texto, fondo, dónde se usa]
const pares: Array<[string, string, string]> = [
  ['texto', 'fondo', 'texto principal sobre la página'],
  ['texto', 'superficie', 'texto en tarjetas'],
  ['texto', 'superficie-alt', 'texto en filas y botones deshabilitados'],
  ['texto-suave', 'fondo', 'texto secundario sobre la página'],
  ['texto-suave', 'superficie', 'texto secundario en tarjetas'],
  ['texto-suave', 'superficie-alt', 'texto de botones deshabilitados'],
  ['texto-suave', 'amarillo-claro', 'ayudas en tarjetas resaltadas'],
  ['sobre-accion', 'accion', 'CTA principal: marfil sobre verde'],
  ['marfil', 'verde-hover', 'CTA principal al pasar el mouse'],
  ['sobre-seleccion', 'seleccion', 'opción elegida: grafito sobre amarillo'],
  ['grafito', 'amarillo-hover', 'botón amarillo al pasar el mouse'],
  ['grafito', 'terracota', 'etiquetas especiales: grafito sobre terracota'],
  ['amarillo', 'verde', 'pestaña y rótulos amarillos sobre el header verde'],
  ['marfil', 'verde', 'texto del header y la navegación'],
  ['verde', 'fondo', 'rótulos y enlaces verdes sobre la página'],
  ['verde', 'superficie', 'rótulos verdes en tarjetas'],
  ['terracota-texto', 'fondo', 'texto terracota chico'],
  ['exito', 'exito-fondo', 'estado confirmado / listo'],
  ['aviso', 'aviso-fondo', 'estado solicitado y alertas de la ficha'],
  ['peligro', 'peligro-fondo', 'estado cancelado y errores'],
  ['info', 'info-fondo', 'estado en atención'],
]

describe('contraste de la paleta oficial (WCAG AA)', () => {
  it.each(pares)('%s sobre %s (%s) llega a 4,5:1', (texto, fondo) => {
    expect(ratio(texto, fondo)).toBeGreaterThanOrEqual(4.5)
  })

  it('los colores oficiales del manual están definidos', () => {
    expect(token('grafito')).toBe('#2c2c2c')
    expect(token('marfil')).toBe('#faf6ef')
    expect(token('amarillo')).toBe('#f5c518')
    expect(token('verde')).toBe('#0d3d2b')
    expect(token('terracota')).toBe('#d97a54')
  })
})
