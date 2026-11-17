import { describe, expect, it } from 'vitest'

import { dayRangeAR, fromDateTimeLocalAR, toDateTimeLocalAR } from '@/lib/dates'
import { canCancel, nextStatus } from '@/lib/estados'
import { buildFicha, suggestRecommendation, suggestTutorSummary } from '@/lib/ficha'
import {
  confirmationMessage,
  proposalMessage,
  rejectionMessage,
  summaryMessage,
} from '@/lib/mensajes'
import { validateVisit, type RegistroInput } from '@/lib/panel/atenciones'

/* Fase 3: lógica pura del panel (estados, fechas, Ficha Evolutiva, mensajes y validación). */

describe('flujo de estados', () => {
  it('avanza de a un toque: confirmado → en atención → listo → finalizado', () => {
    expect(nextStatus('solicitado')).toEqual({ estado: 'confirmado', accion: 'Confirmar' })
    expect(nextStatus('confirmado')?.estado).toBe('en_atencion')
    expect(nextStatus('en_atencion')?.estado).toBe('listo')
    expect(nextStatus('listo')?.estado).toBe('finalizado')
    expect(nextStatus('finalizado')).toBeNull()
    expect(nextStatus('cancelado')).toBeNull()
  })

  it('solo se cancela antes de empezar', () => {
    expect(canCancel('solicitado')).toBe(true)
    expect(canCancel('confirmado')).toBe(true)
    expect(canCancel('en_atencion')).toBe(false)
  })
})

describe('fechas en Buenos Aires', () => {
  it('el día empieza a las 00:00 de Argentina (03:00 UTC), aunque el servidor esté en UTC', () => {
    // 01:30 UTC del 18 es todavía el 17 a las 22:30 en Buenos Aires
    const { desde, hasta } = dayRangeAR(new Date('2026-11-18T01:30:00Z'))
    expect(desde).toBe('2026-11-17T03:00:00.000Z')
    expect(hasta).toBe('2026-11-18T03:00:00.000Z')
  })

  it('el valor de datetime-local va y vuelve en hora argentina', () => {
    const fecha = new Date('2026-11-20T17:30:00Z')
    expect(toDateTimeLocalAR(fecha)).toBe('2026-11-20T14:30')
    expect(fromDateTimeLocalAR('2026-11-20T14:30')?.toISOString()).toBe(fecha.toISOString())
    expect(fromDateTimeLocalAR('mañana')).toBeNull()
  })
})

describe('Ficha Evolutiva', () => {
  const toby = [
    { fecha: '2026-09-18T15:00:00Z', puntajes: { secador: 1, unas: 4, bano: 4, desenredado: 3 } },
    { fecha: '2026-10-16T15:00:00Z', puntajes: { secador: 2, unas: 4, bano: 5, desenredado: 3 } },
    { fecha: '2026-11-13T15:00:00Z', puntajes: { secador: 4, unas: 5, bano: 5, desenredado: 4 } },
  ]

  it('compara las últimas 3 visitas y marca la mejora con el secador', () => {
    const ficha = buildFicha(toby)
    expect(ficha.fechas).toHaveLength(3)
    const secador = ficha.filas.find((f) => f.aspecto === 'secador')!
    expect(secador.valores).toEqual([1, 2, 4])
    expect(secador.tendencia).toBe('mejora')
    expect(secador.decision).toMatch(/mejoró mucho/i)
    expect(secador.atencion).toBe(false)
  })

  it('usa solo las últimas 3 visitas, en orden, aunque lleguen desordenadas', () => {
    const vieja = { fecha: '2026-08-01T15:00:00Z', puntajes: { secador: 5 } }
    const ficha = buildFicha([toby[2], vieja, toby[0], toby[1]])
    expect(ficha.fechas[0]).toBe(toby[0].fecha)
  })

  it('pide cuidado cuando el último puntaje es bajo', () => {
    const ficha = buildFicha([{ fecha: '2026-11-01T15:00:00Z', puntajes: { unas: 1 } }])
    const unas = ficha.filas.find((f) => f.aspecto === 'unas')!
    expect(unas.atencion).toBe(true)
    expect(suggestRecommendation(ficha)).toMatch(/^Uñas: le cuesta/)
  })

  it('sin visitas no inventa una recomendación', () => {
    expect(suggestRecommendation(buildFicha([]))).toBe('')
  })

  it('arma el resumen para el tutor con los puntajes', () => {
    expect(suggestTutorSummary('Toby', { secador: 2, bano: 5, unas: 4 })).toBe(
      'Toby se portó muy bien con uñas y baño. Le costó secador; la próxima vamos de a poco.',
    )
  })
})

describe('mensajes de WhatsApp', () => {
  const turno = {
    tutor: 'Sofía Romero',
    mascota: 'Toby',
    fechaHora: new Date('2026-11-20T15:00:00Z'),
    servicios: ['Baño y Corte'],
    precioEstimado: 15200,
  }

  it('la confirmación nombra al tutor, al perro, el día, la hora y el precio', () => {
    const m = confirmationMessage(turno)
    expect(m).toContain('Hola, Sofía.')
    expect(m).toContain('Toby')
    expect(m).toContain('viernes 20 de noviembre a las 12:00')
    expect(m).toMatch(/\$\s?15\.200/)
  })

  it('la propuesta y el rechazo no tienen datos vacíos', () => {
    const propuesta = proposalMessage(turno, new Date('2026-11-21T13:30:00Z'))
    expect(propuesta).toContain('sábado 21 de noviembre a las 10:30')
    for (const m of [propuesta, rejectionMessage(turno)]) expect(m).not.toMatch(/undefined|null/)
  })

  it('el resumen incluye lo que se hizo, cómo se portó y la próxima visita', () => {
    const m = summaryMessage({
      tutor: 'Sofía Romero',
      mascota: 'Toby',
      fecha: new Date('2026-11-20T18:00:00Z'),
      servicios: ['Baño y Corte', 'Corte de Uñas'],
      resumenTutor: 'Tolera cada vez mejor el secador.',
      recomendacion: 'Seguir de a poco con el secador.',
    })
    expect(m).toContain('Qué hicimos: baño y corte y corte de uñas.')
    expect(m).toContain('Cómo se portó: Tolera cada vez mejor el secador.')
    expect(m).toContain('Para la próxima: Seguir de a poco con el secador.')
    expect(m).toContain('20 de diciembre')
  })
})

describe('validación de la atención', () => {
  const base: RegistroInput = {
    turnoId: 1,
    servicios: [1],
    precioFinal: 15200,
    etiquetas: [],
    puntajes: { secador: 4 },
    notaInterna: '',
    resumenTutor: '',
    recomendacion: '',
  }

  it('acepta una atención completa', () => {
    expect(validateVisit(base)).toEqual({})
  })

  it('marca lo que falta o está fuera de rango', () => {
    const errores = validateVisit({
      ...base,
      servicios: [],
      precioFinal: -1,
      puntajes: { secador: 7 },
    })
    expect(Object.keys(errores).sort()).toEqual(['precioFinal', 'puntajes', 'servicios'])
  })
})
