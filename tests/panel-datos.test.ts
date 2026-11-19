import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import type { Usuario } from '@/payload-types'

/*
  Fase 3: el panel de la peluquera contra una base SQLite en memoria con el seed de la demo.
  Las variables se definen antes de importar la configuración de Payload.
*/
process.env.DATABASE_URI = 'file::memory:'
process.env.PAYLOAD_SECRET = 'test-secret-solo-para-vitest'
delete process.env.DEMO_ADMIN_EMAIL
delete process.env.DEMO_ADMIN_PASSWORD

let payload: Payload
let peluquera: Usuario
let turnos: typeof import('@/lib/panel/turnos')
let mascotas: typeof import('@/lib/panel/mascotas')
let atenciones: typeof import('@/lib/panel/atenciones')

beforeAll(async () => {
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const { seed } = await import('@/seed/seed')
  payload = await getPayload({ config })
  await seed(payload)
  const user = await payload.create({
    collection: 'usuarios',
    data: { email: 'panel@petmellis.local', password: 'una-clave-de-test', rol: 'peluquera' },
  })
  peluquera = { ...user, collection: 'usuarios' }
  turnos = await import('@/lib/panel/turnos')
  mascotas = await import('@/lib/panel/mascotas')
  atenciones = await import('@/lib/panel/atenciones')
}, 120_000)

afterAll(async () => {
  await payload?.destroy()
})

describe('Hoy y Solicitudes', () => {
  it('la agenda de hoy trae los 4 turnos de la demo en orden, con las alertas de la ficha', async () => {
    const hoy = await turnos.listTodayAppointments(payload, peluquera)
    expect(hoy.map((t) => t.mascota.nombre)).toEqual(['Coco', 'Toby', 'Max', 'Luna'])
    const max = hoy.find((t) => t.mascota.nombre === 'Max')!
    expect(max.mascota.alertas).toContain('no tolera las uñas')
  })

  it('las solicitudes son las 2 pedidas desde la web', async () => {
    const solicitudes = await turnos.listRequests(payload, peluquera)
    expect(solicitudes).toHaveLength(2)
    expect(solicitudes.every((t) => t.origen === 'web')).toBe(true)
  })

  it('aceptar confirma una sola vez (un segundo toque avisa en vez de repetir)', async () => {
    const [primera] = await turnos.listRequests(payload, peluquera)
    const aceptado = await turnos.acceptRequest(payload, peluquera, primera.id)
    expect(aceptado.estado).toBe('confirmado')
    await expect(turnos.acceptRequest(payload, peluquera, primera.id)).rejects.toThrow(/confirmado/)
  })

  it('proponer otro horario cambia la fecha y la deja como solicitud', async () => {
    const [solicitud] = await turnos.listRequests(payload, peluquera)
    const nueva = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    const cambiado = await turnos.proposeTime(payload, peluquera, solicitud.id, nueva)
    expect(cambiado.estado).toBe('solicitado')
    expect(new Date(cambiado.fechaHora).getTime()).toBe(nueva.getTime())
    await expect(
      turnos.proposeTime(payload, peluquera, solicitud.id, new Date(Date.now() - 1000)),
    ).rejects.toThrow(/no haya pasado/)
  })

  it('un toque pasa a Max de confirmado a en atención', async () => {
    const max = (await turnos.listTodayAppointments(payload, peluquera)).find(
      (t) => t.mascota.nombre === 'Max',
    )!
    const r = await turnos.advanceAppointment(payload, peluquera, max.id, 'confirmado')
    expect(r.estado).toBe('en_atencion')
  })

  it('sin sesión del salón no se puede leer la agenda', async () => {
    const anonimo = { ...peluquera, collection: 'tutores' } as unknown as Usuario
    await expect(turnos.listTodayAppointments(payload, anonimo)).rejects.toThrow()
  })
})

describe('Mascotas y Ficha Evolutiva', () => {
  it('encuentra perros por nombre, raza o tutor', async () => {
    expect((await mascotas.searchPets(payload, peluquera, 'caniche')).map((m) => m.nombre)).toEqual(
      ['Toby'],
    )
    expect((await mascotas.searchPets(payload, peluquera, 'Acosta')).map((m) => m.nombre)).toEqual([
      'Max',
    ])
    expect(await mascotas.searchPets(payload, peluquera, '')).toHaveLength(5)
  })

  it('el perfil de Toby muestra la mejora con el secador', async () => {
    const [toby] = await mascotas.searchPets(payload, peluquera, 'Toby')
    const perfil = (await mascotas.getPetProfile(payload, peluquera, toby.id))!
    const secador = perfil.ficha.filas.find((f) => f.aspecto === 'secador')!
    expect(secador.valores).toEqual([1, 2, 4])
    expect(secador.tendencia).toBe('mejora')
    expect(perfil.atenciones).toHaveLength(3)
  })
})

describe('Registrar atención', () => {
  it('guarda la atención de Toby, la deja lista para retirar y arma el resumen', async () => {
    const toby = (await turnos.listTodayAppointments(payload, peluquera)).find(
      (t) => t.mascota.nombre === 'Toby',
    )!
    const datos = (await atenciones.getRegisterData(payload, peluquera, toby.id))!
    expect(datos.recomendacionSugerida).not.toBe('')

    // Antes de registrar, la agenda avisa que a Toby le falta la atención
    expect(toby.atencionRegistrada).toBe(false)

    const r = await atenciones.registerVisit(payload, peluquera, {
      turnoId: toby.id,
      servicios: datos.serviciosTurno,
      precioFinal: 15200,
      etiquetas: datos.etiquetasMascota,
      puntajes: { secador: 5, unas: 5, bano: 5, desenredado: 4 },
      notaInterna: 'La tutora llegó tarde.',
      resumenTutor: 'Tolera cada vez mejor el secador.',
      recomendacion: datos.recomendacionSugerida,
    })
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.mensaje).toContain('Toby ya está listo para retirar')
    expect(r.mensaje).not.toContain('llegó tarde')
    expect(r.telefono).toBe('5491100000001')

    const turno = await turnos.getAppointment(payload, peluquera, toby.id)
    expect(turno?.estado).toBe('listo')
    const enAgenda = (await turnos.listTodayAppointments(payload, peluquera)).find((t) => t.id === toby.id)
    expect(enAgenda?.atencionRegistrada).toBe(true)

    const repetida = await atenciones.registerVisit(payload, peluquera, {
      ...datos,
      turnoId: toby.id,
    } as never)
    expect(repetida.ok).toBe(false)
  })

  it('la nota interna no se puede leer sin sesión del salón', async () => {
    await expect(
      payload.find({ collection: 'atenciones', overrideAccess: false }),
    ).rejects.toThrow()
  })
})
