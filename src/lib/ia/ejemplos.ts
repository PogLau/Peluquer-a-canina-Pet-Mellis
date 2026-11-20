import type { Knots, Size } from '../pricing'

import { mantoDeTextura, tratamientoSugerido, type Hidratacion, type Textura } from './cuidado'
import type { Confianza, Sugerencia } from './sugerencia'

/*
  Ejemplos de la consulta por foto. NO son análisis de imágenes: cada foto de referencia tiene un
  resultado preparado a mano y la interfaz lo dice («Ejemplo de demo»). Sirven para mostrar el
  flujo completo sin lectura automática, también en la demo estática.
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
    id: 'pastor-brie',
    nombre: 'Pastor de Brie',
    foto: '/fotos/escaneo-pastor-brie.webp',
    alt: 'Pastor de Brie negro de pelo largo y ondulado, parado de perfil sobre el pasto',
    descripcion: 'Grande, pelo largo con nudos',
    sugerencia: ejemplo({
      raza: 'Pastor de Brie (Briard)',
      tamano: 'grande',
      textura: 'largo',
      nudos: 'moderados',
      hidratacion: 'media',
      observaciones: 'Manto largo y grueso que se apelmaza. Nudos en patas, pecho y detrás de las orejas.',
      confianza: { tamano: 'media' },
    }),
  },
  {
    id: 'spaniel',
    nombre: 'Spaniel',
    foto: '/fotos/escaneo-spaniel.webp',
    alt: 'Perro tipo spaniel de pelo largo color rojizo, con la lengua afuera en un campo',
    descripcion: 'Orejas con flecos, pelo seco',
    sugerencia: ejemplo({
      raza: 'Spaniel de pelo largo (mestizo)',
      tamano: 'mediano',
      textura: 'largo',
      nudos: 'leves',
      hidratacion: 'baja',
      observaciones: 'Flecos largos en orejas y pecho, opacos y secos. Nudos leves detrás de las orejas.',
    }),
  },
  {
    id: 'shih-tzu',
    nombre: 'Shih Tzu',
    foto: '/fotos/escaneo-shih-tzu.webp',
    alt: 'Shih Tzu blanco y marrón echado en la vereda, con el pelo prolijo y la lengua afuera',
    descripcion: 'Pelo largo y prolijo, pide corte',
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
