import type { CollectionConfig } from 'payload'

import { staffOnly } from '../access'

import { coatOptions, sizeOptions } from './options'

export const Mascotas: CollectionConfig = {
  slug: 'mascotas',
  labels: { singular: 'Mascota', plural: 'Mascotas' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'raza', 'tamano', 'manto', 'tutor'],
  },
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'nombre', type: 'text', label: 'Nombre', required: true, index: true },
    { name: 'tutor', type: 'relationship', label: 'Tutor', relationTo: 'tutores', required: true, index: true },
    { name: 'foto', type: 'upload', label: 'Foto', relationTo: 'media' },
    { name: 'raza', type: 'text', label: 'Raza' },
    {
      type: 'row',
      fields: [
        { name: 'tamano', type: 'select', label: 'Tamaño', required: true, options: sizeOptions },
        { name: 'manto', type: 'select', label: 'Manto', required: true, options: coatOptions },
        { name: 'pesoKg', type: 'number', label: 'Peso (kg)', min: 0 },
      ],
    },
    { name: 'nacimiento', type: 'date', label: 'Nacimiento', admin: { date: { pickerAppearance: 'dayOnly' } } },
    {
      name: 'cuidadosEspeciales',
      type: 'textarea',
      label: 'Cuidados especiales',
      admin: { description: 'Lo ve la peluquera antes de empezar. Por ejemplo: «usar técnica gradual con las uñas».' },
    },
    { name: 'etiquetas', type: 'relationship', label: 'Etiquetas', relationTo: 'etiquetas', hasMany: true },
    { name: 'atenciones', type: 'join', label: 'Atenciones', collection: 'atenciones', on: 'mascota' },
  ],
}
