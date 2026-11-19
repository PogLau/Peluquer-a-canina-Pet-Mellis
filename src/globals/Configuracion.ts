import type { GlobalConfig } from 'payload'

import { anyone, staffOnly } from '../access'

const dias = [
  { label: 'Lunes', value: 'lunes' },
  { label: 'Martes', value: 'martes' },
  { label: 'Miércoles', value: 'miercoles' },
  { label: 'Jueves', value: 'jueves' },
  { label: 'Viernes', value: 'viernes' },
  { label: 'Sábado', value: 'sabado' },
  { label: 'Domingo', value: 'domingo' },
]

const hora = {
  type: 'text' as const,
  required: true,
  validate: (v: unknown) => (typeof v === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(v) ? true : 'Formato HH:MM'),
}

export const Configuracion: GlobalConfig = {
  slug: 'configuracion',
  label: 'Configuración',
  access: { read: anyone, update: staffOnly },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Local',
          fields: [
            { name: 'direccion', type: 'text', label: 'Dirección', defaultValue: 'Merlo, Buenos Aires' },
            {
              name: 'whatsappLocal',
              type: 'text',
              label: 'WhatsApp del local',
              admin: { description: 'Formato internacional, solo dígitos. Si está vacío se usa WHATSAPP_LOCAL del .env.' },
            },
            { name: 'duracionTurnoMin', type: 'number', label: 'Duración del turno (min)', defaultValue: 60, min: 15 },
            {
              name: 'horarios',
              type: 'array',
              label: 'Horarios de atención',
              labels: { singular: 'Día', plural: 'Días' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'dia', type: 'select', label: 'Día', required: true, options: dias },
                    { name: 'abre', label: 'Abre', ...hora },
                    { name: 'cierra', label: 'Cierra', ...hora },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Precios',
          fields: [
            {
              name: 'multiplicadoresManto',
              type: 'group',
              label: 'Multiplicador por manto',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'corto', type: 'number', label: 'Corto', required: true, defaultValue: 1, min: 1 },
                    { name: 'largo', type: 'number', label: 'Largo', required: true, defaultValue: 1, min: 1 },
                    { name: 'rizado', type: 'number', label: 'Rizado', required: true, defaultValue: 1, min: 1 },
                  ],
                },
              ],
            },
            {
              name: 'recargosNudos',
              type: 'group',
              label: 'Desenredado de nudos (se suma una sola vez)',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'leves', type: 'number', label: 'Leves', required: true, defaultValue: 12000, min: 0 },
                    { name: 'moderados', type: 'number', label: 'Moderados', required: true, defaultValue: 18000, min: 0 },
                    { name: 'severos', type: 'number', label: 'Severos', required: true, defaultValue: 25000, min: 0 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
