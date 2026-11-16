import type { CollectionConfig } from 'payload'

import { anyone, staffOnly } from '../access'

export const Extras: CollectionConfig = {
  slug: 'extras',
  labels: { singular: 'Extra', plural: 'Extras' },
  admin: { useAsTitle: 'nombre', defaultColumns: ['nombre', 'precio', 'activo'] },
  defaultSort: 'orden',
  access: { read: anyone, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'nombre', type: 'text', label: 'Nombre', required: true },
    { name: 'slug', type: 'text', label: 'Identificador', required: true, unique: true },
    { name: 'descripcion', type: 'textarea', label: 'Descripción' },
    { name: 'precio', type: 'number', label: 'Precio', required: true, min: 0 },
    { name: 'activo', type: 'checkbox', label: 'Activo', defaultValue: true },
    { name: 'orden', type: 'number', label: 'Orden', defaultValue: 0 },
  ],
}
