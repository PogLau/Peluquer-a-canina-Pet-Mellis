import type { CollectionConfig, Field } from 'payload'

import { staffField, staffOnly } from '../access'

import { scoreAspects } from './options'

const scoreFields: Field[] = scoreAspects.map(({ name, label }) => ({
  name,
  type: 'number',
  label,
  min: 1,
  max: 5,
  admin: { description: '1 = muy mal, 5 = muy bien', width: '25%' },
}))

/** Cada atención registrada alimenta la Ficha Evolutiva de la mascota. */
export const Atenciones: CollectionConfig = {
  slug: 'atenciones',
  labels: { singular: 'Atención', plural: 'Atenciones' },
  admin: { useAsTitle: 'fecha', defaultColumns: ['fecha', 'mascota', 'precioFinal'] },
  defaultSort: '-fecha',
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    {
      name: 'fecha',
      type: 'date',
      label: 'Fecha',
      required: true,
      index: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      type: 'row',
      fields: [
        { name: 'mascota', type: 'relationship', label: 'Mascota', relationTo: 'mascotas', required: true, index: true },
        { name: 'turno', type: 'relationship', label: 'Turno', relationTo: 'turnos' },
      ],
    },
    {
      name: 'serviciosRealizados',
      type: 'relationship',
      label: 'Servicios realizados',
      relationTo: 'servicios',
      hasMany: true,
    },
    { name: 'precioFinal', type: 'number', label: 'Precio final', min: 0 },
    { name: 'puntajes', type: 'group', label: 'Puntajes por aspecto', fields: [{ type: 'row', fields: scoreFields }] },
    { name: 'etiquetas', type: 'relationship', label: 'Etiquetas', relationTo: 'etiquetas', hasMany: true },
    {
      name: 'notaInterna',
      type: 'textarea',
      label: 'Nota interna',
      // Nunca se expone al cliente, aunque en el futuro se abra la lectura de la atención
      access: { read: staffField, create: staffField, update: staffField },
      admin: { description: 'Solo la ve el salón.' },
    },
    { name: 'resumenTutor', type: 'textarea', label: 'Resumen para el tutor' },
    { name: 'recomendacion', type: 'textarea', label: 'Recomendación para la próxima visita' },
  ],
}
