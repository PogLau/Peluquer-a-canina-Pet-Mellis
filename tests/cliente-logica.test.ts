import { describe, expect, it } from 'vitest'

import { freeSlots, isSlotFree } from '@/lib/agenda'
import { canClientCancel } from '@/lib/cliente/libreta'
import { initialBooking, missingInStep } from '@/lib/cliente/pasos'
import { estadoInicial } from '@/lib/cotizacion'
import { normalizeWhatsapp } from '@/lib/cliente/reserva'
import { esTokenValido, generarToken } from '@/lib/enlace-token'
import { bookingRequestMessage, confirmationMessage, summaryMessage } from '@/lib/mensajes'

/* Fase 4: lógica pura del panel de cliente (horarios libres, pasos, enlace personal, cancelación). */

const horarios = ['martes', 'miercoles', 'jueves', 'viernes', 'sabado'].map((dia) => ({
  dia,
  abre: '09:00',
  cierra: '18:00',
}))
// Lunes 16 de noviembre de 2026, 10:00 en Buenos Aires (13:00 UTC)
const lunes = new Date('2026-11-16T13:00:00Z')

describe('horarios libres', () => {
  it('arma turnos de 60 min dentro del horario y salta los días cerrados', () => {
    const dias = freeSlots({ horarios, duracionMin: 60, ocupados: [], now: lunes, dias: 7 })
    expect(dias.map((d) => d.fecha)).toEqual([
      '2026-11-17',
      '2026-11-18',
      '2026-11-19',
      '2026-11-20',
      '2026-11-21',
    ])
    expect(dias[0].etiqueta).toBe('martes 17 de noviembre')
    expect(dias[0].horas.map((h) => h.hora)).toEqual([
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ])
    expect(dias[0].horas[0].iso).toBe('2026-11-17T12:00:00.000Z')
  })

  it('saca los horarios ocupados y los que se superponen', () => {
    const ocupados = ['2026-11-17T13:00:00.000Z', '2026-11-17T15:30:00.000Z'] // 10:00 y 12:30
    const horas = freeSlots({
      horarios,
      duracionMin: 60,
      ocupados,
      now: lunes,
      dias: 2,
    })[0].horas.map((h) => h.hora)
    expect(horas).not.toContain('10:00')
    expect(horas).not.toContain('12:00')
    expect(horas).not.toContain('13:00')
    expect(horas).toContain('11:00')
  })

  it('no ofrece horarios con menos de 2 horas de anticipación', () => {
    const martes1030 = new Date('2026-11-17T13:30:00Z')
    const horas = freeSlots({
      horarios,
      duracionMin: 60,
      ocupados: [],
      now: martes1030,
      dias: 1,
    })[0].horas
    expect(horas[0].hora).toBe('13:00')
  })

  it('el servidor rechaza un horario que no está entre los libres', () => {
    const opciones = {
      horarios,
      duracionMin: 60,
      ocupados: ['2026-11-17T12:00:00.000Z'],
      now: lunes,
    }
    expect(isSlotFree('2026-11-17T12:00:00.000Z', opciones)).toBe(false)
    expect(isSlotFree('2026-11-17T13:00:00.000Z', opciones)).toBe(true)
    expect(isSlotFree('2026-11-17T13:30:00.000Z', opciones)).toBe(false)
    expect(isSlotFree('cualquier cosa', opciones)).toBe(false)
  })
})

describe('cotizador', () => {
  it('una cotización nueva empieza sin servicios ni extras elegidos', () => {
    expect(estadoInicial()).toMatchObject({ servicioIds: [], extraIds: [] })
    // Cada cotización nueva arranca limpia: no arrastra lo elegido en otra
    const usada = { ...estadoInicial(), servicioIds: ['bano-corte'] }
    expect(usada.servicioIds).toHaveLength(1)
    expect(estadoInicial().servicioIds).toEqual([])
  })
})

