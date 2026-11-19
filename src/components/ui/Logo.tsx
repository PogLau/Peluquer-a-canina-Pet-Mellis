/*
  Logo de Pet Mellis. El isotipo son los mellis: Melli y su melliza, cabeza con cabeza.
  El dibujo vive en components/marca/Mascota.tsx; los archivos para imprenta y redes, en public/marca/.
  Tamaño mínimo: isotipo 24 px de alto; imagotipo horizontal 120 px de ancho.
*/

import { Mellis } from '@/components/marca/Mascota'

type IsotipoProps = { height?: number; className?: string; title?: string }

export function Isotipo({ height = 40, className, title }: IsotipoProps) {
  return <Mellis size={height} className={className} title={title} />
}

type ImagotipoProps = {
  /** `light`: sobre blanco o fondos claros. `dark`: sobre bandas verde oscuro (texto blanco). */
  tone?: 'light' | 'dark'
  tagline?: string
  className?: string
}

/** Imagotipo horizontal: isotipo + «pet mellis» + descriptor. */
export function Imagotipo({
  tone = 'light',
  tagline = 'peluquería canina · Merlo',
  className,
}: ImagotipoProps) {
  const oscuro = tone === 'dark'
  return (
    <span className={['inline-flex items-center gap-2.5', className].filter(Boolean).join(' ')}>
      {/* Los mellis tienen relleno blanco y contorno fino: sobre verde oscuro, el contorno se lee igual */}
      <Isotipo height={40} />
      <span className="flex flex-col whitespace-nowrap leading-none">
        <span
          className={`font-display text-xl font-bold tracking-tight ${oscuro ? 'text-blanco' : 'text-texto'}`}
        >
          pet <span className={oscuro ? 'text-menta' : 'text-verde-oscuro'}>mellis</span>
        </span>
        <span className={`rotulo mt-1 ${oscuro ? 'text-blanco' : 'text-texto-suave'}`}>
          {tagline}
        </span>
      </span>
    </span>
  )
}
