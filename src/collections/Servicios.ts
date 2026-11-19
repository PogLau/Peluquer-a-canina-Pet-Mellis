import type { CollectionConfig } from 'payload'

import { anyone, staffOnly } from '../access'

export const Servicios: CollectionConfig = {
  slug: 'servicios',
  labels: { singular: 'Servicio', plural: 'Servicios' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'precioChico', 'precioMediano', 'precioGrande', 'precioGigante', 'activo'],
  },
  defaultSort: 'orden',
  // Lectura pública: el cotizador del cliente muestra los precios
  access: { read: anyone, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'nombre', type: 'text', label: 'Nombre', required: true },
    {
      name: 'slug',
      type: 'text',
      label: 'Identificador',
      required: true,
      unique: true,
      admin: { description: 'Fijo, sin espacios. Lo usan el cotizador y el ícono (por ejemplo, bano-corte).' },
    },
    { name: 'descripcion', type: 'textarea', label: 'Descripción' },
    { name: 'duracion', type: 'text', label: 'Duración', admin: { description: 'Por ejemplo: 2 a 3 h' } },
    {
      type: 'row',
      fields: [
        { name: 'precioChico', type: 'number', label: 'Precio chico', required: true, min: 0 },
        { name: 'precioMediano', type: 'number', label: 'Precio mediano', required: true, min: 0 },
        { name: 'precioGrande', type: 'number', label: 'Precio grande', required: true, min: 0 },
        {
          name: 'precioGigante',
          type: 'number',
          label: 'Precio gigante',
          min: 0,
          admin: { description: 'Si queda vacío, se usa el precio de grande.' },
        },
      ],
    },
    /*
      Columnas de la versión con rangos de precio. Ya no se usan (precios fijos): quedan ocultas para no
      tener que borrar columnas de la base con una migración. El panel las vacía al guardar.
    */
    ...(['precioChicoHasta', 'precioMedianoHasta', 'precioGrandeHasta', 'precioGiganteHasta'] as const).map(
      (name) => ({ name, type: 'number' as const, admin: { hidden: true } }),
    ),
    {
      name: 'aplicaRecargoManto',
      type: 'checkbox',
      label: 'Aplica recargo por manto y nudos',
      defaultValue: true,
    },
    { name: 'popular', type: 'checkbox', label: 'Popular', defaultValue: false },
    { name: 'activo', type: 'checkbox', label: 'Activo', defaultValue: true },
    { name: 'orden', type: 'number', label: 'Orden', defaultValue: 0 },
  ],
}
