import type { Extra, PricingConfig, Service } from './pricing'

/*
  Catálogo de Pet Mellis: tarifario 2027 (precios orientativos «desde–hasta» por tamaño).
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
    precios: { chico: 18000, mediano: 25000, grande: 38000, gigante: 50000 },
    preciosHasta: { chico: 25000, mediano: 35000, grande: 50000, gigante: 68000 },
    aplicaRecargoManto: true,
  },
  {
    id: 'bano-corte-higienico',
    nombre: 'Baño y corte higiénico',
    descripcion: 'Baño con corte de zona sanitaria, plantares y lagrimales.',
    duracion: '1,5 a 2 h',
    precios: { chico: 22000, mediano: 30000, grande: 45000, gigante: 60000 },
    preciosHasta: { chico: 30000, mediano: 42000, grande: 58000, gigante: 78000 },
    aplicaRecargoManto: true,
  },
  {
    id: 'bano-corte',
    nombre: 'Baño y corte completo',
    descripcion: 'Baño y corte con máquina y/o tijera según la raza.',
    duracion: '2 a 3 h',
    precios: { chico: 32000, mediano: 45000, grande: 62000, gigante: 82000 },
    preciosHasta: { chico: 48000, mediano: 62000, grande: 80000, gigante: 105000 },
    aplicaRecargoManto: true,
    popular: true,
  },
  {
    id: 'deslanado',
    nombre: 'Deslanado profundo',
    descripcion: 'Para razas de doble capa: retira el pelo muerto de la capa interna.',
    duracion: '2 a 3 h',
    precios: { chico: 28000, mediano: 40000, grande: 58000, gigante: 78000 },
    preciosHasta: { chico: 38000, mediano: 55000, grande: 75000, gigante: 98000 },
    aplicaRecargoManto: true,
  },
  {
    id: 'adaptacion',
    nombre: 'Sesión de adaptación',
    descripcion: 'Para cachorros de hasta 5 meses: primer contacto con el baño, el secador y la mesa.',
    duracion: '45 min a 1 h',
    precios: { chico: 15000, mediano: 18000, grande: 22000, gigante: 25000 },
    preciosHasta: { chico: 20000, mediano: 24000, grande: 28000, gigante: 32000 },
    aplicaRecargoManto: false,
  },
  {
    id: 'unas',
    nombre: 'Corte de uñas y limpieza de oídos',
    descripcion: 'Servicio suelto, sin baño.',
    duracion: '20 a 30 min',
    precios: { chico: 6000, mediano: 6000, grande: 6000, gigante: 6000 },
    preciosHasta: { chico: 10000, mediano: 10000, grande: 10000, gigante: 10000 },
    aplicaRecargoManto: false,
  },
]

export const extras: Extra[] = [
  { id: 'medicado', nombre: 'Baño medicado o dermatológico', precio: 8000, precioHasta: 15000 },
  { id: 'antipulgas', nombre: 'Baño antipulgas / garrapatas', precio: 7000, precioHasta: 14000 },
  {
    id: 'manejo-especial',
    nombre: 'Plus por manejo especial o conducta',
    tipo: 'porcentaje',
    precio: 15,
    precioHasta: 25,
  },
  { id: 'traslado', nombre: 'Traslado a domicilio (ida y vuelta, según zona)', precio: 6000, precioHasta: 15000 },
]

/*
  El tarifario 2027 ya contempla el tipo de manto dentro de cada rango, así que el multiplicador
  queda en 1 (se puede volver a usar desde el panel). El desenredado de nudos (+$12.000 a $25.000
  según dificultad) se elige con el selector de nudos: leves, moderados o severos.
*/
export const pricingConfig: PricingConfig = {
  multiplicadoresManto: { corto: 1, largo: 1, rizado: 1 },
  recargosNudos: { sin: 0, leves: 12000, moderados: 18000, severos: 25000 },
}
