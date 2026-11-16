import type { CollectionConfig } from 'payload'

import { staffOnly } from '../access'

export const Tutores: CollectionConfig = {
  slug: 'tutores',
  labels: { singular: 'Tutor', plural: 'Tutores' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'whatsapp', 'zona'],
  },
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'nombre', type: 'text', label: 'Nombre', required: true },
    {
      name: 'whatsapp',
      type: 'text',
      label: 'WhatsApp',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Formato internacional, por ejemplo 5491122334455. Se guarda solo con dígitos.' },
      hooks: {
        // Normaliza para que «+54 9 11 2233-4455» y «5491122334455» sean el mismo tutor
        beforeValidate: [({ value }) => (typeof value === 'string' ? value.replace(/\D/g, '') : value)],
      },
      validate: (value: unknown) =>
        typeof value === 'string' && /^\d{10,15}$/.test(value) ? true : 'Ingresá un número de 10 a 15 dígitos',
    },
    { name: 'email', type: 'email', label: 'Email' },
    { name: 'zona', type: 'text', label: 'Zona' },
    { name: 'notas', type: 'textarea', label: 'Notas' },
    {
      name: 'mascotas',
      type: 'join',
      label: 'Mascotas',
      collection: 'mascotas',
      on: 'tutor',
    },
  ],
}
