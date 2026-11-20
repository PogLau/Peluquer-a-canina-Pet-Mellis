/*
  Logo de Pet Mellis (Brand Book, capítulo 2).
  - Imagotipo: la versión secundaria horizontal oficial: los mellis, «pet» y «mellis» en verde oscuro,
    con el punto de la «i» naranja. Sin sombras ni efectos.
  - El descriptor «PELUQUERÍA CANINA» va como texto real en Outfit y no dentro del dibujo: en el
    archivo original, al tamaño de un header, quedaba de 2 px y no se leía. Como texto mide 12 px
    (el mínimo del manual) y se alinea debajo de «pet mellis», como en el original.
    El archivo `public/marca/logo/pet-mellis-horizontal-sin-descriptor.svg` es el original sin el
    descriptor y sin el margen de seguridad (lo da el contenedor).
  - Isotipo: los mellis dibujados en components/marca/Mascota.tsx.
  Tamaño mínimo en pantalla del horizontal: 160 px de ancho.
*/

import { Mellis } from '@/components/marca/Mascota'
import { rutaPublica } from '@/lib/ruta-publica'

type IsotipoProps = { height?: number; className?: string; title?: string }

export function Isotipo({ height = 40, className, title }: IsotipoProps) {
  return <Mellis size={height} className={className} title={title} />
}

/** Proporción del archivo sin descriptor (viewBox 1270 × 330). */
const PROPORCION = 330 / 1270
/** Dónde empieza «pet» dentro del dibujo: ahí se alinea el descriptor. */
const INICIO_NOMBRE = '42.3%'

type ImagotipoProps = {
  /** `light`: sobre blanco y fondos claros (versión a color). `dark`: sobre verde oscuro o carbón. */
  tone?: 'light' | 'dark'
  /** Ancho del dibujo en px. Nunca menos de 160 (mínimo del manual). */
  width?: number
  /** Texto chico debajo del logo (por ejemplo, «Panel del salón»). */
  etiqueta?: string
  className?: string
}

/** Logo oficial horizontal de Pet Mellis con el descriptor legible. */
export function Imagotipo({ tone = 'light', width = 220, etiqueta, className }: ImagotipoProps) {
  const ancho = Math.max(160, width)
  const oscuro = tone === 'dark'
  const archivo = oscuro
    ? 'pet-mellis-horizontal-oscuro-sin-descriptor.svg'
    : 'pet-mellis-horizontal-sin-descriptor.svg'
  return (
    <span className={['inline-flex flex-col', className].filter(Boolean).join(' ')}>
      <span className="relative block" style={{ width: ancho }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={rutaPublica(`/marca/logo/${archivo}`)}
          alt="Pet Mellis, peluquería canina"
          width={ancho}
          height={Math.round(ancho * PROPORCION)}
          className="block h-auto max-w-none"
        />
        {/* Descriptor: Outfit Medium 12 px en mayúsculas, debajo de «pet mellis» */}
        <span
          aria-hidden="true"
          className={`absolute top-[74%] whitespace-nowrap font-sans text-xs font-medium uppercase leading-none tracking-[0.08em] ${oscuro ? 'text-blanco' : 'text-texto-suave'}`}
          style={{ left: INICIO_NOMBRE }}
        >
          Peluquería canina
        </span>
      </span>
      {etiqueta && (
        <span className={`rotulo mt-2 ${oscuro ? 'text-blanco' : 'text-texto-suave'}`}>
          {etiqueta}
        </span>
      )}
    </span>
  )
}
