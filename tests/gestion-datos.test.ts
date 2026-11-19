import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import type { Usuario } from '@/payload-types'

/*
  Fase 5: Clientes, Precios e Informes contra una base SQLite en memoria con el seed.
  Las variables se definen antes de importar la configuración de Payload.
*/
process.env.DATABASE_URI = 'file::memory:'
process.env.PAYLOAD_SECRET = 'test-secret-solo-para-vitest'
delete process.env.DEMO_ADMIN_EMAIL
delete process.env.DEMO_ADMIN_PASSWORD

let payload: Payload
let peluquera: Usuario
let clientes: typeof import('@/lib/panel/clientes')
let precios: typeof import('@/lib/panel/precios')
let informes: typeof import('@/lib/panel/informes')

beforeAll(async () => {
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const { seed } = await import('@/seed/seed')
  payload = await getPayload({ config })
  await seed(payload)
  const user = await payload.create({
    collection: 'usuarios',
    data: { email: 'gestion@petmellis.local', password: 'una-clave-de-test', rol: 'peluquera' },
  })
  peluquera = { ...user, collection: 'usuarios' }
  clientes = await import('@/lib/panel/clientes')
  precios = await import('@/lib/panel/precios')
  informes = await import('@/lib/panel/informes')
}, 120_000)

afterAll(async () => {
  await payload?.destroy()
})

describe('Clientes', () => {
  it('lista tutores con sus perros y la última visita', async () => {
    const lista = await clientes.listClients(payload, peluquera)
    const sofia = lista.find((c) => c.nombre === 'Sofía Romero')!
    expect(sofia.mascotas).toEqual(['Toby'])
    expect(sofia.ultimaVisita).not.toBeNull()
    expect(
      (await clientes.listClients(payload, peluquera, '0000004')).map((c) => c.nombre),
    ).toEqual(['Diego Acosta'])
  })

  it('da de alta un cliente con su perro y no deja repetir el WhatsApp', async () => {
    const id = await clientes.saveClient(payload, peluquera, {
      id: null,
      nombre: 'Ana Pérez',
      whatsapp: '11 5555 0003',
      zona: 'Merlo',
      notas: '',
    })
    await clientes.savePet(payload, peluquera, id, {
      id: null,
      nombre: 'Rocco',
      raza: 'Caniche',
      tamano: 'chico',
      manto: 'rizado',
      pesoKg: '6,5',
      cuidadosEspeciales: '',
    })
    const ficha = (await clientes.getClient(payload, peluquera, id))!
    expect(ficha.cliente.whatsapp).toBe('5491155550003')
    expect(ficha.mascotas.map((m) => [m.nombre, m.pesoKg])).toEqual([['Rocco', '6.5']])

    await expect(
      clientes.saveClient(payload, peluquera, {
        id: null,
        nombre: 'Otra Ana',
        whatsapp: '+54 9 11 5555-0003',
        zona: '',
        notas: '',
      }),
    ).rejects.toThrow(/ya es de Ana Pérez/)
  })

  it('no se puede pasar el perro de un cliente a otro desde su ficha', async () => {
    const lista = await clientes.listClients(payload, peluquera)
    const sofia = lista.find((c) => c.nombre === 'Sofía Romero')!
    const diego = (await clientes.getClient(
      payload,
      peluquera,
      lista.find((c) => c.nombre === 'Diego Acosta')!.id,
    ))!
    const max = diego.mascotas[0]
    await expect(clientes.savePet(payload, peluquera, sofia.id, { ...max })).rejects.toThrow(
      /otro cliente/,
    )
  })

  it('sin sesión del salón no se pueden crear clientes', async () => {
    await expect(
      payload.create({
        collection: 'tutores',
        data: { nombre: 'Intruso', whatsapp: '5491155559999' },
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })
})

describe('Servicios y precios', () => {
  it('un precio cambiado en el panel se ve en el cotizador', async () => {
    const { loadCatalog } = await import('@/lib/catalogo')
    const { buildQuote } = await import('@/lib/pricing')
    const p = await precios.getPricing(payload, peluquera)
    const i = p.servicios.findIndex((s) => s.nombre === 'Baño y corte completo')
    p.servicios[i].precioChico = '45.000'
    await precios.savePricing(payload, peluquera, p)

    const catalogo = await loadCatalog(payload)
    const quote = buildQuote(
      {
        tamano: 'chico',
        manto: 'rizado',
        nudos: 'moderados',
        servicioIds: ['bano-corte'],
        extraIds: ['antipulgas'],
      },
      catalogo,
      catalogo.config,
    )
    // 45.000 + antipulgas 11.000 + desenredado moderado 18.000
    expect(quote.total).toBe(74000)
  })

  it('los multiplicadores y recargos también se guardan', async () => {
    const p = await precios.getPricing(payload, peluquera)
    p.recargos.moderados = '4000'
    p.multiplicadores.largo = '1,2'
    await precios.savePricing(payload, peluquera, p)
    const otra = await precios.getPricing(payload, peluquera)
    expect(otra.recargos.moderados).toBe('4000')
    expect(otra.multiplicadores.largo).toBe('1.2')
  })

  it('sin sesión del salón no se pueden cambiar precios', async () => {
    const s = await payload.find({ collection: 'servicios', limit: 1 })
    await expect(
      payload.update({
        collection: 'servicios',
        id: s.docs[0].id,
        data: { precioChico: 1 },
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })
})

describe('Informes', () => {
  it('arma el resumen del mes y el CSV de turnos', async () => {
    const r = await informes.loadReport(payload, peluquera)
    expect(r.mes.total).toBeGreaterThan(0)
    expect(r.servicios.length).toBeGreaterThan(0)
    const csv = informes.reportCSV('turnos', r)
    expect(csv.nombre).toMatch(/^turnos-[a-z]+\.csv$/)
    expect(csv.contenido.split('\r\n')[0]).toBe(
      String.fromCharCode(0xfeff) +
        'Fecha;Hora;Cliente;Perro;Servicios;Estado;Precio estimado;Precio final;Ingreso',
    )
  })
})
