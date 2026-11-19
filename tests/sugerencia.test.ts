import { afterEach, describe, expect, it, vi } from 'vitest'

import { extras, pricingConfig, servicios } from '@/lib/catalogo-demo'
import { aplicarSugerencia, estadoDesdeParams, estadoInicial, reservarHref } from '@/lib/cotizacion'
import { ejemplosMascota } from '@/lib/ia/ejemplos'
import { analizarConGemini, iaDisponible } from '@/lib/ia/gemini'
import { parseSugerencia } from '@/lib/ia/sugerencia'
import { buildQuote } from '@/lib/pricing'

const catalog = { servicios, extras }

describe('parseSugerencia', () => {
  it('acepta una respuesta válida y completa la confianza que falte', () => {
    const r = parseSugerencia({ raza: ' Caniche  Toy ', tamano: 'chico', manto: 'rizado', nudos: 'leves' })
    expect(r).toMatchObject({ raza: 'Caniche Toy', tamano: 'chico', confianza: { tamano: 'baja' } })
  })

  it('rechaza valores que no existen en el cotizador', () => {
    expect(parseSugerencia({ raza: 'Golden', tamano: 'enorme', manto: 'largo', nudos: 'sin' })).toBeNull()
    expect(parseSugerencia({ raza: 'Golden', tamano: 'grande', manto: 'lacio', nudos: 'sin' })).toBeNull()
    expect(parseSugerencia('texto suelto')).toBeNull()
  })

  it('reconoce cuando la foto no es de un perro', () => {
    expect(parseSugerencia({ esPerro: false })).toEqual({ esPerro: false })
  })
})

describe('ejemplos de la demo', () => {
  it('son válidos y están marcados como ejemplo (no como análisis de IA)', () => {
    for (const e of ejemplosMascota) {
      expect(parseSugerencia(e.sugerencia)).not.toBeNull()
      expect(e.sugerencia.origen).toBe('ejemplo')
    }
  })

  it('el ejemplo del caniche + baño y corte completo + antipulgas da $57.000 a $80.000, con el desenredado aparte', () => {
    const toby = ejemplosMascota.find((e) => e.id === 'caniche')!
    const estado = aplicarSugerencia({ ...estadoInicial('bano-corte'), extraIds: ['antipulgas'] }, toby.sugerencia)
    const quote = buildQuote(estado, catalog, pricingConfig)
    expect(quote.total).toBe(32000 + 7000 + 18000)
    expect(quote.totalHasta).toBe(48000 + 14000 + 18000)
    expect(quote.lineas.filter((l) => l.tipo === 'recargo')).toHaveLength(1)
  })

  it('aplicar una sugerencia conserva los servicios y extras elegidos', () => {
    const luna = ejemplosMascota.find((e) => e.id === 'terrier')!
    const antes = { ...estadoInicial('unas'), extraIds: ['traslado'] }
    const despues = aplicarSugerencia(antes, luna.sugerencia)
    expect(despues).toMatchObject({ tamano: 'mediano', manto: 'rizado', servicioIds: ['unas'], extraIds: ['traslado'] })
  })
})

describe('enlace a la reserva', () => {
  it('lleva el presupuesto y se puede leer de vuelta', () => {
    const estado = { tamano: 'chico', manto: 'rizado', nudos: 'moderados', servicioIds: ['bano-corte'], extraIds: ['antipulgas'] } as const
    const url = new URL(reservarHref(estado), 'http://x')
    expect(estadoDesdeParams(url.searchParams)).toEqual(estado)
  })

  it('ignora valores inventados en la URL', () => {
    const p = estadoDesdeParams(new URLSearchParams('tamano=enorme&manto=rizado&servicios=<script>'))
    expect(p.tamano).toBeUndefined()
    expect(p.manto).toBe('rizado')
    expect(p.servicioIds).toEqual([])
  })
})

describe('analizarConGemini', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('sin clave no está disponible y no llama a nadie', async () => {
    vi.stubEnv('GEMINI_API_KEY', '')
    vi.stubEnv('GEMINI_MODEL', '')
    const fetchMock = vi.fn()
    expect(iaDisponible()).toBe(false)
    const res = await analizarConGemini('AAAA', 'image/jpeg', fetchMock)
    expect(res).toMatchObject({ ok: false, motivo: 'sin-ia' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('manda la clave solo en el header y valida la respuesta', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'clave-de-prueba')
    vi.stubEnv('GEMINI_MODEL', 'modelo-de-prueba')
    const respuesta = {
      esPerro: true,
      raza: 'Caniche Toy',
      tamano: 'chico',
      manto: 'rizado',
      nudos: 'moderados',
      observaciones: 'Nudos en orejas.',
      confianza: { tamano: 'baja', manto: 'alta', nudos: 'media' },
    }
    const fetchMock = vi.fn(async () =>
      Response.json({ candidates: [{ content: { parts: [{ text: JSON.stringify(respuesta) }] } }] }),
    )
    const res = await analizarConGemini('AAAA', 'image/jpeg', fetchMock as unknown as typeof fetch)
    expect(res).toMatchObject({ ok: true, sugerencia: { raza: 'Caniche Toy', origen: 'ia' } })

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).not.toContain('clave-de-prueba')
    expect((init.headers as Record<string, string>)['x-goog-api-key']).toBe('clave-de-prueba')
  })

  it('si la IA devuelve algo inválido, no precarga nada', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'k')
    vi.stubEnv('GEMINI_MODEL', 'm')
    const fetchMock = vi.fn(async () =>
      Response.json({ candidates: [{ content: { parts: [{ text: '{"raza":"x","tamano":"gigante"}' }] } }] }),
    )
    const res = await analizarConGemini('AAAA', 'image/jpeg', fetchMock as unknown as typeof fetch)
    expect(res).toMatchObject({ ok: false, motivo: 'error' })
  })
})
