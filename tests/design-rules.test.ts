import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

import { describe, expect, it } from 'vitest'

/*
  Reglas del sistema de diseño que se pueden verificar en el código (CLAUDE.md §7 y §11):
  sin emojis, sin textos menores a 12 px, sin hex sueltos, sin <div onClick> y sin comentarios sueltos en JSX.
*/

const SRC = join(process.cwd(), 'src')
// Archivos generados por Payload y assets de marca con colores fijos
const IGNORED = ['app/(payload)', 'payload-types.ts', 'components/ui/Logo.tsx', 'lib/brand.ts']

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(tsx?|css)$/.test(name) ? [path] : []
  })
}

const files = sourceFiles(SRC)
  .map((path) => ({ path: relative(SRC, path).replaceAll('\\', '/'), text: readFileSync(path, 'utf8') }))
  .filter((f) => !IGNORED.some((ignored) => f.path.startsWith(ignored)))

function offenders(pattern: RegExp, only?: RegExp) {
  return files.filter((f) => (!only || only.test(f.path)) && pattern.test(f.text)).map((f) => f.path)
}

describe('reglas de diseño', () => {
  it('no hay emojis en la interfaz', () => {
    expect(offenders(/\p{Extended_Pictographic}/u)).toEqual([])
  })

  it('no hay textos menores a 12 px', () => {
    expect(offenders(/text-\[(?:[0-9]|1[01])(?:\.\d+)?px\]/)).toEqual([])
    expect(offenders(/font-size:\s*(?:[0-9]|1[01])(?:\.\d+)?px/)).toEqual([])
  })

  it('los colores salen de tokens: no hay hex sueltos fuera de globals.css', () => {
    expect(offenders(/#[0-9a-fA-F]{3,8}\b/, /\.tsx?$/)).toEqual([])
  })

  it('no se usa la paleta por defecto de Tailwind', () => {
    expect(offenders(/\b(?:bg|text|border)-(?:emerald|amber|gray|slate|zinc|orange|green|red)-\d{2,3}\b/)).toEqual([])
  })

  it('no hay <div onClick>', () => {
    expect(offenders(/<div[^>]*\sonClick=/, /\.tsx$/)).toEqual([])
  })

  it('no hay comentarios /* */ escritos como texto en JSX', () => {
    // Un comentario dentro de JSX debe ir como {/* ... */}; `>/*` o una línea que empieza con /* entre etiquetas lo delata
    expect(offenders(/[^=]>[ \t]*\/\*/, /\.tsx$/)).toEqual([])
  })
})
