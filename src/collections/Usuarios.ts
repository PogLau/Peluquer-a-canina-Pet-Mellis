import type { CollectionConfig } from 'payload'

export const Usuarios: CollectionConfig = {
  slug: 'usuarios',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    { name: 'nombre', type: 'text', label: 'Nombre' },
    {
      name: 'rol',
      type: 'select',
      label: 'Rol',
      required: true,
      defaultValue: 'peluquera',
      options: [
        { label: 'Peluquera', value: 'peluquera' },
        { label: 'Admin', value: 'admin' },
      ],
    },
  ],
}
