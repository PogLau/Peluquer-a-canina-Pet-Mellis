'use client'

import { Melli } from '@/components/marca/Mascota'
import { Icon } from '@/components/ui'
import { cn } from '@/lib/cn'

export const pasosEscaneo = [
  'Buscando a tu perro en la foto',
  'Viendo el tamaño',
  'Mirando el pelo',
  'Revisando nudos y brillo',
] as const

type Props = {
  src: string
  alt: string
  /** Paso en curso (0 a 4). null: no se está escaneando. */
  paso: number | null
  /** Rótulo sobre la foto cuando terminó: «Foto de ejemplo», «Lectura automática»… */
  rotulo?: string
}

/** Foto con marco de visor y la lista de pasos. Mientras se lee, los mellis esperan en una esquina. */
export function VisorEscaneo({ src, alt, paso, rotulo }: Props) {
  const escaneando = paso !== null && paso < pasosEscaneo.length
  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-md border border-linea bg-verde shadow-ticket">
        {/* Foto local (public/fotos) o elegida por el usuario (blob:): no pasa por next/image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="aspect-square w-full object-cover" />
        {escaneando && (
          <div aria-hidden="true" className="absolute inset-0 bg-blanco/40">
            <Melli pose="foto" size={72} className="mascota-espera absolute bottom-3 right-3" />
          </div>
        )}
        {/* Esquinas del visor */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-3">
          <span className="absolute left-0 top-0 size-7 rounded-tl-md border-l border-t border-blanco" />
          <span className="absolute right-0 top-0 size-7 rounded-tr-md border-r border-t border-blanco" />
          <span className="absolute bottom-0 left-0 size-7 rounded-bl-md border-b border-l border-blanco" />
          <span className="absolute bottom-0 right-0 size-7 rounded-br-md border-b border-r border-blanco" />
        </span>
        {(escaneando || rotulo) && (
          <span className="rotulo absolute left-3 top-3 ml-9 mt-1 rounded-pill bg-verde-oscuro px-2.5 py-1 text-blanco">
            {escaneando ? 'Mirando la foto…' : rotulo}
          </span>
        )}
      </div>

      {paso !== null && (
        <ol className="flex flex-col gap-1.5" aria-label="Qué estamos mirando">
          {pasosEscaneo.map((texto, i) => {
            const hecho = i < paso
            const actual = i === paso
            return (
              <li
                key={texto}
                className={cn(
                  'flex items-center gap-2 text-sm',
                  hecho ? 'text-texto' : actual ? 'font-bold text-texto' : 'text-texto-suave',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid size-6 shrink-0 place-items-center rounded-pill border',
                    hecho ? 'border-linea bg-menta text-carbon' : 'border-linea',
                    actual && 'border-linea',
                  )}
                >
                  {hecho && <Icon name="check" size={14} />}
                </span>
                {texto}
                <span className="sr-only">{hecho ? ': listo' : actual ? ': en curso' : ''}</span>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
