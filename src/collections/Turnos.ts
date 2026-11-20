import { ValidationError, type CollectionConfig } from 'payload'

import { staffOnly } from '../access'

import { calcularPrecioTurno } from './hooks/precioTurno'
import { knotsOptions, statusOptions } from './options'

function relationId(value: unknown): number | string | null {
  if (value && typeof value === 'object' && 'id' in value) return (value as { id: number | string }).id
  return (value as number | string | null) ?? null
}

export const Turnos: CollectionConfig = {
  slug: 'turnos',
  labels: { singular: 'Turno', plural: 'Turnos' },
  admin: {
    useAsTitle: 'fechaHora',
    defaultColumns: ['fechaHora', 'mascota', 'tutor', 'estado', 'precioEstimado'],
  },
  defaultSort: 'fechaHora',
  // Fase 4: el tutor crea su turno desde el servidor (acción de reserva), no con acceso público
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  hooks: {
    beforeChange: [calcularPrecioTurno],
    beforeValidate: [
      // La mascota tiene que ser del tutor del turno
      async ({ data, originalDoc, req }) => {
        const tutorId = relationId(data?.tutor ?? originalDoc?.tutor)
        const mascotaId = relationId(data?.mascota ?? originalDoc?.mascota)
        if (!tutorId || !mascotaId) return data
        const mascota = await req.payload.findByID({ collection: 'mascotas', id: mascotaId, depth: 0, req })
        if (relationId(mascota.tutor) !== tutorId) {
          throw new ValidationError({
            collection: 'turnos',
            errors: [{ path: 'mascota', message: 'La mascota no pertenece a este tutor' }],
          })
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'fechaHora',
      type: 'date',
      label: 'Fecha y hora',
      required: true,
      index: true,
      admin: { date: { pickerAppearance: 'dayAndTime', timeIntervals: 30 } },
    },
    {
      name: 'estado',
      type: 'select',
      label: 'Estado',
      required: true,
      defaultValue: 'solicitado',
      index: true,
      options: statusOptions,
    },
    {
      type: 'row',
      fields: [
        { name: 'tutor', type: 'relationship', label: 'Tutor', relationTo: 'tutores', required: true, index: true },
        { name: 'mascota', type: 'relationship', label: 'Mascota', relationTo: 'mascotas', required: true, index: true },
      ],
    },
    { name: 'servicios', type: 'relationship', label: 'Servicios', relationTo: 'servicios', hasMany: true, required: true },
    { name: 'extras', type: 'relationship', label: 'Extras', relationTo: 'extras', hasMany: true },
    { name: 'nudos', type: 'select', label: 'Nudos', required: true, defaultValue: 'sin', options: knotsOptions },
    {
      name: 'precioEstimado',
      type: 'number',
      label: 'Precio estimado',
      min: 0,
      admin: {
        readOnly: true,
        description: 'Lo calcula el servidor con los precios vigentes (incluye recargo por nudos).',
      },
    },
    {
      name: 'origen',
      type: 'select',
      label: 'Origen',
      required: true,
      defaultValue: 'panel',
      options: [
        { label: 'Web (lo pidió el usuario)', value: 'web' },
        { label: 'Panel (lo cargó el salón)', value: 'panel' },
      ],
    },
    { name: 'notasCliente', type: 'textarea', label: 'Notas del usuario' },
    {
      // Consulta por foto: lo que se vio en la foto al reservar (sin la foto). Se valida con parseEscaneo.
      name: 'escaneo',
      type: 'json',
      label: 'Consulta por foto (ficha de ingreso)',
      admin: { description: 'Sugerencia sin confirmar: raza, pelaje, hidratación, nudos y tratamiento.' },
    },
  ],
}
