import { describe, expect, it } from 'vitest'

import { freeSlots } from '@/lib/agenda'
import { agendaOf, reservar } from '@/demo/operaciones'
import { initialState } from '@/demo/estado'

/*
  Demo estática (GitHub Pages): errores encontrados en la prueba de usuario con Lucía.
*/

const now = new Date('2026-11-19T12:00:00.000Z')

function primerHorario(s: ReturnType<typeof initialState>) {
  return freeSlots(agendaOf(s, now)).flatMap((d) => d.horas)[0].iso
}

const base = {
  tutorNombre: '',
  whatsapp: '',
  mascotaId: null,
  servicios: ['bano-corte'],
  extras: ['antipulgas'],
  nudos: 'moderados',
  notas: '',
}

describe('demo: quién entra', () => {
  it('arranca como un visitante nuevo, sin los datos de un cliente de ejemplo', () => {
    expect(initialState(now).clienteId).toBeNull()
  })

  it('una visitante nueva reserva con sus datos y queda recordada', () => {
    const s = initialState(now)
    const { estado, turnoId, precio } = reservar(
      s,
      {
        ...base,
        tutorNombre: 'Lucía Ferreyra',
        whatsapp: '11 0000 0123',
        mascota: { nombre: 'Toby', raza: 'Mestizo', tamano: 'mediano', manto: 'corto' },
        fechaHora: primerHorario(s),
      },
      false,
      now,
    )
    const lucia = estado.tutores.find((t) => t.nombre === 'Lucía Ferreyra')!
    expect(estado.clienteId).toBe(lucia.id)
    const turno = estado.turnos.find((t) => t.id === turnoId)!
    expect(estado.mascotas.find((m) => m.id === turno.mascotaId)).toMatchObject({
      tutorId: lucia.id,
      raza: 'Mestizo',
      tamano: 'mediano',
    })
    // Mediano: baño y corte completo $54.000 + antipulgas $11.000 + desenredado moderado $18.000
    expect(precio).toBe(83000)
  })
})

describe('demo: «otro perro» con el nombre de uno propio', () => {
  it('actualiza ese perro (sin duplicarlo) y el precio usa el tamaño que se cargó', () => {
    const inicial = initialState(now)
    const sofia = inicial.tutores.find((t) => t.nombre === 'Sofía Romero')!
    const s = { ...inicial, clienteId: sofia.id }
    const tobyAntes = s.mascotas.find((m) => m.tutorId === sofia.id && m.nombre === 'Toby')!
    expect(tobyAntes.tamano).toBe('chico')

    const { estado, turnoId, precio } = reservar(
      s,
      {
        ...base,
        mascota: { nombre: 'toby', raza: 'Mestizo', tamano: 'mediano', manto: 'corto' },
        fechaHora: primerHorario(s),
      },
      true,
      now,
    )
    const turno = estado.turnos.find((t) => t.id === turnoId)!
    expect(turno.mascotaId).toBe(tobyAntes.id)
    expect(estado.mascotas.filter((m) => m.tutorId === sofia.id)).toHaveLength(
      s.mascotas.filter((m) => m.tutorId === sofia.id).length,
    )
    expect(estado.mascotas.find((m) => m.id === tobyAntes.id)).toMatchObject({
      tamano: 'mediano',
      manto: 'corto',
      raza: 'Mestizo',
    })
    expect(precio).toBe(83000)
    expect(turno.precioEstimado).toBe(83000)
  })
})

describe('demo: agenda del panel', () => {
  it('marca qué turnos de hoy ya tienen la atención registrada', async () => {
    const { turnosHoy } = await import('@/demo/selectores')
    const s = initialState(now)
    const hoy = turnosHoy(s, now)
    expect(hoy.length).toBeGreaterThan(0)
    expect(hoy.every((t) => t.atencionRegistrada === false)).toBe(true)
    const conRegistro = {
      ...s,
      atenciones: [...s.atenciones, { ...s.atenciones[0], id: 999, turnoId: hoy[0].id }],
    }
    expect(turnosHoy(conRegistro, now)[0].atencionRegistrada).toBe(true)
  })
})
