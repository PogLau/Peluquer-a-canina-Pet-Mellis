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
    // Chico: baño y corte completo $40.000 + antipulgas $11.000 + desenredado moderado $18.000
    expect(r.precioEstimado).toBe(69000)
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

  it('Consulta por foto: el escaneo se guarda con el turno y el panel lo lee; uno adulterado se descarta', async () => {
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

    // Horarios libres de todos los días (el primer día es hoy y puede tener pocos según la hora)
    const horas = dias.flatMap((d) => d.horas)
    const ok = await pedir('1155550010', horas[1].iso, escaneo)
    expect(ok.ok).toBe(true)
    if (!ok.ok) return
    const turno = await payload.findByID({ collection: 'turnos', id: ok.turnoId, depth: 2 })
    expect(toTurnoPanel(turno).escaneo).toEqual(escaneo)

    const malo = await pedir('1155550011', horas[2].iso, { ...escaneo, tratamiento: '<script>' })
    expect(malo.ok).toBe(true)
    if (!malo.ok) return
    const turnoMalo = await payload.findByID({ collection: 'turnos', id: malo.turnoId, depth: 0 })
    expect(turnoMalo.escaneo ?? null).toBeNull()

    // La solicitud de Bella del seed viene de Consulta por foto
    const bella = await payload.find({
      collection: 'turnos',
      where: { estado: { equals: 'solicitado' }, 'mascota.nombre': { equals: 'Bella' } },
      depth: 2,
      limit: 1,
    })
    expect(toTurnoPanel(bella.docs[0]).escaneo?.tratamiento).toBe('hidratacion-profunda')
  })

  it('con un WhatsApp que ya existe no se crea otro tutor, no se entrega su enlace ni se tocan sus perros', async () => {
    const sofia = await tutorDe('Toby')
    const tobyAntes = await payload.findByID({ collection: 'mascotas', id: sofia.mascotaId, depth: 0 })
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
    // Sin enlace no se puede saber si es la misma persona: Toby queda como estaba y el pedido
    // llega con un perro nuevo, que la peluquera revisa al aceptarlo.
    const tobyDespues = await payload.findByID({ collection: 'mascotas', id: sofia.mascotaId, depth: 0 })
    expect(tobyDespues).toMatchObject({ tamano: tobyAntes.tamano, manto: tobyAntes.manto, raza: tobyAntes.raza })
    if (!r.ok) return
    const turno = await payload.findByID({ collection: 'turnos', id: r.turnoId, depth: 0 })
    expect(turno.mascota).not.toBe(sofia.mascotaId)
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

  it('«otro perro» con el nombre de uno propio actualiza ese perro y el precio usa los datos nuevos', async () => {
    // Coco es chico y de manto largo; la tutora lo carga como «coco», mediano y de manto corto
    const carla = await tutorDe('Coco')
    const fechaHora = (await reserva.availableDays(payload)).flatMap((d) => d.horas)[0].iso
    const r = await reserva.createBooking(
      payload,
      {
        ...base,
        mascota: { nombre: 'coco', raza: 'Shih Tzu', tamano: 'mediano', manto: 'corto' },
        fechaHora,
      },
      carla,
    )
    expect(r.ok).toBe(true)
    if (!r.ok) return
    const turno = await payload.findByID({ collection: 'turnos', id: r.turnoId, depth: 0 })
    expect(turno.mascota).toBe(carla.mascotaId)
    const coco = await payload.findByID({ collection: 'mascotas', id: carla.mascotaId, depth: 0 })
    expect(coco).toMatchObject({ tamano: 'mediano', manto: 'corto' })
    const mismos = await payload.count({ collection: 'mascotas', where: { tutor: { equals: carla.id } } })
    expect(mismos.totalDocs).toBe(1)
    // Mediano: baño y corte completo $54.000 + antipulgas $11.000 + desenredado moderado $18.000
    expect(r.precioEstimado).toBe(83000)
    expect(turno.precioEstimado).toBe(83000)
  })
})

describe('Mis turnos y Mi mascota', () => {
  it('cada tutor ve solo sus turnos', async () => {
    const sofia = await tutorDe('Toby')
    const { proximos, pasados } = await libreta.listClientAppointments(payload, sofia.id)
    const todos = [...proximos, ...pasados]
    expect(todos.length).toBeGreaterThan(0)
    // Solo Toby (y el «toby» que llegó por un pedido sin enlace con su WhatsApp)
    expect(todos.every((t) => t.mascota.toLowerCase() === 'toby')).toBe(true)
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

  it('sin sesión del salón no se leen mascotas, turnos, atenciones ni fotos', async () => {
    for (const collection of ['mascotas', 'turnos', 'atenciones', 'media'] as const) {
      await expect(payload.find({ collection, overrideAccess: false })).rejects.toThrow()
    }
  })

  it('la libreta de cada tutor trae solo sus perros', async () => {
    const sofia = await tutorDe('Toby')
    const mascotas = await libreta.listClientPets(payload, sofia.id)
    expect(mascotas.length).toBeGreaterThan(0)
    const propias = await payload.find({
      collection: 'mascotas',
      where: { tutor: { equals: sofia.id } },
      depth: 0,
      limit: 50,
    })
    const ids = new Set(propias.docs.map((m) => m.id))
    expect(mascotas.every((m) => ids.has(m.id))).toBe(true)
    expect((await reserva.petsOfTutor(payload, sofia.id)).every((m) => ids.has(m.id))).toBe(true)
  })
})
