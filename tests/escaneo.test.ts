import { describe, expect, it } from 'vitest'

import { extras, pricingConfig, servicios } from '@/lib/catalogo-demo'
import { aplicarPlan, estadoDesdeParams, estadoInicial, reservarHref } from '@/lib/cotizacion'
import {
  escaneoDesdeParams,
  estadoPelaje,
  mantoDeTextura,
  notaDeIngreso,
  parseEscaneo,
  planDelCatalogo,
  tratamientoSugerido,
  type EscaneoTurno,
} from '@/lib/ia/cuidado'
import { ejemplosMascota } from '@/lib/ia/ejemplos'
import { escaneoDeSugerencia, parseSugerencia } from '@/lib/ia/sugerencia'
import { buildQuote } from '@/lib/pricing'

const catalog = { servicios, extras }

describe('IA Scan & Care: reglas del tratamiento', () => {
  it('con nudos moderados o severos, primero se desenreda', () => {
    expect(tratamientoSugerido({ nudos: 'moderados', hidratacion: 'baja', textura: 'largo' })).toBe('spa-desenredado')
    expect(tratamientoSugerido({ nudos: 'severos', hidratacion: 'buena', textura: 'corto' })).toBe('spa-desenredado')
  })

  it('pelo seco sin nudos fuertes: hidratación profunda', () => {
    expect(tratamientoSugerido({ nudos: 'leves', hidratacion: 'baja', textura: 'rizado' })).toBe('hidratacion-profunda')
  })

  it('manto largo, rizado o mixto en buen estado: corte de raza; corto: mantenimiento', () => {
    expect(tratamientoSugerido({ nudos: 'sin', hidratacion: 'buena', textura: 'mixto' })).toBe('corte-raza')
    expect(tratamientoSugerido({ nudos: 'sin', hidratacion: 'media', textura: 'corto' })).toBe('mantenimiento')
  })

  it('el pelaje mixto se cotiza como rizado', () => {
    expect(mantoDeTextura('mixto')).toBe('rizado')
    expect(mantoDeTextura('largo')).toBe('largo')
  })

  it('describe el estado del pelaje con los datos', () => {
    expect(estadoPelaje({ nudos: 'leves', hidratacion: 'baja' })).toBe('Pelo seco y opaco, nudos leves.')
  })
})

describe('IA Scan & Care: plan y precio', () => {
  it('cada tratamiento encuentra sus servicios en el catálogo', () => {
    expect(planDelCatalogo('corte-raza', catalog)).toEqual({ servicioIds: ['bano-corte'], extraIds: [] })
    expect(planDelCatalogo('spa-desenredado', catalog)).toEqual({ servicioIds: ['bano-higienico'], extraIds: [] })
    expect(planDelCatalogo('hidratacion-profunda', catalog)).toEqual({
      servicioIds: ['bano-higienico'],
      extraIds: ['medicado'],
    })
  })

  it('si la peluquera renombró los servicios, se respeta lo elegido', () => {
    const renombrados = { servicios: servicios.map((s) => ({ ...s, nombre: `Otro ${s.nombre}` })), extras }
    const yorkie = ejemplosMascota.find((e) => e.id === 'yorkshire')!.sugerencia
    const estado = { ...estadoInicial(), servicioIds: ['unas'], extraIds: ['traslado'] }
    expect(aplicarPlan(estado, yorkie, renombrados)).toMatchObject({ servicioIds: ['unas'], extraIds: ['traslado'] })
  })

  it('el plan del caniche (spa de desenredado) suma el recargo por nudos una sola vez', () => {
    const caniche = ejemplosMascota.find((e) => e.id === 'caniche')!.sugerencia
    const plan = aplicarPlan({ ...estadoInicial(), servicioIds: ['bano-corte'] }, caniche, catalog)
    const quote = buildQuote(plan, catalog, pricingConfig)
    // Baño higiénico simple, chico: $18.000 a $25.000; + desenredado de nudos moderados $18.000
    expect(quote.total).toBe(18000 + 18000)
    expect(quote.totalHasta).toBe(25000 + 18000)
    expect(quote.lineas.filter((l) => l.tipo === 'recargo')).toHaveLength(1)
  })
})

describe('IA Scan & Care: los ejemplos', () => {
  it('son válidos, tienen foto y texto alternativo, y están rotulados como ejemplo', () => {
    for (const e of ejemplosMascota) {
      expect(parseSugerencia(e.sugerencia)).not.toBeNull()
      expect(e.sugerencia.origen).toBe('ejemplo')
      expect(e.foto).toMatch(/^\/fotos\/[a-z-]+\.webp$/)
      expect(e.alt.length).toBeGreaterThan(10)
    }
  })

  it('muestran los cuatro tratamientos', () => {
    expect(new Set(ejemplosMascota.map((e) => e.sugerencia.tratamiento)).size).toBe(4)
  })
})

describe('IA Scan & Care: el escaneo viaja hasta el panel', () => {
  const escaneo: EscaneoTurno = escaneoDeSugerencia(ejemplosMascota[1]!.sugerencia)

  it('va y vuelve por la URL de la reserva junto con el presupuesto', () => {
    const estado = aplicarPlan(estadoInicial(), ejemplosMascota[1]!.sugerencia, catalog)
    const url = new URL(reservarHref(estado, escaneo), 'http://x')
    expect(escaneoDesdeParams(url.searchParams)).toEqual(escaneo)
    expect(estadoDesdeParams(url.searchParams)).toMatchObject({ manto: 'largo', nudos: 'leves' })
  })

  it('descarta escaneos inventados o incompletos', () => {
    expect(parseEscaneo({ ...escaneo, tratamiento: 'magia' })).toBeNull()
    expect(parseEscaneo({ ...escaneo, origen: 'otro' })).toBeNull()
    expect(parseEscaneo({ ...escaneo, raza: '   ' })).toBeNull()
    expect(parseEscaneo('texto')).toBeNull()
    expect(escaneoDesdeParams(new URLSearchParams('raza=x&textura=lacio'))).toBeNull()
  })

  it('arma la nota interna de ingreso con el origen a la vista', () => {
    expect(notaDeIngreso(escaneo)).toContain('ejemplo de demo')
    expect(notaDeIngreso(escaneo)).toContain('Baño de hidratación profunda')
  })
})
