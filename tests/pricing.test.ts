import { describe, expect, it } from 'vitest'

import { extras, pricingConfig, servicios } from '@/lib/catalogo-demo'
import { buildQuote, servicePrice, sizeFromWeight, startingPrice, type Service } from '@/lib/pricing'

const catalog = { servicios, extras }
const banoCorte = servicios.find((s) => s.id === 'bano-corte') as Service
const unas = servicios.find((s) => s.id === 'unas') as Service

describe('servicePrice', () => {
  it('aplica el multiplicador de manto y redondea a 100', () => {
    expect(servicePrice(banoCorte, 'chico', 'rizado', pricingConfig)).toBe(10200)
    expect(servicePrice(banoCorte, 'chico', 'largo', pricingConfig)).toBe(9800) // 9775 → 9800
    expect(servicePrice(banoCorte, 'grande', 'corto', pricingConfig)).toBe(15000)
  })

  it('no aplica el multiplicador a servicios sin recargo por manto', () => {
    expect(servicePrice(unas, 'chico', 'rizado', pricingConfig)).toBe(2000)
  })
})

describe('buildQuote', () => {
  it('caso obligatorio: chico + rizado + nudos moderados + Baño y Corte + oídos = $15.200', () => {
    const quote = buildQuote(
      { tamano: 'chico', manto: 'rizado', nudos: 'moderados', servicioIds: ['bano-corte'], extraIds: ['oidos'] },
      catalog,
      pricingConfig,
    )
    expect(quote.subtotalServicios).toBe(10200)
    expect(quote.subtotalExtras).toBe(1500)
    expect(quote.recargoNudos).toBe(3500)
    expect(quote.total).toBe(15200)
  })

  it('suma el recargo por nudos una sola vez, en una línea aparte', () => {
    const quote = buildQuote(
      {
        tamano: 'mediano',
        manto: 'largo',
        nudos: 'severos',
        servicioIds: ['bano-corte', 'deslanado', 'corte-estetico'],
        extraIds: [],
      },
      catalog,
      pricingConfig,
    )
    const recargos = quote.lineas.filter((l) => l.tipo === 'recargo')
    expect(recargos).toHaveLength(1)
    expect(recargos[0].monto).toBe(6000)
    expect(quote.total).toBe(quote.subtotalServicios + 6000)
  })

  it('el precio de cada línea de servicio coincide con el de su tarjeta (sin nudos)', () => {
    const quote = buildQuote(
      { tamano: 'chico', manto: 'rizado', nudos: 'severos', servicioIds: ['bano-corte'], extraIds: [] },
      catalog,
      pricingConfig,
    )
    const linea = quote.lineas.find((l) => l.id === 'bano-corte')
    expect(linea?.monto).toBe(servicePrice(banoCorte, 'chico', 'rizado', pricingConfig))
  })

  it('no cobra nudos si ningún servicio tiene recargo por manto', () => {
    const quote = buildQuote(
      { tamano: 'chico', manto: 'rizado', nudos: 'severos', servicioIds: ['unas'], extraIds: ['perfume'] },
      catalog,
      pricingConfig,
    )
    expect(quote.recargoNudos).toBe(0)
    expect(quote.lineas.some((l) => l.tipo === 'recargo')).toBe(false)
    expect(quote.total).toBe(3000)
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

describe('sizeFromWeight y startingPrice', () => {
  it('clasifica por peso', () => {
    expect(sizeFromWeight(4)).toBe('chico')
    expect(sizeFromWeight(10)).toBe('chico')
    expect(sizeFromWeight(10.5)).toBe('mediano')
    expect(sizeFromWeight(25)).toBe('mediano')
    expect(sizeFromWeight(30)).toBe('grande')
    expect(() => sizeFromWeight(0)).toThrow()
  })

  it('el precio «desde» es el menor precio base', () => {
    expect(startingPrice(banoCorte)).toBe(8500)
  })
})
