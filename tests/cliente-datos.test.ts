import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

/*
  Fase 4: panel de cliente sin login contra una base SQLite en memoria con el seed.
  Las variables se definen antes de importar la configuración de Payload.
*/
process.env.DATABASE_URI = 'file::memory:'
process.env.PAYLOAD_SECRET = 'test-secret-solo-para-vitest'
delete process.env.DEMO_ADMIN_EMAIL
delete process.env.DEMO_ADMIN_PASSWORD

let payload: Payload
let reserva: typeof import('@/lib/cliente/reserva')
let libreta: typeof import('@/lib/cliente/libreta')
let enlace: typeof import('@/lib/enlace-cliente')

async function tutorDe(nombreMascota: string) {
  const m = await payload.find({
    collection: 'mascotas',
    where: { nombre: { equals: nombreMascota } },
    depth: 1,
    limit: 1,
  })
  const t = m.docs[0].tutor as { id: number; nombre: string; whatsapp: string }
  return { id: t.id, nombre: t.nombre, whatsapp: t.whatsapp, mascotaId: m.docs[0].id }
}

beforeAll(async () => {
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const { seed } = await import('@/seed/seed')
  payload = await getPayload({ config })
  await seed(payload)
  reserva = await import('@/lib/cliente/reserva')
  libreta = await import('@/lib/cliente/libreta')
  enlace = await import('@/lib/enlace-cliente')
}, 120_000)

afterAll(async () => {
  await payload?.destroy()
})

const base = {
  tutorNombre: '',
  whatsapp: '',
  mascotaId: null,
  mascota: null,
  servicios: ['bano-corte'],
  extras: ['antipulgas'],
  nudos: 'moderados',
  notas: '',
}

describe('reservar sin login', () => {
  it('un cliente nuevo pide turno: se crean tutor, perro y turno «solicitado» con su enlace', async () => {
    const [dia] = await reserva.availableDays(payload)
    const r = await reserva.createBooking(
      payload,
      {
        ...base,
        tutorNombre: 'Ana Pérez',
        whatsapp: '11 5555 0001',
        mascota: { nombre: 'Rocco', raza: 'Caniche', tamano: 'chico', manto: 'rizado' },
        fechaHora: dia.horas[0].iso,
      },
      null,
    )
    expect(r.ok).toBe(true)
    if (!r.ok) return
    // Chico: baño y corte completo $32.000 + antipulgas $7.000 + desenredado moderado $18.000
    expect(r.precioEstimado).toBe(57000)
    expect(r.tokenNuevo).toMatch(/^[A-Za-z0-9_-]{32}$/)

    const turno = await payload.findByID({ collection: 'turnos', id: r.turnoId, depth: 1 })
    expect(turno.estado).toBe('solicitado')
    expect(turno.origen).toBe('web')
    expect((turno.tutor as { whatsapp: string }).whatsapp).toBe('5491155550001')
  })

  it('el mismo horario ya no se puede pedir dos veces', async () => {
    const [dia] = await reserva.availableDays(payload)
    const ocupado = (
      await payload.find({
        collection: 'turnos',
        where: { origen: { equals: 'web' } },
        sort: '-createdAt',
        limit: 1,
      })
    ).docs[0].fechaHora
    expect(dia.horas.some((h) => h.iso === ocupado)).toBe(false)
    const r = await reserva.createBooking(
      payload,
      {
        ...base,
        tutorNombre: 'Otra',
        whatsapp: '1155550002',
        mascota: { nombre: 'Kira', raza: '', tamano: 'grande', manto: 'corto' },
        fechaHora: ocupado,
      },
      null,
    )
    expect(r.ok).toBe(false)
  })

  it('IA Scan & Care: el escaneo se guarda con el turno y el panel lo lee; uno adulterado se descarta', async () => {
    const { toTurnoPanel } = await import('@/lib/panel/turnos')
    const escaneo = {
      raza: 'Yorkshire Terrier',
      textura: 'largo',
      hidratacion: 'baja',
      nudos: 'leves',
      tratamiento: 'hidratacion-profunda',
      origen: 'ejemplo',
    } as const
    const dias = await reserva.availableDays(payload)
    const pedir = (whatsapp: string, iso: string, e: unknown) =>
      reserva.createBooking(
        payload,
        {
          ...base,
          tutorNombre: 'Escaneo',
          whatsapp,
          mascota: { nombre: 'Yoyo', raza: 'Yorkshire', tamano: 'chico', manto: 'largo' },
          fechaHora: iso,
          escaneo: e as typeof escaneo,
        },
        null,
      )

    const ok = await pedir('1155550010', dias[0].horas[1].iso, escaneo)
    expect(ok.ok).toBe(true)
    if (!ok.ok) return
    const turno = await payload.findByID({ collection: 'turnos', id: ok.turnoId, depth: 2 })
    expect(toTurnoPanel(turno).escaneo).toEqual(escaneo)

    const malo = await pedir('1155550011', dias[0].horas[2].iso, { ...escaneo, tratamiento: '<script>' })
    expect(malo.ok).toBe(true)
    if (!malo.ok) return
    const turnoMalo = await payload.findByID({ collection: 'turnos', id: malo.turnoId, depth: 0 })
    expect(turnoMalo.escaneo ?? null).toBeNull()

    // La solicitud de Bella del seed viene de IA Scan & Care
    const bella = await payload.find({
      collection: 'turnos',
      where: { estado: { equals: 'solicitado' }, 'mascota.nombre': { equals: 'Bella' } },
      depth: 2,
      limit: 1,
    })
    expect(toTurnoPanel(bella.docs[0]).escaneo?.tratamiento).toBe('hidratacion-profunda')
  })

  it('con un WhatsApp que ya existe no se crea otro tutor ni se entrega su enlace', async () => {
    const sofia = await tutorDe('Toby')
    const r = await reserva.createBooking(
      payload,
      {
        ...base,
        tutorNombre: 'Sofía',
        whatsapp: sofia.whatsapp,
        mascota: { nombre: 'toby', raza: '', tamano: 'chico', manto: 'rizado' },
        fechaHora: (await reserva.availableDays(payload)).flatMap((d) => d.horas)[0].iso,
      },
      null,
    )
    expect(r.ok && r.tokenNuevo).toBe(null)
    const tutores = await payload.count({
      collection: 'tutores',
      where: { whatsapp: { equals: sofia.whatsapp } },
    })
    expect(tutores.totalDocs).toBe(1)
    // Reusa a Toby en vez de duplicarlo
    const tobys = await payload.count({
      collection: 'mascotas',
      where: { tutor: { equals: sofia.id } },
    })
    expect(tobys.totalDocs).toBe(1)
  })

  it('con enlace personal no se puede reservar con el perro de otro tutor', async () => {
    const sofia = await tutorDe('Toby')
    const max = await tutorDe('Max')
    const r = await reserva.createBooking(
      payload,
      {
        ...base,
        mascotaId: max.mascotaId,
        fechaHora: (await reserva.availableDays(payload)).flatMap((d) => d.horas)[0].iso,
      },
      sofia,
    )
    expect(r.ok).toBe(false)
  })
})

