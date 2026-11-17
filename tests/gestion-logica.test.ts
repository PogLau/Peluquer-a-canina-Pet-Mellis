import { describe, expect, it } from 'vitest'

import { csvDate, toCSV } from '@/lib/csv'
import {
  lapsedClients,
  monthAR,
  summarize,
  topServices,
  weekAR,
  type TurnoInforme,
} from '@/lib/informes'
import { validateClient, validatePet } from '@/lib/panel/clientes'
import {
  parseMultiplier,
  parsePesos,
  validatePricing,
  type PreciosEditables,
} from '@/lib/panel/precios'

/* Fase 5: lógica pura de Clientes, Precios e Informes. */

// Martes 17 de noviembre de 2026, 15:00 en Buenos Aires
const now = new Date('2026-11-17T18:00:00Z')

function turno(p: Partial<TurnoInforme> & { fechaHora: string }): TurnoInforme {
  return {
    id: 1,
    estado: 'confirmado',
    precioEstimado: 10000,
    precioFinal: null,
    servicios: ['Baño y Corte'],
    tutor: 'Sofía',
    mascota: 'Toby',
    ...p,
  }
}

describe('períodos en hora argentina', () => {
  it('la semana va de lunes a domingo', () => {
    expect(weekAR(now)).toMatchObject({
      desde: '2026-11-16T03:00:00.000Z',
      hasta: '2026-11-23T03:00:00.000Z',
    })
  })
  it('el mes es el calendario', () => {
    expect(monthAR(now)).toEqual({
      desde: '2026-11-01T03:00:00.000Z',
      hasta: '2026-12-01T03:00:00.000Z',
      etiqueta: 'noviembre',
    })
  })
})

describe('informes', () => {
  const turnos = [
    turno({ id: 1, fechaHora: '2026-11-16T13:00:00Z', estado: 'finalizado', precioFinal: 15200 }),
    turno({
      id: 2,
      fechaHora: '2026-11-18T13:00:00Z',
      estado: 'confirmado',
      precioEstimado: 9000,
      servicios: ['Corte de Uñas', 'Baño y Corte'],
    }),
    turno({ id: 3, fechaHora: '2026-11-18T15:00:00Z', estado: 'cancelado', precioEstimado: 50000 }),
    turno({
      id: 4,
      fechaHora: '2026-11-03T13:00:00Z',
      estado: 'finalizado',
      precioEstimado: 7000,
      servicios: ['Corte de Uñas'],
    }),
  ]

  it('cuenta turnos e ingresos de la semana: precio final si hay, si no el estimado; sin cancelados', () => {
    const r = summarize(turnos, weekAR(now))
    expect(r.total).toBe(2)
    expect(r.cancelados).toBe(1)
    expect(r.ingresos).toBe(15200 + 9000)
  })

  it('el mes incluye los de semanas anteriores', () => {
    expect(summarize(turnos, monthAR(now)).ingresos).toBe(15200 + 9000 + 7000)
  })

  it('ordena los servicios más pedidos', () => {
    expect(topServices(turnos, monthAR(now))).toEqual([
      { servicio: 'Baño y Corte', cantidad: 2 },
      { servicio: 'Corte de Uñas', cantidad: 2 },
    ])
  })

  it('clientes sin volver: más de 60 días y sin turno próximo', () => {
    const base = { whatsapp: '5491100000001', mascotas: ['Toby'], tieneTurnoProximo: false }
    const r = lapsedClients(
      [
        { ...base, id: 1, nombre: 'Hace 90', ultimaVisita: '2026-08-19T13:00:00Z' },
        { ...base, id: 2, nombre: 'Hace 30', ultimaVisita: '2026-10-18T13:00:00Z' },
        {
          ...base,
          id: 3,
          nombre: 'Tiene turno',
          ultimaVisita: '2026-07-01T13:00:00Z',
          tieneTurnoProximo: true,
        },
        { ...base, id: 4, nombre: 'Nunca vino', ultimaVisita: null },
      ],
      now,
    )
    expect(r.map((c) => c.nombre)).toEqual(['Hace 90'])
    expect(r[0].diasSinVenir).toBe(90)
  })
})

describe('CSV para Excel en español', () => {
  it('usa punto y coma, BOM, CRLF y comillas cuando hace falta', () => {
    const csv = toCSV(
      ['Cliente', 'Nota'],
      [
        ['Sofía Romero', 'dice "hola"; chau'],
        ['Ana', null],
      ],
    )
    expect(csv.startsWith(String.fromCharCode(0xfeff) + 'Cliente;Nota\r\n')).toBe(true)
    expect(csv).toContain('Sofía Romero;"dice ""hola""; chau"\r\n')
    expect(csv).toContain('Ana;\r\n')
  })

  it('no deja pasar fórmulas', () => {
    expect(toCSV(['x'], [['=HYPERLINK("x")']])).toContain(`"'=HYPERLINK(""x"")"`)
    expect(toCSV(['x'], [[-5]])).toContain('\r\n-5\r\n')
  })

  it('fechas en formato argentino', () => {
    expect(csvDate('2026-11-17T18:00:00Z')).toBe('17/11/2026')
  })
})

describe('validaciones de Clientes y Precios', () => {
  it('lee precios escritos a mano', () => {
    expect(parsePesos('15.000')).toBe(15000)
    expect(parsePesos('$ 8500')).toBe(8500)
    expect(parsePesos('15,5')).toBeNull()
    expect(parsePesos('-1')).toBeNull()
    expect(parseMultiplier('1,15')).toBe(1.15)
    expect(parseMultiplier('0.9')).toBeNull()
  })

  it('marca cada campo de precio inválido', () => {
    const p: PreciosEditables = {
      servicios: [
        {
          id: 1,
          nombre: 'Baño y Corte',
          precioChico: '8500',
          precioMediano: 'abc',
          precioGrande: '15000',
          aplicaRecargoManto: true,
          popular: true,
          activo: true,
        },
      ],
      extras: [{ id: 1, nombre: 'Oídos', precio: '', activo: true }],
      multiplicadores: { corto: '1', largo: '1,15', rizado: '5' },
      recargos: { leves: '1500', moderados: '3500', severos: '6000' },
    }
    expect(Object.keys(validatePricing(p)).sort()).toEqual([
      'extras.0.precio',
      'multiplicadores.rizado',
      'servicios.0.precioMediano',
    ])
  })

  it('valida cliente y perro', () => {
    expect(
      validateClient({ id: null, nombre: 'A', whatsapp: '123', zona: '', notas: '' }),
    ).toMatchObject({ nombre: expect.any(String), whatsapp: expect.any(String) })
    expect(
      validateClient({
        id: null,
        nombre: 'Ana Pérez',
        whatsapp: '11 2233 4455',
        zona: '',
        notas: '',
      }),
    ).toEqual({})
    expect(
      validatePet({
        id: null,
        nombre: 'Rocco',
        raza: '',
        tamano: 'chico',
        manto: 'rizado',
        pesoKg: '7,5',
        cuidadosEspeciales: '',
      }),
    ).toEqual({})
    expect(
      validatePet({
        id: null,
        nombre: '',
        raza: '',
        tamano: 'chico',
        manto: 'rizado',
        pesoKg: 'mucho',
        cuidadosEspeciales: '',
      }),
    ).toMatchObject({ nombre: expect.any(String), pesoKg: expect.any(String) })
  })
})
