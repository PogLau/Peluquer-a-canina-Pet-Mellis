import type { Extra, PricingConfig, Service } from './pricing'

/*
  Catálogo de Pet Mellis: tarifario 2027 con precios fijos por tamaño.
  Cada precio es el punto medio del rango original del tarifario, redondeado a $1.000.
  Es la base del seed y de la demo estática. En la app real los precios viven en Payload
  y la peluquera los cambia desde el panel.
  Tamaños: chico hasta 10 kg, mediano 10–25 kg, grande 25–40 kg, gigante más de 40 kg.
  Pendiente: confirmar las duraciones con la peluquera.
*/

export const servicios: Service[] = [
  {
    id: 'bano-higienico',
    nombre: 'Baño higiénico simple',
    descripcion: 'Baño, secado, corte de uñas y limpieza de oídos.',
    duracion: '1 a 1,5 h',
    precios: { chico: 22000, mediano: 30000, grande: 44000, gigante: 59000 },
    aplicaRecargoManto: true,
  },
  {
    id: 'bano-corte-higienico',
    nombre: 'Baño y corte higiénico',
    descripcion: 'Baño con corte de zona sanitaria, plantares y lagrimales.',
    duracion: '1,5 a 2 h',
    precios: { chico: 26000, mediano: 36000, grande: 52000, gigante: 69000 },
    aplicaRecargoManto: true,
  },
  {
    id: 'bano-corte',
    nombre: 'Baño y corte completo',
    descripcion: 'Baño y corte con máquina y/o tijera según la raza.',
    duracion: '2 a 3 h',
    precios: { chico: 40000, mediano: 54000, grande: 71000, gigante: 94000 },
    aplicaRecargoManto: true,
    popular: true,
  },
  {
    id: 'deslanado',
    nombre: 'Deslanado profundo',
    descripcion: 'Para razas de doble capa: retira el pelo muerto de la capa interna.',
    duracion: '2 a 3 h',
    precios: { chico: 33000, mediano: 48000, grande: 67000, gigante: 88000 },
    aplicaRecargoManto: true,
  },
  {
    id: 'adaptacion',
    nombre: 'Sesión de adaptación',
    descripcion: 'Para cachorros de hasta 5 meses: primer contacto con el baño, el secador y la mesa.',
    duracion: '45 min a 1 h',
    precios: { chico: 18000, mediano: 21000, grande: 25000, gigante: 29000 },
    aplicaRecargoManto: false,
  },
  {
    id: 'unas',
    nombre: 'Corte de uñas y limpieza de oídos',
    descripcion: 'Servicio suelto, sin baño.',
    duracion: '20 a 30 min',
    precios: { chico: 8000, mediano: 8000, grande: 8000, gigante: 8000 },
    aplicaRecargoManto: false,
  },
]

export const extras: Extra[] = [
  { id: 'medicado', nombre: 'Baño medicado o dermatológico', precio: 12000 },
  { id: 'antipulgas', nombre: 'Baño antipulgas / garrapatas', precio: 11000 },
  {
    id: 'manejo-especial',
    nombre: 'Plus por manejo especial o conducta',
    tipo: 'porcentaje',
    precio: 20,
  },
  { id: 'traslado', nombre: 'Traslado a domicilio (ida y vuelta)', precio: 11000 },
]

/*
  El multiplicador por manto queda en 1 (se puede volver a usar desde el panel). El desenredado de
  nudos tiene un precio fijo por dificultad y se elige con el selector de nudos.
*/
export const pricingConfig: PricingConfig = {
  multiplicadoresManto: { corto: 1, largo: 1, rizado: 1 },
  recargosNudos: { sin: 0, leves: 12000, moderados: 18000, severos: 25000 },
}
