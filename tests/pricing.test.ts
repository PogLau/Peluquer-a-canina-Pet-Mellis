import { describe, expect, it } from 'vitest'

import { extras, pricingConfig, servicios } from '@/lib/catalogo-demo'
import {
  buildQuote,
  servicePrice,
  servicePriceRange,
  sizeFromWeight,
  startingPrice,
  type PricingConfig,
  type Service,
} from '@/lib/pricing'

const catalog = { servicios, extras }
const banoCorte = servicios.find((s) => s.id === 'bano-corte') as Service
const unas = servicios.find((s) => s.id === 'unas') as Service

describe('tarifario 2027', () => {
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

  it('cada servicio tiene precio «desde» y «hasta» para los cuatro tamaños', () => {
    for (const s of servicios) {
      for (const size of ['chico', 'mediano', 'grande', 'gigante'] as const) {
        expect(s.precios[size]).toBeGreaterThan(0)
        expect(s.preciosHasta?.[size]).toBeGreaterThanOrEqual(s.precios[size])
      }
    }
  })

  it('baño y corte completo, gigante: $82.000 a $105.000', () => {
    expect(servicePriceRange(banoCorte, 'gigante', 'largo', pricingConfig)).toEqual({ desde: 82000, hasta: 105000 })
  })
})

describe('servicePrice', () => {
  it('con el tarifario 2027 el manto no cambia el precio (multiplicador 1)', () => {
    expect(servicePrice(banoCorte, 'chico', 'rizado', pricingConfig)).toBe(32000)
    expect(servicePrice(banoCorte, 'chico', 'corto', pricingConfig)).toBe(32000)
  })

  it('si el panel vuelve a usar el multiplicador, se aplica a «desde» y «hasta» y redondea a 100', () => {
    const config: PricingConfig = { ...pricingConfig, multiplicadoresManto: { corto: 1, largo: 1.15, rizado: 1.2 } }
    expect(servicePriceRange(banoCorte, 'chico', 'largo', config)).toEqual({ desde: 36800, hasta: 55200 })
  })

  it('no aplica el multiplicador a servicios sin recargo por manto', () => {
    const config: PricingConfig = { ...pricingConfig, multiplicadoresManto: { corto: 1, largo: 1.15, rizado: 1.2 } }
    expect(servicePriceRange(unas, 'gigante', 'rizado', config)).toEqual({ desde: 6000, hasta: 10000 })
  })
})

describe('buildQuote', () => {
  it('Toby (chico, rizado, nudos moderados) + baño y corte completo + antipulgas: $57.000 a $80.000', () => {
    const quote = buildQuote(
      { tamano: 'chico', manto: 'rizado', nudos: 'moderados', servicioIds: ['bano-corte'], extraIds: ['antipulgas'] },
      catalog,
      pricingConfig,
    )
    expect(quote.total).toBe(32000 + 7000 + 18000)
    expect(quote.totalHasta).toBe(48000 + 14000 + 18000)
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
    expect(recargos[0]).toMatchObject({ monto: 25000, montoHasta: 25000 })
    expect(quote.total).toBe(quote.subtotalServicios + 25000)
  })

  it('el plus por manejo especial es un porcentaje (15 % a 25 %) sobre los servicios', () => {
    const quote = buildQuote(
      { tamano: 'mediano', manto: 'corto', nudos: 'sin', servicioIds: ['bano-higienico'], extraIds: ['manejo-especial'] },
      catalog,
      pricingConfig,
    )
    const plus = quote.lineas.find((l) => l.id === 'manejo-especial')
    // 25.000 × 15 % = 3.750 → 3.800; 35.000 × 25 % = 8.750 → 8.800
    expect(plus).toMatchObject({ monto: 3800, montoHasta: 8800 })
    expect(plus?.nombre).toContain('15 a 25 %')
    expect(quote.total).toBe(25000 + 3800)
    expect(quote.totalHasta).toBe(35000 + 8800)
  })

  it('el precio de cada línea de servicio coincide con el de su tarjeta (sin nudos)', () => {
    const quote = buildQuote(
      { tamano: 'grande', manto: 'rizado', nudos: 'severos', servicioIds: ['bano-corte'], extraIds: [] },
      catalog,
      pricingConfig,
    )
    const linea = quote.lineas.find((l) => l.id === 'bano-corte')
    const rango = servicePriceRange(banoCorte, 'grande', 'rizado', pricingConfig)
    expect(linea).toMatchObject({ monto: rango.desde, montoHasta: rango.hasta })
  })

  it('no cobra nudos si ningún servicio tiene recargo por manto', () => {
    const quote = buildQuote(
      { tamano: 'chico', manto: 'rizado', nudos: 'severos', servicioIds: ['unas'], extraIds: ['traslado'] },
      catalog,
      pricingConfig,
    )
    expect(quote.recargoNudos).toBe(0)
    expect(quote.lineas.some((l) => l.tipo === 'recargo')).toBe(false)
    expect(quote.total).toBe(6000 + 6000)
    expect(quote.totalHasta).toBe(10000 + 15000)
  })

  it('sin servicios ni extras el total es 0', () => {
    const quote = buildQuote(
      { tamano: 'grande', manto: 'corto', nudos: 'leves', servicioIds: [], extraIds: [] },
      catalog,
      pricingConfig,
    )
    expect(quote.total).toBe(0)
    expect(quote.totalHasta).toBe(0)
    expect(quote.lineas).toEqual([])
  })
})

describe('sizeFromWeight y startingPrice', () => {
  it('clasifica por peso en cuatro tamaños', () => {
    expect(sizeFromWeight(4)).toBe('chico')
    expect(sizeFromWeight(10)).toBe('chico')
    expect(sizeFromWeight(10.5)).toBe('mediano')
    expect(sizeFromWeight(25)).toBe('mediano')
    expect(sizeFromWeight(30)).toBe('grande')
    expect(sizeFromWeight(40)).toBe('grande')
    expect(sizeFromWeight(45)).toBe('gigante')
    expect(() => sizeFromWeight(0)).toThrow()
  })

  it('el precio «desde» es el menor precio base', () => {
    expect(startingPrice(banoCorte)).toBe(32000)
  })
})
