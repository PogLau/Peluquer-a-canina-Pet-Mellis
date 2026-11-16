import type { Extra, PricingConfig, Service } from './pricing'

/*
  Catálogo de demo (CLAUDE.md §8, tomado del prototipo).
  Es la base del seed: en la Fase 2 los precios pasan a vivir en Payload y esto queda solo para cargar datos.
  Pendiente: confirmar valores y duraciones con la peluquera.
*/

export const servicios: Service[] = [
  {
    id: 'bano-corte',
    nombre: 'Baño y Corte',
    descripcion: 'Baño completo, secado y corte a elección.',
    duracion: '2 a 3 h',
    precios: { chico: 8500, mediano: 11500, grande: 15000 },
    aplicaRecargoManto: true,
    popular: true,
  },
  {
    id: 'bano-cepillado',
    nombre: 'Baño y Cepillado',
    descripcion: 'Baño, secado y cepillado sin corte.',
    duracion: '1 a 2 h',
    precios: { chico: 5500, mediano: 7500, grande: 10000 },
    aplicaRecargoManto: true,
  },
  {
    id: 'corte-estetico',
    nombre: 'Corte Estético',
    descripcion: 'Corte de raza o a gusto, sin baño.',
    duracion: '1,5 a 2 h',
    precios: { chico: 7000, mediano: 9500, grande: 12500 },
    aplicaRecargoManto: true,
  },
  {
    id: 'unas',
    nombre: 'Corte de Uñas',
    descripcion: 'Corte y limado de uñas.',
    duracion: '15 a 20 min',
    precios: { chico: 2000, mediano: 2000, grande: 2500 },
    aplicaRecargoManto: false,
  },
  {
    id: 'deslanado',
    nombre: 'Deslanado Profundo',
    descripcion: 'Retira el pelo muerto de la capa interna.',
    duracion: '1 a 2 h',
    precios: { chico: 5000, mediano: 7000, grande: 9500 },
    aplicaRecargoManto: true,
  },
]

export const extras: Extra[] = [
  { id: 'oidos', nombre: 'Limpieza de oídos', precio: 1500 },
  { id: 'glandulas', nombre: 'Vaciado de glándulas anales', precio: 1800 },
  { id: 'dental', nombre: 'Cepillado dental con enzimático', precio: 1500 },
  { id: 'antipulgas', nombre: 'Baño antipulgas y garrapatas', precio: 3000 },
  { id: 'perfume', nombre: 'Perfume hipoalergénico y moño', precio: 1000 },
]

export const pricingConfig: PricingConfig = {
  multiplicadoresManto: { corto: 1, largo: 1.15, rizado: 1.2 },
  recargosNudos: { sin: 0, leves: 1500, moderados: 3500, severos: 6000 },
}
