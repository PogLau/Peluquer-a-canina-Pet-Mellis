import type { CollectionConfig } from 'payload'

import { staffOnly } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagen', plural: 'Imágenes' },
  // Son fotos de las mascotas de los clientes: solo las ve el equipo (ni la API ni las URL de los
  // archivos quedan públicas). Las fotos de la web pública están en /public.
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo',
      required: true,
    },
  ],
  upload: true,
}
