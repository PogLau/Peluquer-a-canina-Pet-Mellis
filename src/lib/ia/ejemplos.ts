import type { Knots, Size } from '../pricing'

import { mantoDeTextura, tratamientoSugerido, type Hidratacion, type Textura } from './cuidado'
import type { Confianza, Sugerencia } from './sugerencia'

/*
  Ejemplos de IA Scan & Care. NO son análisis de imágenes: cada foto de referencia tiene un
  resultado preparado a mano y la interfaz lo dice («Ejemplo de demo»). Sirven para mostrar el
  flujo completo sin clave de IA, también en la demo estática.
  Las fotos están en public/fotos (créditos en docs/fotos.md).
*/

export type EjemploMascota = {
  id: string
  nombre: string
  /** Ruta dentro de /public (sin basePath: la arma el componente). */
  foto: string
  alt: string
  descripcion: string
  sugerencia: Sugerencia
}

function ejemplo(datos: {
  raza: string
  tamano: Size
  textura: Textura
  nudos: Knots
  hidratacion: Hidratacion
  observaciones: string
  confianza?: Partial<Sugerencia['confianza']>
}): Sugerencia {
  const confianza: Record<'tamano' | 'manto' | 'nudos', Confianza> = {
    tamano: 'media',
    manto: 'alta',
    nudos: 'media',
    ...datos.confianza,
  }
  return {
    raza: datos.raza,
    tamano: datos.tamano,
    manto: mantoDeTextura(datos.textura),
    nudos: datos.nudos,
    observaciones: datos.observaciones,
    textura: datos.textura,
    hidratacion: datos.hidratacion,
    tratamiento: tratamientoSugerido(datos),
    confianza,
    origen: 'ejemplo',
  }
}

export const ejemplosMascota: readonly EjemploMascota[] = [
  {
    id: 'caniche',
    nombre: 'Caniche',
    foto: '/fotos/caniche-mix.webp',
    alt: 'Perro tipo caniche gris y negro, de pelo rizado, con la lengua afuera',
    descripcion: 'Rizado, con nudos en orejas y pecho',
    sugerencia: ejemplo({
      raza: 'Caniche Toy (mestizo)',
      tamano: 'chico',
      textura: 'rizado',
      nudos: 'moderados',
      hidratacion: 'media',
      observaciones: 'Nudos detrás de las orejas y en el pecho. Rizo cerrado que se apelmaza.',
    }),
  },
  {
    id: 'yorkshire',
    nombre: 'Yorkshire',
    foto: '/fotos/yorkshire-largo.webp',
    alt: 'Yorkshire terrier de manto largo, acostado sobre una manta blanca',
    descripcion: 'Manto largo, puntas secas',
    sugerencia: ejemplo({
      raza: 'Yorkshire Terrier',
      tamano: 'chico',
      textura: 'largo',
      nudos: 'leves',
      hidratacion: 'baja',
      observaciones: 'Manto largo y fino con puntas abiertas. Nudos leves detrás de las orejas.',
    }),
  },
  {
    id: 'shih-tzu',
    nombre: 'Shih Tzu',
    foto: '/fotos/shih-tzu.webp',
    alt: 'Shih Tzu blanco y marrón sentado, con el pelo largo y prolijo',
    descripcion: 'Largo y prolijo, pide corte',
    sugerencia: ejemplo({
      raza: 'Shih Tzu',
      tamano: 'chico',
      textura: 'largo',
      nudos: 'sin',
      hidratacion: 'buena',
      observaciones: 'Pelo largo, suelto y con brillo. Le tapa los ojos: conviene el corte de raza.',
      confianza: { nudos: 'alta' },
    }),
  },
]
