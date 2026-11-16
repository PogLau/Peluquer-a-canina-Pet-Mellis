import type { CollectionConfig } from 'payload'

import { anyone, staffOnly } from '../access'

export const Etiquetas: CollectionConfig = {
  slug: 'etiquetas',
  labels: { singular: 'Etiqueta', plural: 'Etiquetas' },
  admin: { useAsTitle: 'nombre', defaultColumns: ['nombre', 'tipo'] },
  access: { read: anyone, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'nombre', type: 'text', label: 'Nombre', required: true, unique: true },
    {
      name: 'tipo',
      type: 'select',
      label: 'Tipo',
      required: true,
      defaultValue: 'info',
      options: [
        { label: 'Alerta (la peluquera la ve antes de empezar)', value: 'alerta' },
        { label: 'Información', value: 'info' },
      ],
    },
  ],
}
