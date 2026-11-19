import { describe, expect, it } from 'vitest'

import { extras, pricingConfig, servicios } from '@/lib/catalogo-demo'
import { buildQuote, servicePrice, sizeFromWeight, type PricingConfig, type Service } from '@/lib/pricing'

const catalog = { servicios, extras }
const banoCorte = servicios.find((s) => s.id === 'bano-corte') as Service
const unas = servicios.find((s) => s.id === 'unas') as Service

describe('tarifario 2027 con precios fijos', () => {
  it('tiene los cinco servicios principales, el servicio suelto y los adicionales', () => {
    expect(servicios.map((s) => s.id)).toEqual([
      'bano-higienico',
      'bano-corte-higienico',
      'bano-corte',
      'deslanado',
      'adaptacion',
      'unas',
    ])
    expect(extras.map((e) => e.id)).toEqual(['medicado', 'antipulgas', 'manejo-especial', 'traslado'])
  })

  it('cada servicio tiene un único precio por tamaño, sin rangos', () => {
    for (const s of servicios) {
      expect(Object.keys(s)).not.toContain('preciosHasta')
      for (const size of ['chico', 'mediano', 'grande', 'gigante'] as const) {
        expect(Number.isInteger(s.precios[size])).toBe(true)
        expect(s.precios[size] % 1000).toBe(0)
      }
    }
    for (const e of extras) expect(Object.keys(e)).not.toContain('precioHasta')
  })

  it('baño y corte completo: punto medio del rango del tarifario', () => {
    // Chico $32.000–$48.000 → $40.000; gigante $82.000–$105.000 → $94.000 (redondeado a $1.000)
    expect(banoCorte.precios).toEqual({ chico: 40000, mediano: 54000, grande: 71000, gigante: 94000 })
  })
})

describe('servicePrice', () => {
  it('con multiplicador 1 el manto no cambia el precio', () => {
    expect(servicePrice(banoCorte, 'chico', 'rizado', pricingConfig)).toBe(40000)
    expect(servicePrice(banoCorte, 'chico', 'corto', pricingConfig)).toBe(40000)
  })

  it('si el panel vuelve a usar el multiplicador, se aplica y redondea a 100', () => {
    const config: PricingConfig = { ...pricingConfig, multiplicadoresManto: { corto: 1, largo: 1.15, rizado: 1.2 } }
    expect(servicePrice(banoCorte, 'chico', 'largo', config)).toBe(46000)
    expect(servicePrice(unas, 'gigante', 'rizado', config)).toBe(8000)
  })
})

describe('buildQuote', () => {
  it('Toby (chico, nudos moderados) + baño y corte completo + antipulgas = $69.000', () => {
    const quote = buildQuote(
      { tamano: 'chico', manto: 'rizado', nudos: 'moderados', servicioIds: ['bano-corte'], extraIds: ['antipulgas'] },
      catalog,
      pricingConfig,
    )
    expect(quote.total).toBe(40000 + 11000 + 18000)
    expect(quote).not.toHaveProperty('totalHasta')
  })

  it('suma el desenredado de nudos una sola vez, en una línea aparte', () => {
    const quote = buildQuote(
      {
        tamano: 'mediano',
        manto: 'largo',
        nudos: 'severos',
        servicioIds: ['bano-higienico', 'deslanado', 'bano-corte'],
        extraIds: [],
      },
      catalog,
      pricingConfig,
    )
    const recargos = quote.lineas.filter((l) => l.tipo === 'recargo')
    expect(recargos).toHaveLength(1)
    expect(recargos[0].monto).toBe(25000)
    expect(quote.total).toBe(30000 + 48000 + 54000 + 25000)
  })

  it('el plus por manejo especial es un 20 % fijo sobre los servicios', () => {
    const quote = buildQuote(
      { tamano: 'mediano', manto: 'corto', nudos: 'sin', servicioIds: ['bano-higienico'], extraIds: ['manejo-especial'] },
      catalog,
      pricingConfig,
    )
    const plus = quote.lineas.find((l) => l.id === 'manejo-especial')
    expect(plus).toMatchObject({ monto: 6000 })
    expect(plus?.nombre).toContain('+20 %')
    expect(quote.total).toBe(36000)
  })

  it('no cobra nudos si ningún servicio tiene recargo por manto', () => {
    const quote = buildQuote(
      { tamano: 'chico', manto: 'rizado', nudos: 'severos', servicioIds: ['unas'], extraIds: ['traslado'] },
      catalog,
      pricingConfig,
    )
    expect(quote.recargoNudos).toBe(0)
    expect(quote.total).toBe(8000 + 11000)
  })

  it('sin servicios ni extras el total es 0', () => {
    const quote = buildQuote(
      { tamano: 'grande', manto: 'corto', nudos: 'leves', servicioIds: [], extraIds: [] },
      catalog,
      pricingConfig,
    )
    expect(quote.total).toBe(0)
    expect(quote.lineas).toEqual([])
  })
})

describe('sizeFromWeight', () => {
  it('clasifica por peso en cuatro tamaños', () => {
    expect(sizeFromWeight(10)).toBe('chico')
    expect(sizeFromWeight(25)).toBe('mediano')
    expect(sizeFromWeight(40)).toBe('grande')
    expect(sizeFromWeight(45)).toBe('gigante')
    expect(() => sizeFromWeight(0)).toThrow()
  })
})
