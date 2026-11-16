import type { Sugerencia } from './sugerencia'

/*
  Ejemplos de la demo. NO son análisis de imágenes: son resultados precargados
  y la interfaz lo dice. Sirven para mostrar el flujo sin clave de IA.
*/

export type EjemploMascota = {
  id: string
  nombre: string
  descripcion: string
  sugerencia: Sugerencia
}

export const ejemplosMascota: readonly EjemploMascota[] = [
  {
    id: 'toby',
    nombre: 'Toby',
    descripcion: 'Caniche Toy de 4 kg, pelo rizado y enredado',
    sugerencia: {
      raza: 'Caniche Toy',
      tamano: 'chico',
      manto: 'rizado',
      nudos: 'moderados',
      observaciones: 'Nudos detrás de las orejas y en las patas. Manto rizado.',
      confianza: { tamano: 'media', manto: 'alta', nudos: 'media' },
      origen: 'ejemplo',
    },
  },
  {
    id: 'luna',
    nombre: 'Luna',
    descripcion: 'Golden Retriever de 30 kg, pelo largo',
    sugerencia: {
      raza: 'Golden Retriever',
      tamano: 'grande',
      manto: 'largo',
      nudos: 'leves',
      observaciones: 'Algunos nudos leves en la cola y detrás de las patas. Manto largo con subpelo.',
      confianza: { tamano: 'media', manto: 'alta', nudos: 'media' },
      origen: 'ejemplo',
    },
  },
  {
    id: 'coco',
    nombre: 'Coco',
    descripcion: 'Shih Tzu de 6 kg, pelo largo y prolijo',
    sugerencia: {
      raza: 'Shih Tzu',
      tamano: 'chico',
      manto: 'largo',
      nudos: 'sin',
      observaciones: 'Manto largo y cepillado, sin nudos visibles.',
      confianza: { tamano: 'media', manto: 'alta', nudos: 'alta' },
      origen: 'ejemplo',
    },
  },
]