describe('Mis turnos y Mi mascota', () => {
  it('cada tutor ve solo sus turnos', async () => {
    const sofia = await tutorDe('Toby')
    const { proximos, pasados } = await libreta.listClientAppointments(payload, sofia.id)
    const todos = [...proximos, ...pasados]
    expect(todos.length).toBeGreaterThan(0)
    expect(todos.every((t) => t.mascota === 'Toby')).toBe(true)
  })

  it('la libreta muestra las visitas sin la nota interna', async () => {
    const sofia = await tutorDe('Toby')
    const toby = (await libreta.listClientPets(payload, sofia.id))[0]
    expect(toby.visitas).toHaveLength(3)
    expect(JSON.stringify(toby)).not.toMatch(/notaInterna/)
    const conNota = await payload.find({
      collection: 'atenciones',
      where: { notaInterna: { exists: true } },
      limit: 1,
    })
    for (const nota of conNota.docs.map((a) => a.notaInterna).filter(Boolean)) {
      expect(JSON.stringify(toby)).not.toContain(nota)
    }
  })

  it('no se puede cancelar el turno de otro ni uno con menos de 24 h', async () => {
    const sofia = await tutorDe('Toby')
    const coco = (
      await payload.find({
        collection: 'turnos',
        where: { mascota: { equals: (await tutorDe('Coco')).mascotaId } },
        limit: 1,
      })
    ).docs[0]
    await expect(libreta.cancelClientAppointment(payload, sofia.id, coco.id)).rejects.toThrow(
      /No encontramos/,
    )
    const hoy = (await libreta.listClientAppointments(payload, sofia.id)).proximos.find(
      (t) => t.estado === 'en_atencion',
    )
    if (hoy)
      await expect(libreta.cancelClientAppointment(payload, sofia.id, hoy.id)).rejects.toThrow(
        /24 horas/,
      )
  })
})

describe('enlace personal', () => {
  it('abre la sesión del tutor y, al regenerarlo, el anterior deja de funcionar', async () => {
    const sofia = await tutorDe('Toby')
    const viejo = await enlace.ensureToken(payload, sofia.id)
    expect((await enlace.findTutorByToken(payload, viejo))?.id).toBe(sofia.id)
    const nuevo = await enlace.regenerarToken(payload, sofia.id)
    expect(nuevo).not.toBe(viejo)
    expect(await enlace.findTutorByToken(payload, viejo)).toBeNull()
    expect((await enlace.findTutorByToken(payload, nuevo))?.id).toBe(sofia.id)
  })

  it('el código no se puede leer sin sesión del salón', async () => {
    const r = await payload.find({ collection: 'etiquetas', limit: 1, overrideAccess: false })
    expect(r.docs.length).toBe(1) // las etiquetas son públicas…
    await expect(payload.find({ collection: 'tutores', overrideAccess: false })).rejects.toThrow() // …los tutores no
  })
})
