import { describe, expect, it } from 'vitest'

import { isActive } from '@/components/ui/Nav'

describe('menú: qué sección está activa', () => {
  it('«Hoy» queda marcado en /panel y en /panel/ (la demo estática usa barra final)', () => {
    expect(isActive('/panel', '/panel', '/panel')).toBe(true)
    expect(isActive('/panel/', '/panel', '/panel')).toBe(true)
    expect(isActive('/panel/mascotas/', '/panel', '/panel')).toBe(false)
  })

  it('las secciones se marcan también en sus subpáginas', () => {
    expect(isActive('/panel/mascotas/', '/panel/mascotas', '/panel')).toBe(true)
    expect(isActive('/panel/mascotas/3/', '/panel/mascotas', '/panel')).toBe(true)
    expect(isActive('/panel/precios/', '/panel/mascotas', '/panel')).toBe(false)
  })

  it('el inicio del cliente solo se marca en «/»', () => {
    expect(isActive('/', '/', '/')).toBe(true)
    expect(isActive('/cotizar/', '/', '/')).toBe(false)
  })
})
