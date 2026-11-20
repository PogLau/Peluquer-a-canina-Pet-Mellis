/*
  Logo de Pet Mellis (Brand Book, capítulo 2).
  - Imagotipo: la versión secundaria horizontal oficial (public/marca/logo/pet-mellis-horizontal.svg):
    los mellis, «pet» y «mellis» en verde oscuro, con el punto de la «i» naranja y
    «PELUQUERÍA CANINA» debajo. Se usa tal cual: sin sombras, sin efectos y sin cambiar sus colores.
  - Isotipo: los mellis dibujados en components/marca/Mascota.tsx.
  Tamaño mínimo en pantalla del horizontal: 160 px de ancho. Área de seguridad: 1 x alrededor.
*/

import { Mellis } from '@/components/marca/Mascota'
import { rutaPublica } from '@/lib/ruta-publica'

type IsotipoProps = { height?: number; className?: string; title?: string }

export function Isotipo({ height = 40, className, title }: IsotipoProps) {
  return <Mellis size={height} className={className} title={title} />
}

/** Proporción del archivo oficial (viewBox 1350 × 410). */
const PROPORCION = 410 / 1350

type ImagotipoProps = {
  /** `light`: sobre blanco y fondos claros (versión a color). `dark`: sobre verde oscuro o carbón. */
  tone?: 'light' | 'dark'
  /** Ancho en px. Nunca menos de 160 (mínimo del manual). */
  width?: number
  /** Texto chico debajo del logo, fuera del área de seguridad (por ejemplo, «Panel del salón»). */
  etiqueta?: string
  className?: string
}

/** Logo oficial horizontal de Pet Mellis. */
export function Imagotipo({ tone = 'light', width = 168, etiqueta, className }: ImagotipoProps) {
  const ancho = Math.max(160, width)
  const archivo = tone === 'dark' ? 'pet-mellis-horizontal-oscuro.svg' : 'pet-mellis-horizontal.svg'
  return (
    <span className={['inline-flex flex-col', className].filter(Boolean).join(' ')}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={rutaPublica(`/marca/logo/${archivo}`)}
        alt="Pet Mellis, peluquería canina"
        width={ancho}
        height={Math.round(ancho * PROPORCION)}
        className="block h-auto max-w-none"
      />
      {etiqueta && (
        <span className={`rotulo mt-1 ${tone === 'dark' ? 'text-blanco' : 'text-texto-suave'}`}>
          {etiqueta}
        </span>
      )}
    </span>
  )
}
