import type { Payload, TypedUser } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

/*
  Fase 1: colecciones, control de acceso y seed, contra una base SQLite en memoria.
  Las variables se definen antes de importar la configuración de Payload.
*/
process.env.DATABASE_URI = 'file::memory:'
process.env.PAYLOAD_SECRET = 'test-secret-solo-para-vitest'
delete process.env.DEMO_ADMIN_EMAIL
delete process.env.DEMO_ADMIN_PASSWORD

let payload: Payload
let peluquera: TypedUser

beforeAll(async () => {
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const { seed } = await import('@/seed/seed')
  payload = await getPayload({ config })
  await seed(payload)
  const user = await payload.create({
    collection: 'usuarios',
    data: { email: 'test@petmellis.local', password: 'una-clave-de-test', rol: 'peluquera' },
  })
  peluquera = { ...user, collection: 'usuarios' } as TypedUser
}, 120_000)

afterAll(async () => {
  await payload?.destroy()
})

describe('seed', () => {
  it('carga el catálogo, las mascotas y los turnos de la demo', async () => {
    const [servicios, mascotas, turnos, atenciones] = await Promise.all([
      payload.count({ collection: 'servicios' }),
      payload.count({ collection: 'mascotas' }),
      payload.count({ collection: 'turnos', where: { estado: { equals: 'solicitado' } } }),
      payload.count({ collection: 'atenciones' }),
    ])
    expect(servicios.totalDocs).toBe(5)
    expect(mascotas.totalDocs).toBe(5)
    expect(turnos.totalDocs).toBe(2)
    expect(atenciones.totalDocs).toBe(3)
  })

  it('el turno de Toby (chico, rizado, nudos moderados, Baño y Corte + oídos) cuesta $15.200', async () => {
    const toby = await payload.find({ collection: 'mascotas', where: { nombre: { equals: 'Toby' } }, limit: 1 })
    const turno = await payload.find({
      collection: 'turnos',
      where: { mascota: { equals: toby.docs[0].id }, estado: { equals: 'en_atencion' } },
      limit: 1,
    })
    expect(turno.docs[0].precioEstimado).toBe(15200)
  })
})

describe('control de acceso', () => {
  const privadas = ['tutores', 'mascotas', 'turnos', 'atenciones'] as const

  it.each(privadas)('sin sesión no se puede leer %s', async (collection) => {
    await expect(payload.find({ collection, overrideAccess: false })).rejects.toThrow()
  })

  it('sin sesión no se puede crear un turno', async () => {
    await expect(
      payload.create({
        collection: 'turnos',
        overrideAccess: false,
        data: { fechaHora: new Date().toISOString(), estado: 'solicitado', tutor: 1, mascota: 1, servicios: [1], nudos: 'sin', origen: 'web' },
      }),
    ).rejects.toThrow()
  })

  it('el catálogo y la configuración son públicos (los usa el cotizador)', async () => {
    const servicios = await payload.find({ collection: 'servicios', overrideAccess: false })
    expect(servicios.docs.length).toBe(5)
    const config = await payload.findGlobal({ slug: 'configuracion', overrideAccess: false })
    expect(config.recargosNudos?.moderados).toBe(3500)
  })

  it('sin sesión no se pueden cambiar precios', async () => {
    const servicio = (await payload.find({ collection: 'servicios', limit: 1 })).docs[0]
    await expect(
      payload.update({ collection: 'servicios', id: servicio.id, overrideAccess: false, data: { precioChico: 1 } }),
    ).rejects.toThrow()
  })

  it('la peluquera ve las atenciones con su nota interna', async () => {
    const res = await payload.find({ collection: 'atenciones', overrideAccess: false, user: peluquera, limit: 1 })
    expect(res.docs[0].notaInterna).toBeTruthy()
  })

  it('la nota interna está protegida a nivel de campo', async () => {
    const { Atenciones } = await import('@/collections/Atenciones')
    const field = Atenciones.fields.find((f) => 'name' in f && f.name === 'notaInterna')
    const read = field && 'access' in field ? field.access?.read : undefined
    expect(read).toBeTypeOf('function')
    const args = (user: unknown) => ({ req: { user } }) as never
    expect(await read!(args(null))).toBe(false)
    expect(await read!(args({ collection: 'tutores' }))).toBe(false)
    expect(await read!(args({ collection: 'usuarios', rol: 'peluquera' }))).toBe(true)
  })
})

describe('reglas de los datos', () => {
  it('no se puede crear un turno con la mascota de otro tutor', async () => {
    const mascotas = await payload.find({ collection: 'mascotas', depth: 0, limit: 2 })
    const [a, b] = mascotas.docs
    const error = await payload
      .create({
        collection: 'turnos',
        data: {
          fechaHora: new Date().toISOString(),
          estado: 'solicitado',
          tutor: a.tutor as number,
          mascota: b.id,
          servicios: [1],
          nudos: 'sin',
          origen: 'panel',
        },
      })
      .then(
        () => null,
        (e: { data?: { errors?: Array<{ path: string; message: string }> } }) => e,
      )
    expect(error?.data?.errors).toEqual([{ path: 'mascota', message: 'La mascota no pertenece a este tutor' }])
  })

  it('el WhatsApp del tutor se guarda solo con dígitos y no se repite', async () => {
    const tutor = await payload.create({ collection: 'tutores', data: { nombre: 'Prueba', whatsapp: '+54 9 11 9999-0001' } })
    expect(tutor.whatsapp).toBe('5491199990001')
    await expect(
      payload.create({ collection: 'tutores', data: { nombre: 'Duplicado', whatsapp: '5491199990001' } }),
    ).rejects.toThrow()
  })

  it('un precio cambiado en la base se ve en el catálogo del cotizador', async () => {
    const { loadCatalog } = await import('@/lib/catalogo')
    const servicio = (await payload.find({ collection: 'servicios', where: { slug: { equals: 'bano-corte' } } })).docs[0]
    await payload.update({ collection: 'servicios', id: servicio.id, data: { precioChico: 9000 } })
    const catalog = await loadCatalog(payload)
    expect(catalog.servicios.find((s) => s.id === 'bano-corte')?.precios.chico).toBe(9000)
  })
})
