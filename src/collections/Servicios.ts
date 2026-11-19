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
        { name: 'precioChico', type: 'number', label: 'Chico, desde', required: true, min: 0 },
        { name: 'precioMediano', type: 'number', label: 'Mediano, desde', required: true, min: 0 },
        { name: 'precioGrande', type: 'number', label: 'Grande, desde', required: true, min: 0 },
        {
          name: 'precioGigante',
          type: 'number',
          label: 'Gigante, desde',
          min: 0,
          admin: { description: 'Si queda vacío, se usa el precio de grande.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'precioChicoHasta',
          type: 'number',
          label: 'Chico, hasta',
          min: 0,
          admin: { description: 'Precios orientativos: el cotizador muestra el rango «desde–hasta».' },
        },
        { name: 'precioMedianoHasta', type: 'number', label: 'Mediano, hasta', min: 0 },
        { name: 'precioGrandeHasta', type: 'number', label: 'Grande, hasta', min: 0 },
        { name: 'precioGiganteHasta', type: 'number', label: 'Gigante, hasta', min: 0 },
      ],
    },
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
