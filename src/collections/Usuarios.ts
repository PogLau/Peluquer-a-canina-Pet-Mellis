import type { CollectionConfig, FieldAccess } from 'payload'

import { staffOnly } from '../access'

const onlyAdmin: FieldAccess = ({ req }) => req.user?.collection === 'usuarios' && req.user.rol === 'admin'

/** Usuarios del salón (auth de Payload). Los tutores no son usuarios: entran con WhatsApp + código (Fase 4). */
export const Usuarios: CollectionConfig = {
  slug: 'usuarios',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'nombre', 'rol'],
  },
  auth: true,
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'nombre', type: 'text', label: 'Nombre' },
    {
      name: 'rol',
      type: 'select',
      label: 'Rol',
      required: true,
      defaultValue: 'peluquera',
      saveToJWT: true,
      // Solo un admin puede cambiar roles
      access: { update: onlyAdmin },
      options: [
        { label: 'Administrador', value: 'peluquera' },
        { label: 'Administrador principal', value: 'admin' },
      ],
    },
  ],
}