describe('asistente de reserva', () => {
  it('trae el presupuesto del cotizador', () => {
    const e = initialBooking(
      {
        tamano: 'chico',
        manto: 'rizado',
        nudos: 'moderados',
        servicioIds: ['bano-corte'],
        extraIds: ['oidos'],
      },
      [],
    )
    expect(e.nueva).toMatchObject({ tamano: 'chico', manto: 'rizado' })
    expect(e.servicios).toEqual(['bano-corte'])
    expect(e.nudos).toBe('moderados')
  })

  it('sin presupuesto del cotizador empieza sin ningún servicio elegido', () => {
    const e = initialBooking({}, [])
    expect(e.servicios).toEqual([])
    expect(e.extras).toEqual([])
    expect(missingInStep(1, e, true)).toBe('Elegí al menos un servicio.')
  })

  it('el tamaño del perro nuevo no viene marcado y hay que elegirlo', () => {
    const e = initialBooking({}, [])
    expect(e.nueva.tamano).toBeNull()
    const conDatos = { ...e, tutorNombre: 'Lucía', whatsapp: '11 0000 0123', nueva: { ...e.nueva, nombre: 'Toby' } }
    expect(missingInStep(0, conDatos, false)).toBe('Elegí el tamaño de tu perro.')
    expect(missingInStep(0, { ...conDatos, nueva: { ...conDatos.nueva, tamano: 'mediano' } }, false)).toBeNull()
  })

  it('dice qué falta en cada paso', () => {
    const e = initialBooking({}, [])
    expect(missingInStep(0, e, false)).toBe('Falta tu nombre.')
    expect(missingInStep(0, { ...e, tutorNombre: 'Sofía', whatsapp: '11 2233' }, false)).toMatch(
      /WhatsApp/,
    )
    expect(
      missingInStep(0, { ...e, tutorNombre: 'Sofía', whatsapp: '11 2233 4455' }, false),
    ).toMatch(/perro/)
    // Con enlace personal no se piden nombre ni WhatsApp
    expect(missingInStep(0, { ...e, mascotaId: 3 }, true)).toBeNull()
    expect(missingInStep(1, e, true)).toMatch(/servicio/)
    expect(missingInStep(2, e, true)).toMatch(/horario/)
  })

  it('normaliza el WhatsApp argentino', () => {
    expect(normalizeWhatsapp('11 2233 4455')).toBe('5491122334455')
    expect(normalizeWhatsapp('011 15 2233-4455')).toBe('5491122334455')
    expect(normalizeWhatsapp('+54 9 11 2233 4455')).toBe('5491122334455')
    expect(normalizeWhatsapp('+54 11 2233 4455')).toBe('5491122334455')
  })
})

describe('enlace personal y cancelación', () => {
  it('el código es largo, al azar y válido solo con el formato esperado', () => {
    const a = generarToken()
    expect(esTokenValido(a)).toBe(true)
    expect(a).not.toBe(generarToken())
    expect(esTokenValido('abc')).toBe(false)
    expect(esTokenValido(`${a.slice(0, 31)}/`)).toBe(false)
  })

  it('se cancela desde la web solo con más de 24 h y antes de empezar', () => {
    const turno = '2026-11-18T13:00:00.000Z'
    expect(canClientCancel('confirmado', turno, lunes)).toBe(true)
    expect(canClientCancel('confirmado', turno, new Date('2026-11-17T14:00:00Z'))).toBe(false)
    expect(canClientCancel('en_atencion', turno, lunes)).toBe(false)
    expect(canClientCancel('cancelado', turno, lunes)).toBe(false)
  })

  it('la confirmación y el resumen llevan el enlace personal', () => {
    const enlace = 'https://app.test/mi/abc'
    const datos = {
      tutor: 'Sofía Romero',
      mascota: 'Toby',
      fechaHora: lunes,
      servicios: ['Baño y Corte'],
      enlace,
    }
    expect(confirmationMessage(datos)).toContain(enlace)
    expect(summaryMessage({ ...datos, fecha: lunes })).toContain(enlace)
    expect(confirmationMessage({ ...datos, enlace: null })).not.toContain('/mi/')
  })

  it('el aviso del cliente al salón dice quién, qué perro, cuándo y cuánto', () => {
    const m = bookingRequestMessage({
      tutor: 'Sofía',
      mascota: 'Toby',
      fechaHora: new Date('2026-11-17T15:00:00Z'),
      servicios: ['Baño y Corte'],
      precioEstimado: 15200,
    })
    expect(m).toContain(
      'Hola, soy Sofía. Pedí un turno desde la web para Toby el martes 17 de noviembre a las 12:00 hs.',
    )
    expect(m).toMatch(/\$\s?15\.200/)
  })
})
