import { describe, expect, it } from 'vitest'

import { servicios as serviciosBase } from '@/lib/catalogo-demo'
import { validateBooking } from '@/lib/cliente/reserva'
import { alternarServicio, incluyeBano, unSoloBano } from '@/lib/cotizacion'
import { initialBooking } from '@/lib/cliente/pasos'

/* Un turno lleva un solo baño: uno u otro, nunca dos. */

const s = serviciosBase

describe('un solo baño por turno', () => {
  it('reconoce los servicios con baño', () => {
    expect(s.filter(incluyeBano).map((x) => x.id)).toEqual(['bano-higienico', 'bano-corte-higienico', 'bano-corte'])
  })

  it('elegir otro baño desmarca el anterior y avisa cuál se cambió', () => {
    const r = alternarServicio(['bano-higienico', 'unas'], 'bano-corte', s)
    expect(r.ids).toEqual(['unas', 'bano-corte'])
    expect(r.reemplazado?.id).toBe('bano-higienico')
  })

  it('los servicios sin baño se suman sin tocar el baño elegido', () => {
    expect(alternarServicio(['bano-corte'], 'unas', s)).toEqual({ ids: ['bano-corte', 'unas'], reemplazado: null })
  })

  it('tocar el baño elegido lo desmarca', () => {
    expect(alternarServicio(['bano-corte'], 'bano-corte', s)).toEqual({ ids: [], reemplazado: null })
  })

  it('un enlace con dos baños deja solo el primero', () => {
    expect(unSoloBano(['bano-corte', 'unas', 'bano-higienico'], s)).toEqual(['bano-corte', 'unas'])
    expect(initialBooking({ servicioIds: ['bano-corte', 'bano-higienico'] }, []).servicios).toEqual(['bano-corte'])
  })

  it('la reserva con dos baños no pasa la validación', () => {
    const e = validateBooking(
      {
        tutorNombre: 'Ana Pérez',
        whatsapp: '1122334455',
        mascotaId: null,
        mascota: { nombre: 'Toby', raza: '', tamano: 'chico', manto: 'corto' },
        servicios: ['bano-corte', 'bano-higienico'],
        extras: [],
        nudos: 'sin',
        fechaHora: '2026-11-25T13:00:00.000Z',
        notas: '',
      },
      null,
    )
    expect(e.servicios).toBe('Elegí un solo baño por turno.')
  })
})
